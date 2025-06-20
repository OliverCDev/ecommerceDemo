import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, CheckCircle, Settings, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const WarrantyPage = () => {
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
      <section className="py-16 md:py-24 bg-gradient-to-r from-gray-700 to-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Información de Garantía
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl opacity-90"
          >
            Compra con confianza. Conoce nuestra cobertura de garantía.
          </motion.p>
        </div>
      </section>

      {/* Warranty Details */}
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
                <ShieldAlert className="w-10 h-10 text-gray-700 mr-4" />
                <h2 className="text-2xl font-semibold text-gray-800">Cobertura General</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Todos nuestros productos nuevos cuentan con una garantía estándar de <strong>1 año</strong> contra defectos de fabricación a partir de la fecha de compra. 
                Esta garantía cubre la reparación o reemplazo del producto defectuoso, a nuestra discreción.
              </p>
              <p className="text-gray-600">
                Algunos productos específicos pueden tener períodos de garantía extendidos, lo cual se indicará en la página del producto.
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
                <CheckCircle className="w-10 h-10 text-green-600 mr-4" />
                <h2 className="text-2xl font-semibold text-gray-800">¿Qué Cubre la Garantía?</h2>
              </div>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Defectos en materiales y mano de obra bajo uso normal.</li>
                <li>Fallos de componentes que no sean resultado de mal uso o desgaste normal.</li>
                <li>Problemas estructurales que afecten la funcionalidad del producto.</li>
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
                <Settings className="w-10 h-10 text-blue-600 mr-4" />
                <h2 className="text-2xl font-semibold text-gray-800">Exclusiones de la Garantía</h2>
              </div>
              <p className="text-gray-600 mb-4">
                La garantía no cubre:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Daños causados por mal uso, abuso, negligencia o accidentes.</li>
                <li>Desgaste normal, incluyendo rayones, abolladuras o decoloración por exposición al sol.</li>
                <li>Modificaciones o reparaciones no autorizadas.</li>
                <li>Daños causados por limpieza inadecuada o uso de productos químicos no recomendados.</li>
                <li>Daños consecuenciales o incidentales.</li>
              </ul>
            </motion.div>

             <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Cómo Reclamar la Garantía</h2>
              <p className="text-gray-600 mb-4">
                Si crees que tu producto tiene un defecto cubierto por la garantía, por favor:
              </p>
              <ol className="list-decimal list-inside text-gray-600 space-y-2">
                <li>Contacta a nuestro equipo de <Link to="/contacto" className="text-blue-600 hover:underline">atención al cliente</Link> con tu número de pedido, una descripción del problema y, si es posible, fotos o videos del defecto.</li>
                <li>Nuestro equipo evaluará tu reclamación y te guiará sobre los siguientes pasos.</li>
                <li>Es posible que se te solicite enviar el producto para inspección. Los costos de envío para reclamaciones de garantía pueden variar.</li>
              </ol>
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

export default WarrantyPage;