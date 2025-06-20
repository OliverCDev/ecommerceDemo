import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, ShieldCheck, MessageCircle, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ReturnsPage = () => {
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
      <section className="py-16 md:py-24 bg-gradient-to-r from-red-500 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Política de Devoluciones
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl opacity-90"
          >
            Tu satisfacción es nuestra prioridad. Conoce cómo gestionamos las devoluciones.
          </motion.p>
        </div>
      </section>

      {/* Returns Policy Details */}
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
                <RotateCcw className="w-10 h-10 text-red-600 mr-4" />
                <h2 className="text-2xl font-semibold text-gray-800">Plazo de Devolución</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Aceptamos devoluciones dentro de los <strong>30 días</strong> posteriores a la recepción de tu pedido. 
                El producto debe estar en su estado original, sin usar y con el embalaje intacto.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <div className="flex items-center mb-4">
                <ShieldCheck className="w-10 h-10 text-green-600 mr-4" />
                <h2 className="text-2xl font-semibold text-gray-800">Productos No Retornables</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Algunos artículos no son elegibles para devolución, incluyendo:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Artículos en oferta o liquidación final.</li>
                <li>Productos personalizados o hechos a medida.</li>
                <li>Tarjetas de regalo.</li>
                <li>Artículos de higiene personal (si aplica).</li>
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <div className="flex items-center mb-4">
                <MessageCircle className="w-10 h-10 text-blue-600 mr-4" />
                <h2 className="text-2xl font-semibold text-gray-800">Proceso de Devolución</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Para iniciar una devolución, por favor sigue estos pasos:
              </p>
              <ol className="list-decimal list-inside text-gray-600 space-y-2">
                <li>Contacta a nuestro equipo de <Link to="/contacto" className="text-blue-600 hover:underline">atención al cliente</Link> con tu número de pedido y el motivo de la devolución.</li>
                <li>Una vez aprobada tu solicitud, te proporcionaremos instrucciones para el envío del producto.</li>
                <li>Empaqueta el artículo de forma segura. El costo de envío de la devolución corre por cuenta del cliente, a menos que el motivo sea un error nuestro o un producto defectuoso.</li>
                <li>Una vez recibido e inspeccionado el producto, procesaremos tu reembolso o cambio.</li>
              </ol>
            </motion.div>

             <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Reembolsos</h2>
              <p className="text-gray-600">
                Los reembolsos se procesarán al método de pago original dentro de 5-7 días hábiles después de que hayamos recibido e inspeccionado el artículo devuelto. 
                Te notificaremos por correo electrónico una vez que se haya procesado el reembolso.
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

export default ReturnsPage;