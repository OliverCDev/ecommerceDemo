import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, ChevronUp, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      className="border-b border-gray-200 py-6"
      layout
    >
      <motion.button
        className="flex justify-between items-center w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
        layout
      >
        <span className="text-lg font-medium text-gray-800">{question}</span>
        {isOpen ? <ChevronUp className="w-5 h-5 text-blue-600" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 text-gray-600"
          >
            {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FAQPage = () => {
  const faqs = [
    {
      question: "¿Cuáles son los métodos de pago aceptados?",
      answer: "Aceptamos las principales tarjetas de crédito (Visa, MasterCard, American Express), PayPal y transferencias bancarias. Todos los pagos son procesados de forma segura."
    },
    {
      question: "¿Cuánto tiempo tarda en llegar mi pedido?",
      answer: "El tiempo de entrega varía según la opción de envío seleccionada y tu ubicación. El envío estándar suele tardar entre 5-7 días hábiles, mientras que el envío express tarda 2-3 días hábiles. Puedes encontrar más detalles en nuestra página de Envíos."
    },
    {
      question: "¿Puedo modificar o cancelar mi pedido después de realizarlo?",
      answer: "Si necesitas modificar o cancelar tu pedido, por favor contáctanos lo antes posible. Haremos todo lo posible para ayudarte, pero si el pedido ya ha sido procesado o enviado, es posible que no podamos realizar cambios."
    },
    {
      question: "¿Cómo puedo rastrear mi pedido?",
      answer: "Una vez que tu pedido haya sido enviado, recibirás un correo electrónico de confirmación con un número de seguimiento. Podrás usar este número en el sitio web del transportista para ver el estado de tu entrega."
    },
    {
      question: "¿Qué hago si recibo un producto dañado o incorrecto?",
      answer: "Lamentamos mucho si esto sucede. Por favor, contacta a nuestro equipo de atención al cliente dentro de las 48 horas posteriores a la recepción del pedido, adjuntando fotos del producto dañado o incorrecto. Nos encargaremos de solucionarlo lo antes posible."
    },
  ];

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
      <section className="py-16 md:py-24 bg-gradient-to-r from-indigo-500 to-sky-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Preguntas Frecuentes (FAQ)
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl opacity-90"
          >
            Encuentra respuestas rápidas a tus dudas más comunes.
          </motion.p>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-xl shadow-lg"
          >
            <div className="flex items-center mb-8">
              <HelpCircle className="w-10 h-10 text-indigo-600 mr-4" />
              <h2 className="text-3xl font-semibold text-gray-800">Preguntas Comunes</h2>
            </div>
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 text-center"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">¿No encontraste tu respuesta?</h3>
            <p className="text-gray-600 mb-6">
              Nuestro equipo de soporte está listo para ayudarte.
            </p>
            <Link to="/contacto">
              <Button size="lg" className="bg-gradient-to-r from-indigo-500 to-sky-600 hover:from-indigo-600 hover:to-sky-700">
                Contactar Soporte
              </Button>
            </Link>
          </motion.div>
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

export default FAQPage;