import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Filter, Star, Eye, Package as PackageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import ProductForm from '@/components/admin/ProductForm';

const ProductsManagement = ({ openFormModal, onModalOpenHandled }) => {
  const { products, categories, updateProduct, deleteProduct, loading: dataLoading } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('todos');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    if (openFormModal) {
      setEditingProduct(null);
      setShowForm(true);
      onModalOpenHandled();
    }
  }, [openFormModal, onModalOpenHandled]);

  const categoryOptions = [
    { id: 'todos', name: 'Todas las Categorías' },
    ...categories.map(cat => ({ id: cat.name, name: cat.name }))
  ];
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategoryFilter === 'todos' || product.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.')) {
      await deleteProduct(productId);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const toggleFeatured = async (product) => {
    await updateProduct(product.id, { ...product, featured: !product.featured });
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { color: 'text-red-700 bg-red-100 border-red-200', text: 'Sin Stock' };
    if (stock < 5) return { color: 'text-yellow-700 bg-yellow-100 border-yellow-200', text: 'Stock Bajo' };
    return { color: 'text-green-700 bg-green-100 border-green-200', text: 'En Stock' };
  };

  if (dataLoading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-lg text-gray-700">Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Productos</h1>
          <p className="text-gray-600">Administra tu catálogo de productos de forma eficiente.</p>
        </div>
        <Button
          onClick={() => { setEditingProduct(null); setShowForm(true); }}
          className="bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white shadow-md hover:shadow-lg transition-all px-6 py-3"
        >
          <Plus className="w-5 h-5 mr-2" />
          Agregar Producto
        </Button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar productos por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow hover:shadow-sm"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow hover:shadow-sm bg-white"
            >
              {categoryOptions.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredProducts.map((product) => {
            const stockStatus = getStockStatus(product.stock);
            return (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col"
              >
                <div className="relative">
                  <img 
                    className="w-full h-56 object-cover" 
                    src={product.image_url || "https://images.unsplash.com/photo-1671376354106-d8d21e55dddd"} 
                    alt={product.name}
                  />
                  
                  <div className="absolute top-3 left-3 flex flex-col space-y-2">
                    {product.featured && (
                      <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                        Destacado
                      </span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${stockStatus.color} shadow-sm`}>
                      {stockStatus.text}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleFeatured(product)}
                    className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-sm transition-all duration-200 shadow-md ${
                      product.featured 
                        ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                        : 'bg-white/70 text-gray-600 hover:bg-yellow-400 hover:text-white'
                    }`}
                    title={product.featured ? "Quitar de Destacados" : "Marcar como Destacado"}
                  >
                    <Star className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg text-gray-800 line-clamp-2 leading-tight flex-grow">
                      {product.name}
                    </h3>
                    <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded-md ml-2 whitespace-nowrap">
                      {product.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3 flex-grow">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-4 mt-auto">
                    <span className="text-2xl font-bold text-blue-600">
                      ${product.price.toFixed(2)}
                    </span>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Stock:</p>
                      <p className="font-semibold text-gray-800 text-lg">{product.stock}</p>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      onClick={() => handleEdit(product)}
                      variant="outline"
                      size="sm"
                      className="flex-1 border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      onClick={() => handleDelete(product.id)}
                      variant="destructive"
                      size="sm"
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredProducts.length === 0 && !dataLoading && (
        <div className="text-center py-16 col-span-full">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <PackageIcon className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-3">No se encontraron productos</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Intenta con otros términos de búsqueda, ajusta los filtros o agrega nuevos productos al catálogo.
          </p>
        </div>
      )}

      <ProductForm
        isOpen={showForm}
        onClose={handleFormClose}
        product={editingProduct}
      />
    </div>
  );
};

export default ProductsManagement;