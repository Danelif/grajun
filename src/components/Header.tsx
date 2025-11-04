import { ShoppingCart, LayoutDashboard, LogIn, LogOut, User } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onCartClick: () => void;
  onDashboardClick: () => void;
  onLoginClick: () => void;
  currentView: string;
}

export default function Header({ onCartClick, onDashboardClick, onLoginClick, currentView }: HeaderProps) {
  const { getTotalItems } = useCart();
  const { user, profile, signOut, isAdmin } = useAuth();
  const totalItems = getTotalItems();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">FASHION STORE</h1>
          </div>

          <nav className="flex items-center space-x-6">
            {currentView !== 'dashboard' && (
              <>
                {user && isAdmin() && (
                  <button
                    onClick={onDashboardClick}
                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <LayoutDashboard size={20} />
                    <span className="text-sm font-medium">Dashboard</span>
                  </button>
                )}

                <button
                  onClick={onCartClick}
                  className="relative flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <ShoppingCart size={20} />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </button>
              </>
            )}

            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-700">
                  <User size={16} />
                  <span className="text-sm">{profile?.email}</span>
                  {profile?.role === 'admin' && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Admin</span>
                  )}
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <LogOut size={20} />
                  <span className="text-sm font-medium">Déconnexion</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <LogIn size={20} />
                <span className="text-sm font-medium">Connexion</span>
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
