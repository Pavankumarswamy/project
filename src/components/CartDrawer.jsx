import React from 'react';
import { X, Trash2, PartyPopper, CheckCircle } from 'lucide-react';

export default function CartDrawer({ 
  open, 
  items, 
  onClose, 
  onRemoveItem, 
  onClearCart, 
  onUpdateQuantity 
}) {
  
  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.product.basePrice * item.quantity), 0);
  };

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(val / 100);
  };

  const handleCheckout = () => {
    alert("🎉 Order customized successfully! Mock invoice generated. Your customized print-ready packages have been compiled and sent to our production queue.");
    onClearCart();
    onClose();
  };

  return (
    <>
      {/* Background overlay */}
      {open && (
        <div className="cart-drawer-overlay" onClick={onClose} />
      )}

      {/* Slide out drawer container */}
      <div className={`cart-drawer ${open ? 'open' : ''}`}>
        
        {/* Header */}
        <div className="cart-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PartyPopper size={20} style={{ color: 'var(--primary)' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>My Birthday Pack</h2>
          </div>
          <button 
            onClick={onClose}
            style={{
              padding: '6px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content list */}
        <div className="cart-items">
          {items.length > 0 ? (
            items.map((item, index) => {
              const primary = item.theme.primaryColor;
              return (
                <div key={index} className="cart-item">
                  {/* Thumbnail preview */}
                  <div className="cart-item-preview">
                    {item.imageUrl ? (
                      <img 
                        src={item.imageUrl} 
                        alt={item.product.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: '#020617' }} />
                    )}
                  </div>

                  {/* Info details */}
                  <div className="cart-item-details">
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(index)}
                          style={{
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            padding: '4px'
                          }}
                          className="trash-btn"
                          title="Remove item"
                        >
                          <Trash2 size={14} style={{ hover: { color: '#ef4444' } }} />
                        </button>
                      </div>
                      <span style={{ fontSize: '0.7rem', color: primary, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {item.theme.name} Theme
                      </span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Text: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{item.customName}</span>
                        {item.customAge && (
                          <>, Age: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{item.customAge}</span></>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                      {/* Quantity Editor */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', background: 'rgba(3, 7, 18, 0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '2px' }}>
                        <button 
                          onClick={() => onUpdateQuantity(index, Math.max(1, item.quantity - 1))}
                          style={{ width: '24px', height: '24px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 700 }}
                        >
                          -
                        </button>
                        <span style={{ width: '20px', textAlign: 'center', fontSize: '0.8rem', fontWeight: 600 }}>{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                          style={{ width: '24px', height: '24px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 700 }}
                        >
                          +
                        </button>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                          {formatPrice(item.product.basePrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
              color: 'var(--text-muted)'
            }}>
              <PartyPopper size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
                Your pack is empty
              </h3>
              <p style={{ fontSize: '0.85rem', maxWidth: '280px' }}>
                Select a birthday theme, customize your details, and add some supplies to build your party package!
              </p>
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {items.length > 0 && (
          <div className="cart-footer">
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Subtotal</span>
              <strong style={{ fontSize: '1.5rem', fontWeight: 800 }}>{formatPrice(calculateTotal())}</strong>
            </div>

            <div style={{
              display: 'flex',
              gap: '8px',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              alignItems: 'flex-start',
              marginBottom: '20px',
              background: 'rgba(250, 204, 21, 0.05)',
              border: '1px solid rgba(250, 204, 21, 0.1)',
              padding: '10px 14px',
              borderRadius: '8px'
            }}>
              <CheckCircle size={14} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Design Proofing:</strong> All items will be pre-aligned programmatically by our canvas engine before physical printing. Mock templates are preserved.
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '16px',
                fontSize: '1rem',
                fontWeight: 700
              }}
            >
              Complete Custom Order
            </button>
          </div>
        )}

      </div>
    </>
  );
}
