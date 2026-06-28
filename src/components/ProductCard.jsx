import React, { useRef, useEffect, useState } from 'react';
import { Star, Eye } from 'lucide-react';
import { drawProductMockup } from '../utils/canvasRenderer';

export default function ProductCard({ product, theme, config, onViewDetails }) {
  const canvasRef = useRef(null);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    let active = true;
    if (canvasRef.current && config.loadedImage) {
      // Small timeout to ensure canvas dimensions are resolved in DOM
      const timer = setTimeout(() => {
        if (!active) return;
        drawProductMockup(canvasRef.current, product, theme, config);
        setIsRendered(true);
      }, 50);
      return () => {
        active = false;
        clearTimeout(timer);
      };
    }
  }, [product, theme, config, config.loadedImage]);

  // Formatting currencies
  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val / 100);
  };

  return (
    <div className="product-card animate-slide-up">
      <div className="product-card-canvas-wrapper">
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={400} 
          className="product-card-canvas"
        />
        {!isRendered && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#020617',
            color: '#6b7280'
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              border: '2px solid rgba(255,255,255,0.1)',
              borderTopColor: theme.primaryColor,
              borderRadius: '50%',
              animation: 'rotateSlow 1s linear infinite'
            }} />
          </div>
        )}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'rgba(3, 7, 18, 0.85)',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '4px 8px',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: theme.primaryColor
        }}>
          {product.packSize}
        </div>
      </div>
      
      <div className="product-card-info">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', fontWeight: 700 }}>
          {product.name}
        </h3>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '16px' }}>
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={14} 
              fill={i < Math.floor(product.rating) ? "#facc15" : "none"} 
              stroke={i < Math.floor(product.rating) ? "#facc15" : "#4b5563"} 
            />
          ))}
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '4px' }}>
            ({product.rating})
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 'auto' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
              {formatPrice(product.originalPrice)}
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {formatPrice(product.basePrice)}
            </div>
          </div>
          
          <button 
            onClick={() => onViewDetails(product)}
            className="btn btn-secondary"
            style={{ 
              padding: '8px 16px', 
              fontSize: '0.85rem',
              borderRadius: '12px',
              display: 'flex',
              gap: '6px',
              alignItems: 'center'
            }}
          >
            <Eye size={14} />
            Details
          </button>
        </div>
      </div>
    </div>
  );
}
