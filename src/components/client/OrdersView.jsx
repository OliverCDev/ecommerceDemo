
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ShoppingBag, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const OrdersView = ({ userOrders, setCurrentView, isLoading }) => {

  const getStatusVisuals = (status) => {
    switch (status) {
      case 'pending': return { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', text: 'Pendiente' };
      case 'processing': return { color: 'bg-blue-100 text-blue-800 border-blue-300', text: 'Procesando' };
      case 'shipped': return { color: 'bg-purple-100 text-purple-800 border-purple-300', text: 'Enviado' };
      case 'delivered': return { color: 'bg-green-100 text-green-800 border-green-300', text: 'Entregado' };
      case 'cancelled': return { color: 'bg-red-100 text-red-800 border-red-300', text: 'Cancelado' };
      default: return { color: 'bg-gray-100 text-gray-800 border-gray-300', text: status };
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-lg text-gray-700">Cargando tus pedidos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Mis Pedidos</h1>
      
      {userOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-md">
          <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-gray-700 mb-3">No tienes pedidos aún</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Parece que todavía no has realizado ninguna compra. ¡Explora nuestros productos y encuentra algo que te encante!
          </p>
          <Button
            onClick={() => setCurrentView('products')}
            className="mt-8 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white px-8 py-3 text-lg rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            Explorar Productos
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {userOrders.map((order) => {
              const visuals = getStatusVisuals(order.status);
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">Pedido #{order.id.substring(0,8)}...</h3>
                      <p className="text-sm text-gray-500">Realizado el: {new Date(order.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${visuals.color} whitespace-nowrap`}>
                      {visuals.text}
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-5 border-t border-b py-4">
                    <h4 className="font-medium text-gray-700">Productos:</h4>
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-3">
                          <img  
                            className="w-12 h-12 object-cover rounded-md shadow-sm" 
                            alt={item.name}
                           src="https://images.unsplash.com/photo-1571302171879-0965db383dc4" />
                          <span>{item.name} (x{item.quantity})</span>
                        </div>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-end items-center">
                    <span className="text-gray-600 font-medium mr-2">Total del Pedido:</span>
                    <span className="text-xl font-bold text-blue-600">${order.total.toFixed(2)}</span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default OrdersView;
