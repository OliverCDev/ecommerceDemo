import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

export const useFavorites = (userId) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem(`ecommerce-favorites-${userId}`);
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, [userId]);

  useEffect(() => {
    localStorage.setItem(`ecommerce-favorites-${userId}`, JSON.stringify(favorites));
  }, [favorites, userId]);

  const toggleFavorite = (productId) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId));
      toast({
        title: "Eliminado de favoritos",
        description: "El producto se eliminó de tus favoritos",
      });
    } else {
      setFavorites([...favorites, productId]);
      toast({
        title: "Agregado a favoritos",
        description: "El producto se agregó a tus favoritos",
      });
    }
  };

  return {
    favorites,
    toggleFavorite
  };
};