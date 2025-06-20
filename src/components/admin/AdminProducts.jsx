import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useData } from '@/contexts/DataContext';

const AdminProducts = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useData();
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    category: 'muebles',
    description: '',
    stock: '',
    featured: false
  });

  const resetProductForm = () => {
    setProductForm({
      name: '',
      price: '',
      category: 'muebles',
      description: '',
      stock: '',
      featured: false
    });
    setEditingProduct(null);
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    
    const productData = {
      ...productForm,
      price: parseFloat(productForm.price),
      stock: parseInt(productForm.stock),
      rating: 4.5
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }

    setShowProductDialog(false);
    resetProductForm();
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description,
      stock: product.stock.toString(),
      featured: product.featured
    });
    setShowProductDialog(true);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      deleteProduct(productId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Gestión de Productos</h2>
        <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
          <DialogTrigger asChild>
            <Button 
              onClick={resetProductForm}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre del producto</Label>
                <Input
                  id="name"
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="price">Precio</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={productForm.price}
                  onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="category">Categoría</Label>
                <select
                  id="category"
                  value={productForm.category}
                  onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="muebles">Muebles</option>
                  <option value="decoracion">Decoración</option>
                  <option value="oficina">Oficina</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="description">Descripción</Label>
                <textarea
                  id="description"
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={productForm.featured}
                  onChange={(e) => setProductForm({...productForm, featured: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="featured">Producto destacado</Label>
              </div>
              
              <div className="flex space-x-2">
                <Button type="submit" className="flex-1">
                  {editingProduct ? 'Actualizar' : 'Agregar'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowProductDialog(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <img  
              className="w-full h-48 object-cover" 
              alt={`${product.name} - producto en tienda`}
             src="https://images.unsplash.com/photo-1675825547463-0788eca2320e" />
            
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{product.description}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold text-blue-600">${product.price}</span>
                <span className="text-sm text-gray-500">Stock: {product.stock}</span>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditProduct(product)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteProduct(product.id)}
                  className="flex-1"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Eliminar
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;