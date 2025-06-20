import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

export const useCart = (userId) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem(`ecommerce-cart-${userId}`);
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, [userId]);

  useEffect(() => {
    localStorage.setItem(`ecommerce-cart-${userId}`, JSON.stringify(cart));
  }, [cart, userId]);

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
        toast({
          title: "¡Producto agregado!",
          description: `${product.name} se agregó al carrito`,
        });
      } else {
        toast({
          title: "Stock insuficiente",
          description: "No hay más unidades disponibles",
          variant: "destructive"
        });
      }
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
      toast({
        title: "¡Producto agregado!",
        description: `${product.name} se agregó al carrito`,
      });
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
    toast({
      title: "Producto eliminado",
      description: "El producto se eliminó del carrito",
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }

    setCart(cart.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const clearCart = () => {
    setCart([]);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
    clearCart
  };
};