import React from 'react';
import { motion } from 'framer-motion';
import { Star, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProductCard = ({ product, onAddToCart, onToggleFavorite, isFavorite }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden product-card-hover"
    >
      <div className="relative">
        <img  
          className="w-full h-48 object-cover" 
          alt={`${product.name} - ${product.description}`}
         src="https://images.unsplash.com/photo-1615946093435-eaafc8241554" />
        <button
          onClick={() => onToggleFavorite(product.id)}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
        >
          <Heart 
            className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
          />
        </button>
        {product.featured && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Destacado
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 text-gray-800">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3">{product.description}</p>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">({product.rating})</span>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-blue-600">${product.price}</span>
          <span className="text-sm text-gray-500">Stock: {product.stock}</span>
        </div>
        
        <Button
          onClick={() => onAddToCart(product)}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductCard;