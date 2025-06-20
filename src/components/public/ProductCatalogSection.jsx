import React from 'react';
import { Search, Filter } from 'lucide-react';
import PublicProductCard from '@/components/public/PublicProductCard';

const ProductCatalogSection = ({
  products,
  categories,
  searchTerm,
  onSearchTermChange,
  selectedCategory,
  onSelectedCategoryChange,
  onAddToCart,
  onToggleFavorite,
  favorites,
  loading
}) => {
  return (
    <section id="productos" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestro Catálogo Completo</h2>
          <p className="text-gray-600">Explora toda nuestra colección y encuentra lo que buscas.</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={onSearchTermChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={selectedCategory}
                onChange={onSelectedCategoryChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
           <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
           </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <PublicProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onToggleFavorite={onToggleFavorite}
                isFavorite={favorites.includes(product.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">No se encontraron productos</h3>
            <p className="text-gray-500">Intenta ajustar tu búsqueda o revisa las categorías.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductCatalogSection;