import React from 'react';
import { PlusCircle, Compass } from 'lucide-react';

export default function ThemeGrid({ themes, activeTheme, onSelectTheme, onCreateCustomTheme }) {
  return (
    <section style={{ padding: '80px 0 40px 0' }} id="theme-selector-section">
      <div className="container">
        
        {/* Title */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          marginBottom: '50px'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            padding: '6px 16px',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            color: 'var(--secondary)',
            fontWeight: 700,
            marginBottom: '16px'
          }}>
            <Compass size={14} />
            Step 1: Choose a Birthday Theme
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '12px' }}>
            Browse Popular Party Themes
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', fontSize: '1.05rem' }}>
            Select a theme to instantly apply its colors, patterns, and character artwork to all return bags, paper plates, chocolate wrappers, and other birthday supplies.
          </p>
        </div>

        {/* Themes Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
          gap: '32px',
          justifyContent: 'center'
        }}>
          {themes.map(theme => (
            <div
              key={theme.id}
              className={`theme-circle-container ${activeTheme.id === theme.id ? 'active' : ''}`}
              onClick={() => onSelectTheme(theme)}
            >
              <div className="theme-circle-outer">
                <div className="theme-circle-inner">
                  <img
                    src={theme.image}
                    alt={theme.name}
                    className="theme-circle-image"
                    loading="lazy"
                    onError={(e) => {
                      // fallback simple colored circle if SVG fails
                      e.target.style.display = 'none';
                    }}
                  />
                  {/* Inside glow overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(circle, transparent 50%, ${theme.primaryColor}22 100%)`,
                    pointerEvents: 'none'
                  }} />
                </div>
              </div>
              <span className="theme-circle-name">{theme.name}</span>
            </div>
          ))}

          {/* Special Option: Create New Theme */}
          <div
            className="theme-circle-container"
            onClick={onCreateCustomTheme}
            style={{ opacity: 0.95 }}
          >
            <div className="theme-circle-outer" style={{
              background: 'linear-gradient(135deg, #4b5563 0%, #1f2937 100%)',
              border: '2px dashed rgba(255, 255, 255, 0.2)'
            }}>
              <div className="theme-circle-inner" style={{ background: '#090d16' }}>
                <PlusCircle size={40} style={{ color: 'var(--primary)' }} />
              </div>
            </div>
            <span className="theme-circle-name" style={{ color: 'var(--primary)', fontWeight: 700 }}>
              + Custom Theme
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
