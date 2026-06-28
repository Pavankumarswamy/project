import React, { useRef } from 'react';
import { Upload, RefreshCw, Sparkles, Sliders } from 'lucide-react';

export default function ThemeBanner({ 
  theme, 
  config, 
  onConfigChange, 
  onResetColors, 
  onCustomImageUpload 
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onCustomImageUpload(event.target.result, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleColorChange = (key, val) => {
    onConfigChange({
      ...config,
      customColors: {
        ...config.customColors,
        [key]: val
      }
    });
  };

  // Extract color values (either overridden or default)
  const primary = config.customColors?.primaryColor || theme.primaryColor;
  const secondary = config.customColors?.secondaryColor || theme.secondaryColor;
  const accent = config.customColors?.accentColor || theme.accentColor;
  const textCol = config.customColors?.textColor || theme.textColor;

  return (
    <section className="container" id="customizer-panel" style={{ padding: '20px 0' }}>
      <div className="theme-panel-section">
        <div className="theme-panel-content">
          
          {/* Left panel: Info and color pickers */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: primary, marginBottom: '12px' }}>
                <Sparkles size={16} />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Active Studio
                </span>
              </div>
              
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '8px' }}>
                Customizing: <span style={{ color: primary }}>{theme.name} Theme</span>
              </h2>
              
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5', maxWidth: '500px' }}>
                {theme.tagline} Modify colors, add custom birthday texts, or upload your own PNG illustration below. Every product mockup adapts instantly!
              </p>
            </div>

            {/* Color Pickers */}
            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sliders size={14} /> Customize Theme Palette
              </h4>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
                {/* Primary Color */}
                <div className="color-picker-group">
                  <div className="color-input-wrapper">
                    <input 
                      type="color" 
                      value={primary} 
                      onChange={(e) => handleColorChange('primaryColor', e.target.value)} 
                    />
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Primary</span>
                </div>

                {/* Secondary Color */}
                <div className="color-picker-group">
                  <div className="color-input-wrapper">
                    <input 
                      type="color" 
                      value={secondary} 
                      onChange={(e) => handleColorChange('secondaryColor', e.target.value)} 
                    />
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Secondary</span>
                </div>

                {/* Accent Color */}
                <div className="color-picker-group">
                  <div className="color-input-wrapper">
                    <input 
                      type="color" 
                      value={accent} 
                      onChange={(e) => handleColorChange('accentColor', e.target.value)} 
                    />
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Accent</span>
                </div>

                {/* Text Color */}
                <div className="color-picker-group">
                  <div className="color-input-wrapper">
                    <input 
                      type="color" 
                      value={textCol} 
                      onChange={(e) => handleColorChange('textColor', e.target.value)} 
                    />
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Text/Outline</span>
                </div>

                {/* Reset Colors Button */}
                {config.customColors && Object.keys(config.customColors).length > 0 && (
                  <button
                    onClick={onResetColors}
                    className="btn btn-secondary"
                    style={{
                      padding: '8px 14px',
                      fontSize: '0.75rem',
                      borderRadius: '8px',
                      marginLeft: 'auto'
                    }}
                  >
                    <RefreshCw size={12} />
                    Reset Palette
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right panel: Custom text and image upload */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="custom-inputs-grid">
              
              {/* Custom Guest Name */}
              <div className="form-control">
                <label htmlFor="custom-name-input">Guest of Honor (Name)</label>
                <input
                  id="custom-name-input"
                  type="text"
                  placeholder="e.g. Ethan"
                  value={config.customName}
                  onChange={(e) => onConfigChange({ ...config, customName: e.target.value })}
                  className="form-input"
                />
              </div>

              {/* Custom Age */}
              <div className="form-control">
                <label htmlFor="custom-age-input">Age (Number)</label>
                <input
                  id="custom-age-input"
                  type="number"
                  placeholder="e.g. 5"
                  value={config.customAge}
                  onChange={(e) => onConfigChange({ ...config, customAge: e.target.value })}
                  className="form-input"
                  min="0"
                  max="99"
                />
              </div>

            </div>

            {/* Custom Artwork Upload zone */}
            <div className="form-control">
              <label>Theme Character / Brand Artwork</label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
              />

              {config.isCustomImage ? (
                <div className="file-upload-preview">
                  <img src={config.activeImageSrc} alt="uploaded character" />
                  <div style={{ flexGrow: 1, overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {config.uploadedImageName || "custom_artwork.png"}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: primary, fontWeight: 700 }}>
                      ✓ Applied to all templates
                    </div>
                  </div>
                  <button
                    onClick={() => onCustomImageUpload(null)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: '#ef4444',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="file-upload-dropzone" onClick={triggerFileInput}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: `rgba(255, 255, 255, 0.03)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <Upload size={18} style={{ color: 'var(--text-secondary)' }} />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                      Click to upload character image
                    </span>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Supports PNG, JPG (transparent png works best!)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
