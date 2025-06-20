import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, DollarSign, ShoppingBag, Users, Package, 
  AlertTriangle, Eye, Calendar, ArrowUp, ArrowDown, Plus, UserPlus, Tag, Loader2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { toast } from '@/components/ui/use-toast';

const StatCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
    <div className="flex items-center justify-between">
      <div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-8 bg-gray-300 rounded w-1/2"></div>
      </div>
      <div className="p-3 rounded-full bg-gray-200 w-14 h-14"></div>
    </div>
  </div>
);


const AdminDashboard = ({ setCurrentView }) => {
  const { products, orders, customers, categories, getStats, loading: dataLoading } = useData();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    if (!dataLoading) {
      setStats(getStats());
      setRecentOrders(orders.slice(0, 5));
      setLowStockProducts(products.filter(product => product.stock < 5));
    }
  }, [dataLoading, products, orders, customers, getStats]);

  
  if (dataLoading || !stats) {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl p-8 text-white shadow-xl animate-pulse">
          <div className="h-8 bg-blue-400 rounded w-3/4 mb-3"></div>
          <div className="h-6 bg-purple-400 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
         <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
           <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
             <div className="h-24 bg-gray-200 rounded-lg"></div>
             <div className="h-24 bg-gray-200 rounded-lg"></div>
             <div className="h-24 bg-gray-200 rounded-lg"></div>
             <div className="h-24 bg-gray-200 rounded-lg"></div>
           </div>
         </div>
      </div>
    );
  }


  const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              <span className="text-sm ml-1">{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color} shadow-md`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </motion.div>
  );

  const handleQuickAction = (viewId, modalType = null) => {
    setCurrentView(viewId, modalType);
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-2">¡Bienvenido al Panel de Administración!</h1>
        <p className="opacity-90 text-lg">Gestiona tu tienda de manera eficiente desde aquí.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Ingresos Totales"
          value={`${stats.totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          color="bg-gradient-to-r from-green-500 to-teal-500"
        />
        <StatCard
          title="Pedidos Totales"
          value={stats.totalOrders}
          icon={ShoppingBag}
          color="bg-gradient-to-r from-blue-500 to-indigo-500"
        />
        <StatCard
          title="Clientes"
          value={stats.totalCustomers}
          icon={Users}
          color="bg-gradient-to-r from-purple-500 to-pink-500"
        />
        <StatCard
          title="Productos"
          value={stats.totalProducts}
          icon={Package}
          color="bg-gradient-to-r from-orange-500 to-red-500"
        />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <TrendingUp className="w-6 h-6 mr-3 text-blue-600" />
          Acciones Rápidas
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            onClick={() => handleQuickAction('products', 'addProduct')}
            className="p-6 h-auto flex-col bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="w-8 h-8 mb-2" />
            <span className="font-medium">Agregar Producto</span>
          </Button>
          <Button
            onClick={() => handleQuickAction('categories', 'addCategory')}
            className="p-6 h-auto flex-col bg-gradient-to-br from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all"
          >
            <Tag className="w-8 h-8 mb-2" />
            <span className="font-medium">Agregar Categoría</span>
          </Button>
          <Button
            onClick={() => handleQuickAction('customers')}
            className="p-6 h-auto flex-col bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-md hover:shadow-lg transition-all"
          >
            <Users className="w-8 h-8 mb-2" />
            <span className="font-medium">Ver Clientes</span>
          </Button>
          <Button
            onClick={() => handleQuickAction('admins', 'addAdmin')}
            className="p-6 h-auto flex-col bg-gradient-to-br from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-md hover:shadow-lg transition-all"
          >
            <UserPlus className="w-8 h-8 mb-2" />
            <span className="font-medium">Crear Admin</span>
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Pedidos Recientes</h3>
            <Button variant="ghost" size="sm" onClick={() => setCurrentView('orders')} className="text-blue-600 hover:bg-blue-50">
              Ver todos
              <Eye className="w-4 h-4 ml-2 text-blue-600" />
            </Button>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {recentOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No hay pedidos recientes</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div>
                    <p className="font-medium text-gray-800">#{order.id.substring(0,8)}</p>
                    <p className="text-sm text-gray-500">{order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">${order.total.toFixed(2)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                      'bg-red-100 text-red-800' // for cancelled
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Alertas de Stock Bajo</h3>
             <Button variant="ghost" size="sm" onClick={() => setCurrentView('products')} className="text-yellow-600 hover:bg-yellow-50">
              Ver todos
              <AlertTriangle className="w-4 h-4 ml-2 text-yellow-500" />
            </Button>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {lowStockProducts.length === 0 ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-green-600 font-medium">¡Todo en stock!</p>
                <p className="text-sm text-gray-500">No hay productos con stock bajo</p>
              </div>
            ) : (
              lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg border border-yellow-200 transition-colors">
                  <div>
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-500 capitalize">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-yellow-700">Stock: {product.stock}</p>
                    <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;