import React, { useRef, useEffect, useState } from 'react';
import { X, Download, ShoppingBag, Info, Sparkles, Check } from 'lucide-react';
import { drawProductMockup } from '../utils/canvasRenderer';

export default function ProductDetailModal({ 
  product, 
  theme, 
  config, 
  onClose, 
  onAddToCart 
}) {
  const canvasRef = useRef(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  
  // Custom text override specifically for this item
  const [itemSubtitle, setItemSubtitle] = useState('');

  // Combine global config with local overrides
  const localConfig = {
    ...config,
    customName: itemSubtitle || config.customName
  };

  useEffect(() => {
    let active = true;
    if (canvasRef.current && config.loadedImage) {
      const timer = setTimeout(() => {
        if (!active) return;
        drawProductMockup(canvasRef.current, product, theme, localConfig);
      }, 50);
      return () => {
        active = false;
        clearTimeout(timer);
      };
    }
  }, [product, theme, config, config.loadedImage, itemSubtitle]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    
    // Create download link
    const link = document.createElement('a');
    const nameSlug = (localConfig.customName || 'custom').replace(/\s+/g, '_').toLowerCase();
    link.download = `LoomParties_${theme.slug}_${product.type}_${nameSlug}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const handleAdd = () => {
    onAddToCart({
      product,
      theme,
      customName: localConfig.customName,
      customAge: localConfig.customAge,
      customColors: localConfig.customColors,
      quantity,
      imageUrl: canvasRef.current?.toDataURL('image/png')
    });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(val / 100);
  };

  const primary = config.customColors?.primaryColor || theme.primaryColor;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        
        {/* Left Side: Dynamic Canvas Mockup */}
        <div className="modal-left">
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%' }}>
            <div style={{
              width: '100%',
              maxWidth: '380px',
              aspectRatio: '1',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
              border: '1px solid rgba(255,255,255,0.06)',
              background: '#020617'
            }}>
              <canvas 
                ref={canvasRef} 
                width={400} 
                height={400} 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            
            {/* Download Print Mockup Button */}
            <button
              onClick={handleDownload}
              className="btn btn-secondary animate-float"
              style={{
                padding: '12px 24px',
                fontSize: '0.9rem',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                maxWidth: '380px',
                justifyContent: 'center',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(255, 255, 255, 0.03)'
              }}
            >
              <Download size={16} />
              Download High-Res Print File (PNG)
            </button>
          </div>
        </div>

        {/* Right Side: Specifications & Actions */}
        <div className="modal-right">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: primary, marginBottom: '8px' }}>
              <Sparkles size={14} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                PRINT-ON-DEMAND SUPPLIES
              </span>
            </div>
            
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '8px' }}>
              {product.name}
            </h2>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              marginBottom: '20px'
            }}>
              <span style={{
                background: 'rgba(255,255,255,0.05)',
                padding: '4px 10px',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                Size: <strong>{product.dimensions}</strong>
              </span>
              <span style={{
                background: 'rgba(255,255,255,0.05)',
                padding: '4px 10px',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                Pack: <strong>{product.packSize}</strong>
              </span>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px' }}>
              {product.description} Renders character illustrations, typography borders, and pattern backdrops instantly based on the active theme setting. Double-layered gloss print.
            </p>

            {/* Custom local override input */}
            <div className="form-control" style={{ marginBottom: '24px' }}>
              <label htmlFor="modal-subtitle-input">Override Header Text for this item (Optional)</label>
              <input
                id="modal-subtitle-input"
                type="text"
                placeholder={config.customName || "e.g. ALEX"}
                value={itemSubtitle}
                onChange={(e) => setItemSubtitle(e.target.value)}
                className="form-input"
                style={{ width: '100%' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Leaves other items unchanged. Leave blank to match global settings.
              </span>
            </div>

            {/* Quality Specs Info Box */}
            <div style={{
              display: 'flex',
              gap: '10px',
              padding: '12px 16px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              alignItems: 'flex-start',
              marginBottom: '24px'
            }}>
              <Info size={16} style={{ color: primary, flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Material:</strong> 300GSM food-safe matte cardstock. Highly resistant to spills. Pre-cut, creased, and flat-packed with easy self-assembly guidelines.
              </div>
            </div>
          </div>

          {/* Pricing and cart add */}
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            paddingTop: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px'
          }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Price per Pack</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {formatPrice(product.basePrice)}
                </span>
                <span style={{ fontSize: '0.95rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                  {formatPrice(product.originalPrice)}
                </span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(3, 7, 18, 0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '4px' }}>
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 700 }}
              >
                -
              </button>
              <span style={{ width: '28px', textAlign: 'center', fontWeight: 600 }}>{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 700 }}
              >
                +
              </button>
            </div>

            {/* Add to Pack Button */}
            <button
              onClick={handleAdd}
              className="btn btn-primary"
              style={{
                flexGrow: 1,
                padding: '14px 28px',
                borderRadius: '16px',
                background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`,
                boxShadow: `0 4px 14px ${theme.primaryColor}44`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {added ? (
                <>
                  <Check size={16} />
                  Added!
                </>
              ) : (
                <>
                  <ShoppingBag size={16} />
                  Add to Pack
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
