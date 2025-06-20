
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProductCard = ({ product, addToCart, toggleFavorite, isFavorite }) => {
  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent card click if button is part of it
    addToCart(product);
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    toggleFavorite(product.id);
  };
  
  const stockStatus = product.stock === 0 
    ? { text: 'Sin Stock', color: 'bg-red-100 text-red-700 border-red-200' }
    : product.stock < 5 
    ? { text: 'Stock Bajo', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' }
    : null;


  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col product-card-hover"
    >
      <div className="relative">
        <img   
          className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105" 
          alt={`${product.name} - ${product.description}`}
         src="https://images.unsplash.com/photo-1671376354106-d8d21e55dddd" />
        
        <button
          onClick={handleToggleFavorite}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-red-100 transition-colors duration-200 shadow-md"
          aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
        >
          <Heart 
            className={`w-5 h-5 transition-all duration-200 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500 hover:text-red-500'}`} 
          />
        </button>

        {product.featured && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
            Destacado
          </div>
        )}
        {stockStatus && (
           <div className={`absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold border ${stockStatus.color} shadow-sm`}>
            {stockStatus.text}
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-semibold text-lg mb-2 text-gray-800 line-clamp-2 leading-tight">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-3 flex-grow">{product.description}</p>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-500">({(product.rating || 0).toFixed(1)})</span>
        </div>
        
        <div className="flex items-center justify-between mb-4 mt-auto">
          <span className="text-2xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
          <span className="text-sm text-gray-500">Stock: {product.stock}</span>
        </div>
        
        <Button
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-base flex items-center justify-center"
          disabled={product.stock === 0}
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          {product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
