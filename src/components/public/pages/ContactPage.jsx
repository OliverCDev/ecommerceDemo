import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, MessageSquare, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; 
import { toast } from '@/components/ui/use-toast';

const ContactPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "🚧 Formulario en desarrollo",
      description: "Esta función aún no está implementada. Por favor, usa los otros métodos de contacto.",
    });
  };

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
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Contáctanos
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl opacity-90"
          >
            Estamos aquí para ayudarte. No dudes en ponerte en contacto con nosotros.
          </motion.p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Información de Contacto</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-700">Teléfono</h3>
                    <a href="tel:+1234567890" className="text-lg text-blue-600 hover:underline">+1 (234) 567-890</a>
                    <p className="text-gray-500">Lunes a Viernes, 9am - 6pm</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-700">Email</h3>
                    <a href="mailto:contacto@mitiendapro.com" className="text-lg text-purple-600 hover:underline">contacto@mitiendapro.com</a>
                    <p className="text-gray-500">Respondemos en 24 horas</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-700">WhatsApp</h3>
                    <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="text-lg text-green-600 hover:underline">Chatea con nosotros</a>
                    <p className="text-gray-500">Soporte rápido y directo</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-700">Dirección</h3>
                    <p className="text-lg text-gray-600">Calle Falsa 123, Ciudad Ejemplo, País</p>
                    <p className="text-gray-500">Visítanos (con cita previa)</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Envíanos un Mensaje</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-gray-700">Nombre Completo</Label>
                  <Input id="name" type="text" placeholder="Tu nombre" className="mt-1" required />
                </div>
                <div>
                  <Label htmlFor="email" className="text-gray-700">Email</Label>
                  <Input id="email" type="email" placeholder="tu@email.com" className="mt-1" required />
                </div>
                <div>
                  <Label htmlFor="subject" className="text-gray-700">Asunto</Label>
                  <Input id="subject" type="text" placeholder="Asunto de tu mensaje" className="mt-1" required />
                </div>
                <div>
                  <Label htmlFor="message" className="text-gray-700">Mensaje</Label>
                  <Textarea id="message" placeholder="Escribe tu mensaje aquí..." rows={5} className="mt-1" required />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  Enviar Mensaje
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Map Section (Placeholder) */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Nuestra Ubicación</h2>
          <div className="aspect-w-16 aspect-h-9 bg-gray-300 rounded-lg shadow-lg overflow-hidden">
            {/* Placeholder for OpenStreetMap or other map provider */}
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-lg">Mapa interactivo próximamente</p>
            </div>
             {/* Example: <iframe src="https://www.openstreetmap.org/export/embed.html?bbox=-0.004017949104309083%2C51.47612752641776%2C0.004017949104309083%2C51.47612752641776&layer=mapnik" style={{border:0}} width="100%" height="100%"></iframe> */}
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

export default ContactPage;