import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Package, Clock, Globe, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ShippingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Simple */}
      <header className="bg-white shadow-md py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            MiTienda Pro
          </Link>
          <Link to="/">
            <Button variant="outline">
              <Home className="w-4 h-4 mr-2" />
              Volver a la Tienda
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-green-500 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Información de Envíos
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl opacity-90"
          >
            Recibe tus productos de forma rápida y segura.
          </motion.p>
        </div>
      </section>

      {/* Shipping Details */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <div className="flex items-center mb-4">
                <Truck className="w-10 h-10 text-green-600 mr-4" />
                <h2 className="text-2xl font-semibold text-gray-800">Opciones de Envío</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Ofrecemos varias opciones de envío para adaptarnos a tus necesidades:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li><strong>Envío Estándar:</strong> Entrega en 5-7 días hábiles. Costo calculado al finalizar la compra.</li>
                <li><strong>Envío Express:</strong> Entrega en 2-3 días hábiles. Costo adicional.</li>
                <li><strong>Recogida en Tienda:</strong> Gratis. Disponible en ubicaciones seleccionadas (consultar disponibilidad).</li>
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <div className="flex items-center mb-4">
                <Package className="w-10 h-10 text-blue-600 mr-4" />
                <h2 className="text-2xl font-semibold text-gray-800">Empaquetado y Manejo</h2>
              </div>
              <p className="text-gray-600">
                Todos nuestros productos son cuidadosamente empaquetados para garantizar que lleguen en perfectas condiciones. 
                Los artículos frágiles reciben protección adicional. Recibirás un correo electrónico de confirmación una vez que tu pedido haya sido enviado, 
                junto con un número de seguimiento.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <div className="flex items-center mb-4">
                <Clock className="w-10 h-10 text-purple-600 mr-4" />
                <h2 className="text-2xl font-semibold text-gray-800">Tiempos de Procesamiento</h2>
              </div>
              <p className="text-gray-600">
                Los pedidos se procesan generalmente dentro de 1-2 días hábiles. Durante períodos de alta demanda o promociones especiales, 
                el tiempo de procesamiento puede extenderse ligeramente. Te mantendremos informado sobre el estado de tu pedido.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <div className="flex items-center mb-4">
                <Globe className="w-10 h-10 text-yellow-500 mr-4" />
                <h2 className="text-2xl font-semibold text-gray-800">Envíos Internacionales</h2>
              </div>
              <p className="text-gray-600">
                Actualmente, realizamos envíos dentro del territorio nacional. Estamos trabajando para expandir nuestras opciones de envío internacional en el futuro. 
                Suscríbete a nuestro boletín para recibir actualizaciones.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer Simple */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; {new Date().getFullYear()} MiTienda Pro. Todos los derechos reservados.</p>
          <p className="text-sm mt-1">Creado por Insoft Software Solutions S.A.</p>
        </div>
      </footer>
    </div>
  );
};

export default ShippingPage;