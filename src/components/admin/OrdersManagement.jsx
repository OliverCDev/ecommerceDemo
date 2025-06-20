
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Eye, Package, Clock, CheckCircle, XCircle, Truck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';

const OrdersManagement = () => {
  const { orders, updateOrderStatus, loading: dataLoading } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('todos');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statusOptions = [
    { id: 'todos', name: 'Todos' },
    { id: 'pending', name: 'Pendiente' },
    { id: 'processing', name: 'Procesando' },
    { id: 'shipped', name: 'Enviado' },
    { id: 'delivered', name: 'Entregado' },
    { id: 'cancelled', name: 'Cancelado' }
  ];

  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      order.id.toLowerCase().includes(searchLower) ||
      order.customerName?.toLowerCase().includes(searchLower) ||
      order.customerEmail?.toLowerCase().includes(searchLower);
    const matchesStatus = selectedStatusFilter === 'todos' || order.status === selectedStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusVisuals = (status) => {
    switch (status) {
      case 'pending': return { icon: Clock, color: 'bg-yellow-100 text-yellow-800 border-yellow-300', text: 'Pendiente' };
      case 'processing': return { icon: Package, color: 'bg-blue-100 text-blue-800 border-blue-300', text: 'Procesando' };
      case 'shipped': return { icon: Truck, color: 'bg-purple-100 text-purple-800 border-purple-300', text: 'Enviado' };
      case 'delivered': return { icon: CheckCircle, color: 'bg-green-100 text-green-800 border-green-300', text: 'Entregado' };
      case 'cancelled': return { icon: XCircle, color: 'bg-red-100 text-red-800 border-red-300', text: 'Cancelado' };
      default: return { icon: Package, color: 'bg-gray-100 text-gray-800 border-gray-300', text: status };
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => ({ ...prev, status: newStatus }));
    }
  };

  const OrderDetailModal = ({ order, onClose }) => {
    if (!order) return null;
    const visuals = getStatusVisuals(order.status);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b sticky top-0 bg-white z-10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                Pedido #{order.id.substring(0,8)}...
              </h2>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <XCircle className="w-6 h-6" />
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2 text-lg">Información del Cliente</h3>
                <p className="text-gray-600"><strong>Nombre:</strong> {order.customerName}</p>
                <p className="text-gray-600"><strong>Email:</strong> {order.customerEmail}</p>
                {order.shippingAddress && typeof order.shippingAddress === 'object' && (
                  <p className="text-gray-600 mt-1">
                    <strong>Dirección:</strong> {`${order.shippingAddress.street || ''}, ${order.shippingAddress.city || ''}, ${order.shippingAddress.zip || ''}`}
                  </p>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2 text-lg">Detalles del Pedido</h3>
                <p className="text-gray-600">
                  <strong>Fecha:</strong> {new Date(order.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-gray-600"><strong>Total:</strong> <span className="font-bold text-blue-600">${order.total.toFixed(2)}</span></p>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold border ${visuals.color}`}>
                    <visuals.icon className="w-5 h-5 mr-2" />
                    {visuals.text}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-3 text-lg">Productos del Pedido</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <img 
                        className="w-14 h-14 object-cover rounded-md shadow-sm" 
                        alt={`${item.name} en pedido`}
                       src="https://images.unsplash.com/photo-1571302171879-0965db383dc4" />
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-700">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-3 text-lg">Actualizar Estado del Pedido</h3>
              <div className="flex flex-wrap gap-3">
                {statusOptions.filter(s => s.id !== 'todos').map((status) => (
                  <Button
                    key={status.id}
                    variant={order.status === status.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange(order.id, status.id)}
                    className={`transition-all duration-200 ${order.status === status.id ? getStatusVisuals(status.id).color.replace('bg-', 'border-2 border-').replace('text-', 'hover:text-') : 'hover:border-gray-400'}`}
                  >
                    {status.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };
  
  if (dataLoading && orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-lg text-gray-700">Cargando pedidos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Pedidos</h1>
        <p className="text-gray-600">Administra y actualiza el estado de los pedidos de tus clientes.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por ID, cliente o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow hover:shadow-sm"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow hover:shadow-sm bg-white"
            >
              {statusOptions.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">No se encontraron pedidos</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              No hay pedidos que coincidan con los filtros seleccionados. Intenta ajustar tu búsqueda.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Pedido', 'Cliente', 'Fecha', 'Total', 'Estado', 'Acciones'].map(header => (
                    <th key={header} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <AnimatePresence>
                  {filteredOrders.map((order) => {
                    const visuals = getStatusVisuals(order.status);
                    return (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">#{order.id.substring(0,8)}...</div>
                          <div className="text-xs text-gray-500">{order.items.length} producto(s)</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                          <div className="text-xs text-gray-500">{order.customerEmail}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString('es-ES')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                          ${order.total.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${visuals.color}`}>
                            <visuals.icon className="w-4 h-4 mr-1.5" />
                            {visuals.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                            className="border-gray-300 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Eye className="w-4 h-4 mr-1.5" />
                            Ver Detalles
                          </Button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrdersManagement;
