import React from 'react';
import { ShoppingBag, Sparkles, Sliders } from 'lucide-react';

export default function Navbar({ selectedTheme, cartCount, onCartClick, onScrollToThemes }) {
  return (
    <nav className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      left: 0,
      right: 0,
      height: 'var(--header-height)',
      display: 'flex',
      alignItems: 'center',
      borderRadius: '0 0 24px 24px',
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      zIndex: 90,
      padding: '0 32px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 'var(--max-width)',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: `linear-gradient(135deg, ${selectedTheme.primaryColor} 0%, var(--primary) 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 4px 14px ${selectedTheme.primaryColor}44`
          }}>
            <Sparkles size={20} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1.1 }}>
              Loom<span style={{ color: selectedTheme.primaryColor }}>Parties</span>
            </h1>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>
              CUSTOM CELEBRATIONS
            </span>
          </div>
        </div>

        {/* Center Active Theme Indicator */}
        <div 
          onClick={onScrollToThemes}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            padding: '8px 16px',
            borderRadius: '9999px',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)'
          }}
          className="btn-secondary"
        >
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: selectedTheme.primaryColor,
            boxShadow: `0 0 10px ${selectedTheme.primaryColor}`
          }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
            Theme: <strong style={{ color: selectedTheme.primaryColor }}>{selectedTheme.name}</strong>
          </span>
          <Sliders size={12} style={{ color: 'var(--text-muted)' }} />
        </div>

        {/* Right Actions (Shopping Pack Drawer Toggle) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={onCartClick}
            className="btn btn-primary"
            style={{
              padding: '10px 20px',
              fontSize: '0.9rem',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: `linear-gradient(135deg, ${selectedTheme.primaryColor} 0%, ${selectedTheme.secondaryColor} 100%)`,
              boxShadow: `0 4px 14px ${selectedTheme.primaryColor}33`,
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <ShoppingBag size={18} />
            <span>My Party Pack</span>
            {cartCount > 0 && (
              <span style={{
                background: '#ffffff',
                color: '#0f172a',
                fontSize: '0.75rem',
                fontWeight: 800,
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                animation: 'pulseGlow 2s infinite'
              }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
