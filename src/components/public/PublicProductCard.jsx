import React from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PublicProductCard = ({ product, onAddToCart, onToggleFavorite, isFavorite }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="relative">
        <img  
          className="w-full h-48 object-cover" 
          alt={`${product.name} - Producto de ${product.category}`}
         src={`${product.imageUrl}`} />
        
        <div className="absolute top-3 left-3 flex space-x-2">
          {product.featured && (
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Destacado
            </span>
          )}
          {product.stock < 5 && product.stock > 0 && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              ¡Últimas unidades!
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Agotado
            </span>
          )}
        </div>

        <button
          onClick={() => onToggleFavorite(product.id)}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-colors ${
            isFavorite 
              ? 'bg-red-500/80 text-white' 
              : 'bg-white/80 text-gray-600 hover:bg-red-500/80 hover:text-white'
          }`}
        >
          <Heart className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">
            {product.name}
          </h3>
          <span className="text-sm text-gray-500 capitalize">
            {product.category}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">
            ({product.rating})
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-blue-600">
            ${product.price}
          </span>
          <div className="text-right">
            <p className="text-sm text-gray-500">Stock</p>
            <p className={`font-semibold ${
              product.stock === 0 ? 'text-red-600' :
              product.stock < 5 ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {product.stock === 0 ? 'Agotado' : product.stock}
            </p>
          </div>
        </div>

        <Button
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
        </Button>
      </div>
    </motion.div>
  );
};

export default PublicProductCard;