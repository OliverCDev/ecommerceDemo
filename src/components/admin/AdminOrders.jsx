import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';

const AdminOrders = () => {
  const { orders, updateOrderStatus } = useData();

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'processing': return 'Procesando';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregado';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Gestión de Pedidos</h2>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">Pedido #{order.id}</h3>
                <p className="text-gray-600">{order.customerName} - {order.customerEmail}</p>
                <p className="text-gray-500 text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  className={`px-3 py-1 rounded-full text-sm font-semibold border-0 ${getOrderStatusColor(order.status)}`}
                >
                  <option value="pending">Pendiente</option>
                  <option value="processing">Procesando</option>
                  <option value="shipped">Enviado</option>
                  <option value="delivered">Entregado</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <h4 className="font-semibold">Productos:</h4>
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                  <span>{item.name} x{item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span className="text-blue-600">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;