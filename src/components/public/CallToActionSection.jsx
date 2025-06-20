import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const CallToActionSection = ({ onAuthModalOpen }) => {
  return (
    <section id="ofertas" className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y:20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-extrabold mb-6">
            ¿Listo para <span className="text-yellow-300">Transformar</span> tu Hogar?
          </h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed">
            Únete a miles de clientes satisfechos y descubre ofertas exclusivas. 
            Calidad, estilo y los mejores precios te esperan.
          </p>
          <Button
            size="xl"
            onClick={onAuthModalOpen}
            className="bg-yellow-400 text-blue-700 hover:bg-yellow-300 font-semibold shadow-xl transform hover:scale-105 transition-all duration-300 px-10 py-4 text-lg"
          >
            Crear Cuenta Gratis Ahora
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToActionSection;