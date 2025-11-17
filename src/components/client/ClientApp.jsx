import React, { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

import ClientHeader from '@/components/client/ClientHeader';
import ProductsView from '@/components/client/ProductsView';
import OrdersView from '@/components/client/OrdersView';
import CartSidebar from '@/components/client/CartSidebar';

import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';
import { toast } from '@/components/ui/use-toast';

const ClientApp = () => {
  const { user, profile, logout } = useAuth();
  const { products, categories, createOrder, getOrdersByCustomer, loading: dataLoading } = useData();

  // =============================
  // ✅ PASO 5: currentView persistente
  // =============================
  const [currentView, setCurrentView] = useState(
    () => localStorage.getItem('client_current_view') || 'products'
  );

  useEffect(() => {
    localStorage.setItem('client_current_view', currentView);
  }, [currentView]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [showCart, setShowCart] = useState(false);
  const [userOrders, setUserOrders] = useState([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);

  const { cart, addToCart, removeFromCart, updateQuantity, getTotalPrice, getTotalItems, clearCart } =
    useCart(user?.id);

  const { favorites, toggleFavorite } = useFavorites(user?.id);

  // Obtener pedidos del usuario
  const fetchUserOrders = useCallback(async () => {
    if (user?.id) {
      setIsOrdersLoading(true);
      const fetchedOrders = await getOrdersByCustomer(user.id);
      setUserOrders(fetchedOrders || []);
      setIsOrdersLoading(false);
    }
  }, [user?.id, getOrdersByCustomer]);

  useEffect(() => {
    if (currentView === 'orders') {
      fetchUserOrders();
    }
  }, [currentView, fetchUserOrders]);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "Agrega productos antes de proceder.",
        variant: "destructive",
      });
      return;
    }

    if (!user || !profile) {
      toast({
        title: "Error",
        description: "No se pudo identificar al usuario.",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      customerId: user.id,
      items: cart,
      total: getTotalPrice(),
      shippingAddress: {
        street: profile.address?.street || "123 Calle Falsa",
        city: profile.address?.city || "Ciudad Ejemplo",
        zip: profile.address?.zip || "00000",
      },
    };

    const newOrder = await createOrder(orderData);

    if (newOrder) {
      clearCart();
      setShowCart(false);
      await fetchUserOrders();
      setCurrentView('orders'); // 👈 Mantener vista
    }
  };

  // Loader principal del cliente
  if (dataLoading && products.length === 0 && categories.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-6" />
        <p className="text-2xl font-semibold text-gray-700">Cargando tu experiencia...</p>
      </div>
    );
  }

  const displayName = profile?.full_name || user?.email || 'Cliente';

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientHeader
        user={{ ...user, name: displayName }}
        logout={logout}
        currentView={currentView}
        setCurrentView={setCurrentView}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        getTotalItems={getTotalItems}
        setShowCart={setShowCart}
      />

      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        {currentView === 'products' ? (
          <ProductsView
            user={profile || user}
            products={products}
            categories={categories}
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            addToCart={addToCart}
            toggleFavorite={toggleFavorite}
            favorites={favorites}
            isLoading={dataLoading && products.length === 0}
          />
        ) : (
          <OrdersView
            userOrders={userOrders}
            setCurrentView={setCurrentView}
            isLoading={isOrdersLoading}
          />
        )}
      </main>

      <CartSidebar
        showCart={showCart}
        setShowCart={setShowCart}
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        getTotalPrice={getTotalPrice}
        getTotalItems={getTotalItems}
        handleCheckout={handleCheckout}
      />
    </div>
  );
};

export default ClientApp;