import React from 'react';
import { ShoppingCart, Search, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ClientHeader = ({ 
  user, 
  logout, 
  currentView, 
  setCurrentView, 
  searchTerm, 
  setSearchTerm, 
  getTotalItems, 
  setShowCart 
}) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MiTienda Pro
            </h1>
            <nav className="flex space-x-4">
              <Button
                variant={currentView === 'products' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('products')}
              >
                Productos
              </Button>
              <Button
                variant={currentView === 'orders' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('orders')}
              >
                Mis Pedidos
              </Button>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {currentView === 'products' && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
            )}
            
            <Button
              onClick={() => setShowCart(true)}
              className="relative bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <ShoppingCart className="w-5 h-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold pulse-glow">
                  {getTotalItems()}
                </span>
              )}
            </Button>
            
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">{user.name}</span>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ClientHeader;