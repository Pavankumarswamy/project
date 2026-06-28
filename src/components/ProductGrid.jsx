import React, { useState, useMemo } from 'react';
import { Search, Sparkles } from 'lucide-react';
import ProductCard from './ProductCard';

const CATEGORIES = [
  { id: 'all', name: 'All Products' },
  { id: 'tableware', name: 'Tableware', types: ['plate', 'cup', 'label', 'juicelabel', 'cupcaketopper'] },
  { id: 'packaging', name: 'Bags & Packaging', types: ['bag', 'wrapper', 'box', 'boxcover', 'tag', 'sticker'] },
  { id: 'decor', name: 'Decor & Banners', types: ['board', 'banner', 'topper'] },
  { id: 'stationery', name: 'Invitations & Cards', types: ['card', 'thankyou', 'prop', 'hat'] }
];

export default function ProductGrid({ products, selectedTheme, config, onViewDetails }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // 1. Search filter
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 2. Category filter
      if (activeCategory === 'all') return matchesSearch;
      const category = CATEGORIES.find(c => c.id === activeCategory);
      const matchesCategory = category ? category.types.includes(product.type) : true;
      
      return matchesSearch && matchesCategory;
    });
  }, [products, activeCategory, searchQuery]);

  return (
    <section style={{ padding: '60px 0' }} id="supplies-grid">
      <div className="container">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(236, 72, 153, 0.1)',
            border: '1px solid rgba(236, 72, 153, 0.2)',
            padding: '6px 16px',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            color: 'var(--primary)',
            fontWeight: 700,
            marginBottom: '16px'
          }}>
            <Sparkles size={14} />
            Theme-Specific Supplies
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '12px' }}>
            Customize Your Party Package
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', fontSize: '1rem' }}>
            Watch every product dynamically adapt to the <span style={{ color: selectedTheme.primaryColor, fontWeight: 700 }}>{selectedTheme.name}</span> theme. Customize the guest details below to render them on-screen!
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="glass-panel" style={{
          padding: '16px 24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          marginBottom: '40px',
          borderRadius: 'var(--radius-lg)'
        }}>
          {/* Categories */}
          <div style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            zIndex: 2
          }}>
            {CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  background: activeCategory === category.id ? selectedTheme.primaryColor : 'rgba(255, 255, 255, 0.03)',
                  color: activeCategory === category.id ? selectedTheme.textColor : 'var(--text-secondary)',
                  border: activeCategory === category.id ? '1px solid transparent' : '1px solid rgba(255, 255, 255, 0.05)',
                  boxShadow: activeCategory === category.id ? `0 4px 14px ${selectedTheme.primaryColor}55` : 'none'
                }}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '300px'
          }}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{
                width: '100%',
                paddingLeft: '44px',
                borderRadius: '12px'
              }}
            />
            <Search 
              size={18} 
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} 
            />
          </div>
        </div>

        {/* Count indicator */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Showing <strong>{filteredProducts.length}</strong> supplies
          </span>
        </div>

        {/* Grid Container */}
        {filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                theme={selectedTheme}
                config={config}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '80px 24px',
            border: '2px dashed rgba(255, 255, 255, 0.05)',
            borderRadius: 'var(--radius-lg)',
            background: 'rgba(255,255,255,0.01)'
          }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>No supplies found</h3>
            <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search query or selecting a different category filter.</p>
          </div>
        )}
      </div>
    </section>
  );
}
