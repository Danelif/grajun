import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header';
import Shop from './components/Shop';
import ShoppingCart from './components/ShoppingCart';
import Dashboard from './components/Dashboard';
import Login from './components/Login';

function App() {
  const [currentView, setCurrentView] = useState<'shop' | 'dashboard'>('shop');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-gray-50">
          <Header
            onCartClick={() => setIsCartOpen(true)}
            onDashboardClick={() => setCurrentView('dashboard')}
            onLoginClick={() => setIsLoginOpen(true)}
            currentView={currentView}
          />

          {currentView === 'shop' ? (
            <Shop />
          ) : (
            <Dashboard onBackToShop={() => setCurrentView('shop')} />
          )}

          <ShoppingCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          {isLoginOpen && <Login onClose={() => setIsLoginOpen(false)} />}
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
