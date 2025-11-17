import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
  const { user, profile, initializing } = useAuth();

  // ===========================
  // 🔥 PASO CLAVE
  // MOSTRAR LOADER SOLO EN LA PRIMERA CARGA REAL
  // ===========================
  if (initializing || (user && profile === null)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600 mb-6"></div>
        <p className="text-lg text-gray-700">Cargando aplicación...</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/sobre-nosotros" element={<AboutUsPage />} />
      <Route path="/contacto" element={<ContactPage />} />
      <Route path="/envios" element={<ShippingPage />} />
      <Route path="/devoluciones" element={<ReturnsPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/garantia" element={<WarrantyPage />} />

      {/* No está autenticado → PublicApp */}
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
        // Si por algún motivo el perfil existe pero está corrupto o vacío
        <Route path="/*" element={<Navigate to="/" replace />} />
      )}
    </Routes>
  );
};