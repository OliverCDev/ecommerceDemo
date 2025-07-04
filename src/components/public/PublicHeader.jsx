import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const PublicHeader = ({ onAuthModalOpen, onGoogleLogin, onScrollToSection }) => {
  const { isAuthenticated, user, profile, loading: authLoading } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleMobileMenuLinkClick = (sectionId) => {
    if (sectionId) {
      onScrollToSection(sectionId);
    }
    setShowMobileMenu(false);
  };
  
  const handleGoogleLoginClick = () => {
    onGoogleLogin();
    setShowMobileMenu(false);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MiTienda Pro
            </h1>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-6">
              <button onClick={() => onScrollToSection('inicio')} className="text-gray-700 hover:text-blue-600 transition-colors">Inicio</button>
              <button onClick={() => onScrollToSection('productos')} className="text-gray-700 hover:text-blue-600 transition-colors">Productos</button>
              <button onClick={() => onScrollToSection('ofertas')} className="text-gray-700 hover:text-blue-600 transition-colors">Ofertas</button>
              <Link to="/contacto" className="text-gray-700 hover:text-blue-600 transition-colors">Contacto</Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
           {!isAuthenticated && !authLoading && (
              <>
                <Button
                  variant="outline"
                  onClick={onAuthModalOpen}
                  className="hidden md:flex"
                >
                  <User className="w-4 h-4 mr-2" />
                  Iniciar Sesión
                </Button>

                <Button
                  onClick={onGoogleLogin}
                  className="hidden md:flex bg-red-500 hover:bg-red-600 text-white"
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </Button>
              </>
            )}
            {isAuthenticated && user && profile && (
               <Link to={profile.role === 'admin' ? '/admin/dashboard' : '/cliente/productos'}
                className="hidden md:flex items-center text-gray-700 hover:text-blue-600 transition-colors"
               >
                  <User className="w-5 h-5 mr-2" /> Mi Cuenta
               </Link>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {showMobileMenu && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-t"
        >
          <div className="px-4 py-4 space-y-4">
            <nav className="space-y-2">
              <button onClick={() => handleMobileMenuLinkClick('inicio')} className="block text-gray-700 hover:text-blue-600 transition-colors">Inicio</button>
              <button onClick={() => handleMobileMenuLinkClick('productos')} className="block text-gray-700 hover:text-blue-600 transition-colors">Productos</button>
              <button onClick={() => handleMobileMenuLinkClick('ofertas')} className="block text-gray-700 hover:text-blue-600 transition-colors">Ofertas</button>
              <Link to="/contacto" onClick={() => handleMobileMenuLinkClick()} className="block text-gray-700 hover:text-blue-600 transition-colors">Contacto</Link>
               {isAuthenticated && user && profile && (
                   <Link 
                      to={profile.role === 'admin' ? '/admin/dashboard' : '/cliente/productos'} 
                      onClick={() => handleMobileMenuLinkClick()}
                      className="block text-gray-700 hover:text-blue-600 transition-colors"
                   >
                      Mi Cuenta
                   </Link>
                )}
            </nav>
            {!isAuthenticated && !authLoading && (
              <div className="space-y-2">
                <Button
                  variant="outline"
                  onClick={() => { onAuthModalOpen(); setShowMobileMenu(false); }}
                  className="w-full"
                >
                  <User className="w-4 h-4 mr-2" />
                  Iniciar Sesión
                </Button>
                <Button
                  onClick={handleGoogleLoginClick}
                  className="w-full bg-red-500 hover:bg-red-600 text-white"
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continuar con Google
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default PublicHeader;