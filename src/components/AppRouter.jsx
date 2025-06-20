import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import PublicApp from '@/components/public/PublicApp.jsx';
import ClientApp from '@/components/client/ClientApp';
import AdminApp from '@/components/admin/AdminApp';
import AboutUsPage from '@/components/public/pages/AboutUsPage';
import ContactPage from '@/components/public/pages/ContactPage';
import ShippingPage from '@/components/public/pages/ShippingPage';
import ReturnsPage from '@/components/public/pages/ReturnsPage';
import FAQPage from '@/components/public/pages/FAQPage';
import WarrantyPage from '@/components/public/pages/WarrantyPage';

export const AppRouter = () => {
  const { user, profile, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-blue-600 mb-6"></div>
        <p className="text-2xl font-semibold text-gray-700 tracking-wide">Cargando aplicación...</p>
        <p className="text-gray-500">Un momento por favor.</p>
      </div>
    );
  }

  if (user && !profile && !loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-gradient-to-br from-red-100 via-red-50 to-orange-100">
        <div className="bg-white p-10 rounded-xl shadow-2xl max-w-lg w-full border-2 border-red-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h1 className="text-3xl font-bold text-red-700 mb-4">Error al Cargar Perfil</h1>
          <p className="text-gray-700 mb-3 text-lg">
            No pudimos cargar la información de tu perfil de usuario.
          </p>
          <p className="text-gray-600 mb-6 text-sm">
            Esto puede ser un problema temporal o un error en la configuración de tu cuenta. 
            Por favor, intenta refrescar la página. Si el problema persiste, puedes cerrar sesión e intentarlo de nuevo o contactar a soporte.
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.reload()} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Refrescar Página
            </button>
            <button 
              onClick={async () => { await logout(); }} 
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/sobre-nosotros" element={<AboutUsPage />} />
      <Route path="/contacto" element={<ContactPage />} />
      <Route path="/envios" element={<ShippingPage />} />
      <Route path="/devoluciones" element={<ReturnsPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/garantia" element={<WarrantyPage />} />

      {!user ? (
        <Route path="/*" element={<PublicApp />} />
      ) : profile?.role === 'admin' ? (
        <>
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="/*" element={<Navigate to="/admin/dashboard" replace />} />
        </>
      ) : profile?.role === 'client' ? (
        <>
          <Route path="/cliente/*" element={<ClientApp />} />
          <Route path="/*" element={<Navigate to="/cliente/productos" replace />} />
        </>
      ) : (
        // Fallback: user exists, but profile or role is indeterminate after loading.
        // This state should ideally not be reached. Redirect to public app.
        // If logout is available and safe, it could be an option.
        <Route path="/*" element={<Navigate to="/" replace />} />
      )}
    </Routes>
  );
};