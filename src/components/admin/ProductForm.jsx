
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import ProductFormFields from '@/components/admin/ProductFormFields';
import ProductImageUpload from '@/components/admin/ProductImageUpload';

const ProductForm = ({ isOpen, onClose, product }) => {
  const { addProduct, updateProduct, categories: availableCategories } = useData();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: availableCategories.length > 0 ? availableCategories[0].name : '', // Default to first category name
    description: '',
    stock: '',
    imageUrl: '',
    featured: false
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        category: product.category, // This should be category name
        description: product.description,
        stock: product.stock.toString(),
        imageUrl: product.imageUrl || '',
        featured: product.featured || false
      });
      setImagePreview(product.imageUrl || '');
    } else {
      setFormData({
        name: '',
        price: '',
        category: availableCategories.length > 0 ? availableCategories[0].name : '',
        description: '',
        stock: '',
        imageUrl: '',
        featured: false
      });
      setImagePreview('');
    }
    setErrors({});
  }, [product, isOpen, availableCategories]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre del producto es obligatorio';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'El precio debe ser mayor a 0';
    if (!formData.description.trim()) newErrors.description = 'La descripción es obligatoria';
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'El stock debe ser 0 o mayor';
    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) newErrors.imageUrl = 'La URL de la imagen no es válida';
    if (!formData.category) newErrors.category = 'La categoría es obligatoria';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try { new URL(string); return true; } catch (_) { return false; }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const productData = {
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      category: formData.category, // Pass category name
      description: formData.description.trim(),
      stock: parseInt(formData.stock),
      imageUrl: formData.imageUrl.trim() || null,
      featured: formData.featured,
      rating: product?.rating || 4.5
    };

    if (product) {
      await updateProduct(product.id, { ...productData, categoryId: product.categoryId }); // Pass existing categoryId for update
    } else {
      await addProduct(productData);
    }
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: newValue }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (name === 'imageUrl' && value && isValidUrl(value)) setImagePreview(value);
    else if (name === 'imageUrl' && !value) setImagePreview('');
  };

  const handleImageError = () => {
    setImagePreview('');
    setErrors(prev => ({ ...prev, imageUrl: 'No se pudo cargar la imagen desde esta URL' }));
  };

  if (!isOpen) return null;

  const formCategories = availableCategories.map(cat => ({ id: cat.name, name: cat.name }));


  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b sticky top-0 bg-white z-10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                {product ? 'Editar Producto' : 'Agregar Nuevo Producto'}
              </h2>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <X className="w-6 h-6" />
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
              <ProductFormFields
                formData={formData}
                errors={errors}
                categories={formCategories}
                handleInputChange={handleInputChange}
              />
              <ProductImageUpload
                formData={formData}
                errors={errors}
                imagePreview={imagePreview}
                handleInputChange={handleInputChange}
                handleImageError={handleImageError}
              />
            </div>

            <div className="flex space-x-4 pt-8 mt-8 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 py-3 text-lg"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 py-3 text-lg bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white shadow-md hover:shadow-lg transition-all"
              >
                {product ? 'Actualizar Producto' : 'Agregar Producto'}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductForm;
