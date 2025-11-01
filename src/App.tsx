import { useState } from 'react';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header';
import Shop from './components/Shop';
import ShoppingCart from './components/ShoppingCart';
import Dashboard from './components/Dashboard';

function App() {
  const [currentView, setCurrentView] = useState<'shop' | 'dashboard'>('shop');
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        <Header
          onCartClick={() => setIsCartOpen(true)}
          onDashboardClick={() => setCurrentView('dashboard')}
          currentView={currentView}
        />

        {currentView === 'shop' ? (
          <Shop />
        ) : (
          <Dashboard onBackToShop={() => setCurrentView('shop')} />
        )}

        <ShoppingCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
    </CartProvider>
  );
}

export default App;
