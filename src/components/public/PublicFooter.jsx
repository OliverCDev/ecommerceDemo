import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail as MailIcon, MessageSquare } from 'lucide-react';

const PublicFooter = ({ onScrollToSection }) => {
  return (
    <footer id="contacto-footer" className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4 inline-block">
              MiTienda Pro
            </Link>
            <p className="text-gray-400 text-sm">
              Tu destino #1 para muebles y decoración de interiores con calidad premium y diseños exclusivos.
            </p>
            <div className="mt-6 space-y-3">
              <a href="tel:+1234567890" className="flex items-center text-gray-300 hover:text-white transition-colors text-sm">
                <Phone className="w-4 h-4 mr-3 text-blue-400" /> +1 (234) 567-890
              </a>
              <a href="mailto:contacto@mitiendapro.com" className="flex items-center text-gray-300 hover:text-white transition-colors text-sm">
                <MailIcon className="w-4 h-4 mr-3 text-blue-400" /> contacto@mitiendapro.com
              </a>
              <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-300 hover:text-white transition-colors text-sm">
                <MessageSquare className="w-4 h-4 mr-3 text-blue-400" /> WhatsApp Directo
              </a>
            </div>
          </div>
          <div>
            <span className="font-semibold text-lg text-gray-200">Productos</span>
            <ul className="mt-4 space-y-2">
              <li><button onClick={() => onScrollToSection('productos')} className="text-gray-400 hover:text-white transition-colors text-sm">Muebles de Sala</button></li>
              <li><button onClick={() => onScrollToSection('productos')} className="text-gray-400 hover:text-white transition-colors text-sm">Comedores</button></li>
              <li><button onClick={() => onScrollToSection('productos')} className="text-gray-400 hover:text-white transition-colors text-sm">Decoración</button></li>
              <li><button onClick={() => onScrollToSection('ofertas')} className="text-gray-400 hover:text-white transition-colors text-sm">Ofertas Especiales</button></li>
            </ul>
          </div>
          <div>
            <span className="font-semibold text-lg text-gray-200">Información</span>
            <ul className="mt-4 space-y-2">
              <li><Link to="/sobre-nosotros" className="text-gray-400 hover:text-white transition-colors text-sm">Sobre Nosotros</Link></li>
              <li><Link to="/contacto" className="text-gray-400 hover:text-white transition-colors text-sm">Formulario de Contacto</Link></li>
              <li><Link to="/envios" className="text-gray-400 hover:text-white transition-colors text-sm">Políticas de Envío</Link></li>
              <li><Link to="/devoluciones" className="text-gray-400 hover:text-white transition-colors text-sm">Política de Devoluciones</Link></li>
            </ul>
          </div>
          <div>
            <span className="font-semibold text-lg text-gray-200">Soporte y Ayuda</span>
            <ul className="mt-4 space-y-2">
              <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors text-sm">Preguntas Frecuentes (FAQ)</Link></li>
              <li><Link to="/garantia" className="text-gray-400 hover:text-white transition-colors text-sm">Información de Garantía</Link></li>
              <li><button onClick={() => onScrollToSection('contacto-footer')} className="text-gray-400 hover:text-white transition-colors text-sm">Atención al Cliente</button></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-10 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} MiTienda Pro. Todos los derechos reservados.</p>
          <p className="mt-1">Diseñado y Desarrollado con ❤️ por Horizons AI para Insoft Software Solutions S.A.</p>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;