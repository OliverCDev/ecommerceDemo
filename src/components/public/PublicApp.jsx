import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import AuthModal from '@/components/auth/AuthModal';
import PublicHeader from '@/components/public/PublicHeader';
import HeroSection from '@/components/public/HeroSection';
import FeaturedProductsSection from '@/components/public/FeaturedProductsSection';
import ProductCatalogSection from '@/components/public/ProductCatalogSection';
import CallToActionSection from '@/components/public/CallToActionSection';
import PublicFooter from '@/components/public/PublicFooter';

const PublicApp = () => {
  const { products, categories: dataCategories, loading: dataLoading } = useData();
  const { loginWithGoogle, isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [favorites, setFavorites] = useState([]);

  const categoriesForFilter = [
    { id: 'todos', name: 'Todos' },
    ...(Array.isArray(dataCategories) ? dataCategories : [])
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'todos' || product.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  const featuredProducts = products.filter(product => product.featured).slice(0,3);

  const addToCart = (product) => {
    if (!isAuthenticated) {
      toast({
        title: "🚧 Inicia sesión para comprar",
        description: "Regístrate o inicia sesión para agregar productos al carrito",
      });
      setShowAuthModal(true);
    } else {
      toast({
        title: "🚧 Carrito no implementado",
        description: "Esta función estará disponible pronto. ¡Gracias por tu paciencia!",
      });
    }
  };

  const toggleFavorite = (productId) => {
     if (!isAuthenticated) {
      toast({
        title: "🚧 Inicia sesión para favoritos",
        description: "Regístrate o inicia sesión para guardar tus productos favoritos",
      });
      setShowAuthModal(true);
    } else {
      toast({
        title: "🚧 Favoritos no implementado",
        description: "Esta función estará disponible pronto. ¡Gracias por tu paciencia!",
      });
    }
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
  };
  
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <PublicHeader 
        onAuthModalOpen={() => setShowAuthModal(true)}
        onGoogleLogin={handleGoogleLogin}
        onScrollToSection={scrollToSection}
      />
      <HeroSection 
        onScrollToSection={scrollToSection}
        onAuthModalOpen={() => setShowAuthModal(true)}
      />
      <FeaturedProductsSection 
        products={featuredProducts}
        onAddToCart={addToCart}
        onToggleFavorite={toggleFavorite}
        favorites={favorites}
      />
      <ProductCatalogSection
        products={filteredProducts}
        categories={categoriesForFilter}
        searchTerm={searchTerm}
        onSearchTermChange={(e) => setSearchTerm(e.target.value)}
        selectedCategory={selectedCategory}
        onSelectedCategoryChange={(e) => setSelectedCategory(e.target.value)}
        onAddToCart={addToCart}
        onToggleFavorite={toggleFavorite}
        favorites={favorites}
        loading={dataLoading}
      />
      <CallToActionSection onAuthModalOpen={() => setShowAuthModal(true)} />
      <PublicFooter onScrollToSection={scrollToSection} />
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onGoogleLogin={handleGoogleLogin}
      />
    </div>
  );
};

export default PublicApp;