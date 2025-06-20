import React, { useState, useEffect, useCallback } from 'react';
import { Package, Users, ShoppingBag, UserPlus, Settings, Tag, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminDashboard from '@/components/admin/AdminDashboard';
import ProductsManagement from '@/components/admin/ProductsManagement';
import OrdersManagement from '@/components/admin/OrdersManagement';
import CustomersManagement from '@/components/admin/CustomersManagement';
import AdminManagement from '@/components/admin/AdminManagement.jsx';
import CategoriesManagement from '@/components/admin/CategoriesManagement';

const AdminApp = () => {
  const { user, profile, logout } = useAuth();
  const { 
    loading: dataContextLoading, 
    fetchProducts, 
    fetchCategories, 
    fetchOrders, 
    fetchCustomers 
  } = useData();
  const [currentView, setCurrentView] = useState('dashboard');
  const [appContentLoading, setAppContentLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [triggerOpenModal, setTriggerOpenModal] = useState(null);

  const loadInitialAdminData = useCallback(async () => {
    if (profile && profile.role === 'admin' && !initialLoadComplete) {
      setAppContentLoading(true);
      try {
        await Promise.all([
          fetchProducts(),
          fetchCategories(),
          fetchOrders(),
          fetchCustomers()
        ]);
        setInitialLoadComplete(true); 
      } catch (error) {
        console.error("Error loading initial admin data:", error);
      } finally {
        setAppContentLoading(false);
      }
    } else if (profile && profile.role !== 'admin') {
      setAppContentLoading(false);
      setInitialLoadComplete(true);
    } else if (!profile && !user && !dataContextLoading) {
       setAppContentLoading(false);
       setInitialLoadComplete(true);
    }
  }, [profile, user, dataContextLoading, fetchProducts, fetchCategories, fetchOrders, fetchCustomers, initialLoadComplete]);
  
  useEffect(() => {
    if (!dataContextLoading) {
        loadInitialAdminData();
    }
  }, [dataContextLoading, loadInitialAdminData]);

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Package },
    { id: 'products', name: 'Productos', icon: Package },
    { id: 'categories', name: 'Categorías', icon: Tag },
    { id: 'orders', name: 'Pedidos', icon: ShoppingBag },
    { id: 'customers', name: 'Clientes', icon: Users },
    { id: 'admins', name: 'Administradores', icon: UserPlus },
  ];

  const handleSetCurrentView = (viewId, modalToOpen = null) => {
    setCurrentView(viewId);
    setTriggerOpenModal(modalToOpen);
  };

  const resetTriggerModal = () => {
    setTriggerOpenModal(null);
  };


  const renderContent = () => {
    if (appContentLoading || dataContextLoading && !initialLoadComplete) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-10">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-6" />
          <p className="text-xl font-semibold text-gray-700">Cargando datos del panel...</p>
          <p className="text-gray-500">Esto puede tardar unos segundos.</p>
        </div>
      );
    }

    switch (currentView) {
      case 'dashboard':
        return <AdminDashboard setCurrentView={handleSetCurrentView} />;
      case 'products':
        return <ProductsManagement openFormModal={triggerOpenModal === 'addProduct'} onModalOpenHandled={resetTriggerModal} />;
      case 'categories':
        return <CategoriesManagement openFormModal={triggerOpenModal === 'addCategory'} onModalOpenHandled={resetTriggerModal} />;
      case 'orders':
        return <OrdersManagement />;
      case 'customers':
        return <CustomersManagement />;
      case 'admins':
        return <AdminManagement openFormModal={triggerOpenModal === 'addAdmin'} onModalOpenHandled={resetTriggerModal} />;
      default:
        return <AdminDashboard setCurrentView={handleSetCurrentView} />;
    }
  };

  if (!profile && !dataContextLoading && !appContentLoading && initialLoadComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso Interrumpido</h1>
          <p className="text-gray-700">No se pudo cargar tu perfil de administrador. Por favor, intenta recargar la página o vuelve a iniciar sesión.</p>
        </div>
      </div>
    );
  }
  
  if (profile && profile.role !== 'admin' && !appContentLoading && initialLoadComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
         <div className="bg-white p-8 rounded-lg shadow-xl">
           <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
           <p className="text-gray-700">No tienes permisos para acceder a esta sección.</p>
        </div>
      </div>
    );
  }
  
  const sidebarUser = profile || user;

  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminSidebar
        user={sidebarUser} 
        logout={logout}
        menuItems={menuItems}
        currentView={currentView}
        setCurrentView={handleSetCurrentView}
      />

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminApp;