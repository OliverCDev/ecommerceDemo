
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, Mail, Phone, MapPin, Calendar, ShoppingBag, User, Loader2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';

const CustomersManagement = () => {
  const { customers, orders, loading: dataLoading } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const filteredCustomers = customers.filter(customer =>
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCustomerOrders = (customerId) => {
    return orders.filter(order => order.customerId === customerId);
  };

  const getCustomerStats = (customerId) => {
    const customerOrders = getCustomerOrders(customerId);
    const totalSpent = customerOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = customerOrders.length;
    const lastOrderDate = customerOrders.length > 0 
      ? new Date(Math.max(...customerOrders.map(order => new Date(order.createdAt).getTime())))
      : null;
    
    return {
      totalSpent,
      totalOrders,
      lastOrderDate
    };
  };

  const CustomerDetailModal = ({ customer, onClose }) => {
    if (!customer) return null;

    const customerOrders = getCustomerOrders(customer.id);
    const stats = getCustomerStats(customer.id);

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
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b sticky top-0 bg-white z-10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                Detalles del Cliente
              </h2>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <XCircle className="w-6 h-6" />
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-3">Información Personal</h3>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold shadow-md">
                    {customer.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-gray-800">{customer.name}</p>
                    <p className="text-sm text-gray-500">Cliente Registrado</p>
                  </div>
                </div>
                
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-center space-x-3"> <Mail className="w-5 h-5 text-blue-500" /> <span>{customer.email}</span> </div>
                  {customer.phone && ( <div className="flex items-center space-x-3"> <Phone className="w-5 h-5 text-blue-500" /> <span>{customer.phone}</span> </div> )}
                  {customer.address && ( <div className="flex items-center space-x-3"> <MapPin className="w-5 h-5 text-blue-500" /> <span>{customer.address}</span> </div> )}
                  <div className="flex items-center space-x-3"> <Calendar className="w-5 h-5 text-blue-500" /> <span>Registrado: {new Date(customer.createdAt).toLocaleDateString('es-ES')}</span> </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-3">Estadísticas de Compra</h3>
                <div className="grid grid-cols-1 gap-4">
                  <StatCard icon={ShoppingBag} title="Total Gastado" value={`$${stats.totalSpent.toFixed(2)}`} color="bg-blue-100 text-blue-700" />
                  <StatCard icon={Eye} title="Total Pedidos" value={stats.totalOrders} color="bg-green-100 text-green-700" />
                  {stats.lastOrderDate && (
                    <StatCard icon={Calendar} title="Último Pedido" value={stats.lastOrderDate.toLocaleDateString('es-ES')} color="bg-purple-100 text-purple-700" />
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Historial de Pedidos</h3>
              {customerOrders.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                  <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 text-lg">Este cliente no ha realizado pedidos aún.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
                  {customerOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">
                      <div>
                        <p className="font-medium text-gray-800">Pedido #{order.id.substring(0,8)}...</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('es-ES')} - {order.items.length} producto(s)
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-blue-600">${order.total.toFixed(2)}</p>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusVisuals(order.status).color}`}>
                          {getStatusVisuals(order.status).text}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className={`p-4 rounded-lg shadow-sm ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className={`p-2.5 rounded-full ${color.replace('text-', 'bg-').replace('100', '200')}`}>
          <Icon className="w-6 h-6 opacity-70" />
        </div>
      </div>
    </div>
  );
  
  const getStatusVisuals = (status) => {
    // Simplified version for modal, can be expanded
    switch (status) {
      case 'pending': return { color: 'bg-yellow-100 text-yellow-800', text: 'Pendiente' };
      case 'delivered': return { color: 'bg-green-100 text-green-800', text: 'Entregado' };
      default: return { color: 'bg-blue-100 text-blue-800', text: status };
    }
  };

  if (dataLoading && customers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-lg text-gray-700">Cargando clientes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Clientes</h1>
        <p className="text-gray-600">Administra y visualiza la información de tus valiosos clientes.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar clientes por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow hover:shadow-sm"
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredCustomers.map((customer) => {
            const stats = getCustomerStats(customer.id);
            return (
              <motion.div
                key={customer.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 flex flex-col"
              >
                <div className="flex items-center space-x-4 mb-5">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-semibold shadow-md">
                    {customer.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-gray-800 truncate" title={customer.name}>{customer.name}</h3>
                    <p className="text-sm text-gray-500 truncate" title={customer.email}>{customer.email}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-5 text-sm text-gray-600 flex-grow">
                  {customer.phone && ( <div className="flex items-center space-x-2"> <Phone className="w-4 h-4 text-gray-400" /> <span>{customer.phone}</span> </div> )}
                  <div className="flex items-center space-x-2"> <Calendar className="w-4 h-4 text-gray-400" /> <span>Registrado: {new Date(customer.createdAt).toLocaleDateString('es-ES')}</span> </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <p className="text-xs text-blue-600 font-medium uppercase tracking-wider">Pedidos</p>
                    <p className="text-xl font-bold text-blue-700">{stats.totalOrders}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <p className="text-xs text-green-600 font-medium uppercase tracking-wider">Gastado</p>
                    <p className="text-xl font-bold text-green-700">${stats.totalSpent.toFixed(0)}</p>
                  </div>
                </div>

                <Button
                  onClick={() => setSelectedCustomer(customer)}
                  variant="outline"
                  className="w-full mt-auto border-gray-300 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Detalles
                </Button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredCustomers.length === 0 && !dataLoading && (
        <div className="text-center py-16 col-span-full">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <User className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-3">No se encontraron clientes</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            No hay clientes que coincidan con tu búsqueda. Revisa los términos o espera a que se registren nuevos usuarios.
          </p>
        </div>
      )}

      <AnimatePresence>
        {selectedCustomer && (
          <CustomerDetailModal
            customer={selectedCustomer}
            onClose={() => setSelectedCustomer(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomersManagement;
