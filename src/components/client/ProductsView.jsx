
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Package, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/client/ProductCard';

const ProductsView = ({ 
  user, 
  products,
  categories, 
  searchTerm, 
  selectedCategory, 
  setSelectedCategory, 
  addToCart, 
  toggleFavorite, 
  favorites,
  isLoading
}) => {
  
  const categoryOptions = [
    { id: 'todos', name: 'Todos los Productos' },
    ...categories.map(cat => ({ id: cat.name, name: cat.name }))
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'todos' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-lg text-gray-700">Cargando productos...</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 md:p-12 mb-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">¡Hola {user?.full_name || user?.email || 'Cliente'}!</h2>
          <p className="text-lg md:text-xl opacity-90 mb-6">Descubre productos increíbles para tu hogar y oficina.</p>
          <Button 
            onClick={() => document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3 text-lg rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            Explorar Productos
          </Button>
        </div>
        <div className="absolute -top-10 -right-10 w-48 h-48 md:w-64 md:h-64 bg-white/10 rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute -bottom-16 left-1/4 w-32 h-32 md:w-40 md:h-40 bg-white/5 rounded-full opacity-30 animate-pulse" style={{animationDelay: '1.5s'}}></div>
      </div>

      <div className="mb-8 p-4 bg-white rounded-xl shadow-md">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center space-x-2 text-gray-700">
            <Filter className="w-6 h-6" />
            <span className="font-semibold text-lg">Categorías:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`transition-all duration-300 rounded-full px-4 py-2 text-sm md:text-base ${
                  selectedCategory === category.id ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400'
                }`}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div id="product-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        <AnimatePresence>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
              toggleFavorite={toggleFavorite}
              isFavorite={favorites.includes(product.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {filteredProducts.length === 0 && !isLoading && (
        <div className="text-center py-16 col-span-full">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Package className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-3">No se encontraron productos</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Intenta con otros términos de búsqueda o selecciona una categoría diferente.
          </p>
        </div>
      )}
    </>
  );
};

export default ProductsView;
