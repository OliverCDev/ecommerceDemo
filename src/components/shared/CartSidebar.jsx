import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CartSidebar = ({ 
  isOpen, 
  onClose, 
  cart, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout, 
  totalPrice, 
  totalItems 
}) => {
  const CartItem = ({ item }) => (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg"
    >
      <img  
        className="w-16 h-16 object-cover rounded-lg" 
        alt={`${item.name} en carrito`}
       src="https://images.unsplash.com/photo-1614701535063-a993d682ff63" />
      
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800">{item.name}</h4>
        <p className="text-blue-600 font-bold">${item.price}</p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
        >
          <Minus className="w-4 h-4" />
        </Button>
        <span className="w-8 text-center font-semibold">{item.quantity}</span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      
      <Button
        size="sm"
        variant="destructive"
        onClick={() => onRemoveItem(item.id)}
      >
        <X className="w-4 h-4" />
      </Button>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col"
          >
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Carrito de Compras</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Tu carrito está vacío</h3>
                  <p className="text-gray-500">Agrega algunos productos para comenzar</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {cart.map((item) => (
                      <CartItem key={item.id} item={item} />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-800">Total:</span>
                  <span className="text-2xl font-bold text-blue-600">${totalPrice.toFixed(2)}</span>
                </div>
                <Button
                  onClick={onCheckout}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
                >
                  Proceder al Pago
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;