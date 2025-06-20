import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const HeroSection = ({ onScrollToSection, onAuthModalOpen }) => {
  const { isAuthenticated } = useAuth();

  return (
    <section id="inicio" className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-10"></div>
      <div className="absolute inset-0 pattern-dots pattern-blue-200 pattern-bg-white pattern-opacity-20 pattern-size-4"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight"
          >
            Descubre Muebles
            <span className="block md:inline bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}Únicos y Con Estilo
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto"
          >
            Transforma tu hogar con nuestra colección exclusiva de muebles y decoración. 
            Calidad premium, diseños únicos y precios increíbles.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4 md:space-y-0 md:space-x-4"
          >
            <Button
              size="lg"
              onClick={() => onScrollToSection('productos')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg transform hover:scale-105 transition-transform duration-300"
            >
              Explorar Catálogo
            </Button>
           {!isAuthenticated && (
              <Button
                size="lg"
                variant="outline"
                onClick={onAuthModalOpen}
                className="border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 shadow-sm transform hover:scale-105 transition-transform duration-300"
              >
                Únete Ahora
              </Button>
           )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;