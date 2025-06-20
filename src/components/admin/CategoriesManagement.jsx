import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Tag, AlertCircle, Folder, Loader2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useData } from '@/contexts/DataContext';
import { toast } from '@/components/ui/use-toast';

const CategoriesManagement = ({ openFormModal, onModalOpenHandled }) => {
  const { categories, products, addCategory, updateCategory, deleteCategory, loading: dataLoading } = useData();
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (openFormModal) {
      setEditingCategory(null);
      setFormData({ name: '', description: '' });
      setErrors({});
      setShowCategoryDialog(true);
      onModalOpenHandled();
    }
  }, [openFormModal, onModalOpenHandled]);

  useEffect(() => {
    if (editingCategory) {
      setFormData({ name: editingCategory.name, description: editingCategory.description });
    } else if (!showCategoryDialog) { // Reset form only if not editing and dialog is closed
      setFormData({ name: '', description: '' });
    }
    if (!showCategoryDialog) setErrors({}); // Clear errors when dialog closes
  }, [editingCategory, showCategoryDialog]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre de la categoría es obligatorio';
    else if (categories.some(cat => 
      cat.name.toLowerCase() === formData.name.trim().toLowerCase() && 
      (!editingCategory || cat.id !== editingCategory.id)
    )) newErrors.name = 'Ya existe una categoría con este nombre';
    if (!formData.description.trim()) newErrors.description = 'La descripción es obligatoria';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const categoryData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
    };

    if (editingCategory) {
      await updateCategory(editingCategory.id, categoryData);
    } else {
      await addCategory(categoryData);
    }
    handleClose();
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowCategoryDialog(true);
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría? Esta acción no se puede deshacer.')) {
      await deleteCategory(categoryId);
    }
  };

  const handleClose = () => {
    setShowCategoryDialog(false);
    setEditingCategory(null);
    // FormData and Errors are reset by the useEffect hook based on showCategoryDialog
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const getCategoryProductCount = (categoryName) => {
    // Assuming product.category refers to category.name. If it's category.id, adjust this.
    return products.filter(product => product.category === categoryName).length;
  };

  if (dataLoading && categories.length === 0) {
     return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-lg text-gray-700">Cargando categorías...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Categorías</h1>
          <p className="text-gray-600">Organiza tu catálogo con categorías personalizadas.</p>
        </div>
        <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setEditingCategory(null); 
                setFormData({ name: '', description: '' }); // Ensure form is reset for new category
                setErrors({});
                // setShowCategoryDialog(true); // DialogTrigger handles this
              }}
              className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all px-6 py-3"
            >
              <Plus className="w-5 h-5 mr-2" />
              Agregar Categoría
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg bg-white rounded-xl shadow-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center text-2xl font-semibold text-gray-800">
                <Tag className="w-7 h-7 mr-3 text-green-600" />
                {editingCategory ? 'Editar Categoría' : 'Agregar Nueva Categoría'}
              </DialogTitle>
              <DialogDescription>
                {editingCategory ? 'Modifica los detalles de la categoría.' : 'Crea una nueva categoría para tus productos.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 pt-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">Nombre de la categoría</Label>
                <div className="relative mt-1">
                  <Tag className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`pl-11 py-3 text-base ${errors.name ? 'border-red-500 focus:border-red-500 ring-red-500' : 'focus:border-green-500 ring-green-500'}`}
                    placeholder="Ej: Muebles de Jardín"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-600 text-xs mt-1.5 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">Descripción</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full mt-1 px-4 py-3 border rounded-lg focus:ring-2 resize-none text-base ${
                    errors.description ? 'border-red-500 focus:border-red-500 ring-red-500' : 'border-gray-300 focus:border-green-500 ring-green-500'
                  }`}
                  placeholder="Describe qué tipo de productos incluye esta categoría..."
                />
                {errors.description && (
                  <p className="text-red-600 text-xs mt-1.5 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.description}
                  </p>
                )}
              </div>
              
              <DialogFooter className="pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleClose}
                  className="px-6 py-3 text-base"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="px-6 py-3 text-base bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white"
                >
                  {editingCategory ? 'Actualizar' : 'Crear'} Categoría
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {categories.map((category) => {
            const productCount = getCategoryProductCount(category.name); 
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 flex flex-col"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center shadow-md">
                    <Folder className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-xl text-gray-800 capitalize truncate" title={category.name}>{category.name}</h3>
                    <p className="text-sm text-gray-500">{productCount} producto(s)</p>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-5 line-clamp-3 flex-grow">
                  {category.description}
                </p>

                <div className="space-y-2 mb-5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">ID:</span>
                    <span className="text-gray-700 font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">
                      {category.id.substring(0,8)}...
                    </span>
                  </div>
                   <div className="flex items-center justify-between">
                    <span className="text-gray-500">Productos:</span>
                    <span className={`font-semibold ${
                      productCount > 0 ? 'text-green-700' : 'text-gray-600'
                    }`}>
                      {productCount}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-3 mt-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                    onClick={() => handleEdit(category)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => handleDelete(category.id)}
                    disabled={productCount > 0}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar
                  </Button>
                </div>

                {productCount > 0 && (
                  <p className="text-xs text-amber-700 mt-3 flex items-center bg-amber-50 p-2 rounded-md border border-amber-200">
                    <AlertCircle className="w-4 h-4 mr-1.5 flex-shrink-0" />
                    No se puede eliminar: tiene productos asociados.
                  </p>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {categories.length === 0 && !dataLoading && (
        <div className="text-center py-16 col-span-full">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Folder className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-3">No hay categorías</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Crea la primera categoría para organizar tu catálogo de productos.
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoriesManagement;