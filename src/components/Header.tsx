import { ShoppingCart, LayoutDashboard } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface HeaderProps {
  onCartClick: () => void;
  onDashboardClick: () => void;
  currentView: string;
}

export default function Header({ onCartClick, onDashboardClick, currentView }: HeaderProps) {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

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
                <button
                  onClick={onDashboardClick}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <LayoutDashboard size={20} />
                  <span className="text-sm font-medium">Dashboard</span>
                </button>

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
          </nav>
        </div>
      </div>
    </header>
  );
}
