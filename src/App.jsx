import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ThemeGrid from './components/ThemeGrid';
import ThemeBanner from './components/ThemeBanner';
import ProductGrid from './components/ProductGrid';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import CustomThemeCreator from './components/CustomThemeCreator';

// Import JSON databases
import defaultThemes from './data/themes.json';
import defaultProducts from './data/products.json';

export default function App() {
  const [themes, setThemes] = useState(defaultThemes);
  const [products] = useState(defaultProducts);
  const [selectedTheme, setSelectedTheme] = useState(defaultThemes[0]);
  
  // Customization Configuration State
  const [config, setConfig] = useState({
    customName: 'Ethan',
    customAge: '5',
    activeImageSrc: defaultThemes[0].image,
    isCustomImage: false,
    uploadedImageName: '',
    loadedImage: null,
    customColors: null // Overridden theme colors
  });

  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCustomThemeCreatorOpen, setIsCustomThemeCreatorOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);

  // 1. Central Image Preloader
  useEffect(() => {
    let active = true;
    setConfig(prev => ({ ...prev, loadedImage: null })); // reset to show spinner during load

    const img = new Image();
    if (!config.activeImageSrc.startsWith('data:')) {
      img.crossOrigin = 'anonymous';
    }
    img.src = config.activeImageSrc;
    img.onload = () => {
      if (active) {
        setConfig(prev => ({ ...prev, loadedImage: img }));
      }
    };
    img.onerror = () => {
      console.error("Error loading theme character image:", config.activeImageSrc);
    };

    return () => {
      active = false;
    };
  }, [config.activeImageSrc]);

  // 2. Select a theme
  const handleSelectTheme = (theme) => {
    setSelectedTheme(theme);
    setConfig(prev => ({
      ...prev,
      activeImageSrc: theme.image,
      isCustomImage: false,
      uploadedImageName: '',
      customColors: null // Reset color overrides
    }));
  };

  // 3. Save a new custom theme built in workshop
  const handleSaveTheme = (newTheme) => {
    setThemes(prev => [...prev, newTheme]);
    setSelectedTheme(newTheme);
    setConfig(prev => ({
      ...prev,
      activeImageSrc: newTheme.image,
      isCustomImage: newTheme.image.startsWith('data:'),
      uploadedImageName: newTheme.image.startsWith('data:') ? 'custom_mascot.png' : '',
      customColors: {
        primaryColor: newTheme.primaryColor,
        secondaryColor: newTheme.secondaryColor,
        accentColor: newTheme.accentColor,
        textColor: newTheme.textColor
      }
    }));
  };

  // 4. Reset colors back to theme defaults
  const handleResetColors = () => {
    setConfig(prev => ({
      ...prev,
      customColors: null
    }));
  };

  // 5. Upload custom theme-wide mascot artwork
  const handleCustomImageUpload = (dataUrl, fileName) => {
    if (dataUrl) {
      setConfig(prev => ({
        ...prev,
        activeImageSrc: dataUrl,
        isCustomImage: true,
        uploadedImageName: fileName
      }));
    } else {
      // Remove custom artwork, fall back to default theme artwork
      setConfig(prev => ({
        ...prev,
        activeImageSrc: selectedTheme.image,
        isCustomImage: false,
        uploadedImageName: ''
      }));
    }
  };

  // 6. Shopping Bag Add/Remove/Update
  const handleAddToCart = (cartItem) => {
    setCart(prev => [...prev, cartItem]);
  };

  const handleRemoveFromCart = (indexToRemove) => {
    setCart(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleUpdateQuantity = (index, newQty) => {
    setCart(prev => prev.map((item, idx) => 
      idx === index ? { ...item, quantity: newQty } : item
    ));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Smooth scroll helper
  const handleScrollToThemes = () => {
    const el = document.getElementById('theme-selector-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const primary = config.customColors?.primaryColor || selectedTheme.primaryColor;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* Sticky Header */}
      <Navbar 
        selectedTheme={selectedTheme} 
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        onScrollToThemes={handleScrollToThemes}
      />

      {/* Hero Section */}
      <HeroSection 
        selectedTheme={selectedTheme}
        onScrollToThemes={handleScrollToThemes}
      />

      {/* Theme Circular Grid */}
      <ThemeGrid 
        themes={themes}
        activeTheme={selectedTheme}
        onSelectTheme={handleSelectTheme}
        onCreateCustomTheme={() => setIsCustomThemeCreatorOpen(true)}
      />

      {/* Active Theme Customization Banner */}
      <ThemeBanner
        theme={selectedTheme}
        config={config}
        onConfigChange={setConfig}
        onResetColors={handleResetColors}
        onCustomImageUpload={handleCustomImageUpload}
      />

      {/* Main Product Catalog Grid */}
      <ProductGrid 
        products={products}
        selectedTheme={selectedTheme}
        config={config}
        onViewDetails={setSelectedProductDetail}
      />

      {/* Detail Modal */}
      {selectedProductDetail && (
        <ProductDetailModal
          product={selectedProductDetail}
          theme={selectedTheme}
          config={config}
          onClose={() => setSelectedProductDetail(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Slide out shopping drawer */}
      <CartDrawer
        open={isCartOpen}
        items={cart}
        onClose={() => setIsCartOpen(false)}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onUpdateQuantity={handleUpdateQuantity}
      />

      {/* Custom Theme Workshop popup */}
      {isCustomThemeCreatorOpen && (
        <CustomThemeCreator
          onClose={() => setIsCustomThemeCreatorOpen(false)}
          onSaveTheme={handleSaveTheme}
        />
      )}

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        background: '#030712',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '40px 0 20px 0',
        color: 'var(--text-secondary)',
        fontSize: '0.85rem'
      }}>
        <div className="container" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
            Loom<span style={{ color: primary }}>Parties</span>
          </h2>
          <p style={{ maxWidth: '500px', lineHeight: '1.5' }}>
            We programmatically combine standard print mockups with vector templates, dynamic background patterns, and custom text options to generate custom printable products instantly.
          </p>
          <div style={{
            display: 'flex',
            gap: '24px',
            fontSize: '0.75rem',
            color: 'var(--text-muted)'
          }}>
            <span>No Accounts Required</span>
            <span>•</span>
            <span>Chroma-keyed Uploads</span>
            <span>•</span>
            <span>Vector Composites</span>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '20px' }}>
            © {new Date().getFullYear()} LoomParties Inc. All rights reserved. Built using React & HTML5 Canvas.
          </span>
        </div>
      </footer>

    </div>
  );
}
