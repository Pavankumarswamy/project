import React, { useState, useRef } from 'react';
import { X, Sparkles, Sliders, Palette, Upload } from 'lucide-react';

export default function CustomThemeCreator({ onClose, onSaveTheme }) {
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [pattern, setPattern] = useState('stripes');
  
  // Default creative color set for new custom themes
  const [primaryColor, setPrimaryColor] = useState('#a855f7'); // Purple
  const [secondaryColor, setSecondaryColor] = useState('#3b82f6'); // Blue
  const [accentColor, setAccentColor] = useState('#facc15'); // Yellow
  const [textColor, setTextColor] = useState('#ffffff'); // White

  const [imageUrl, setImageUrl] = useState('');
  const [imageName, setImageName] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target.result);
        setImageName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter a theme name");
      return;
    }

    const newTheme = {
      id: Date.now(), // Generate unique ID
      name: name.trim(),
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      primaryColor,
      secondaryColor,
      accentColor,
      textColor,
      pattern,
      image: imageUrl || 'themes/ben10.svg', // Fallback to Ben 10 if none uploaded
      tagline: tagline.trim() || 'Create customized party magic for your celebration!'
    };

    onSaveTheme(newTheme);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '680px', gridTemplateColumns: '1fr' }}>
        <div style={{ position: 'relative', padding: '32px' }}>
          
          {/* Close button */}
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>

          {/* Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Palette size={20} style={{ color: 'var(--primary)' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--primary)', textTransform: 'uppercase' }}>
              Creative Workshop
            </span>
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '24px' }}>
            Create Custom Birthday Theme
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Grid for Name & Tagline */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-control">
                <label htmlFor="custom-theme-name">Theme Name</label>
                <input
                  id="custom-theme-name"
                  type="text"
                  placeholder="e.g. Space Explorer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-control">
                <label htmlFor="custom-theme-tagline">Theme Tagline</label>
                <input
                  id="custom-theme-tagline"
                  type="text"
                  placeholder="e.g. Blast off into space adventures!"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            {/* Pattern & Upload Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
              {/* Image Upload */}
              <div className="form-control">
                <label>Theme Character / Icon (Transparent PNG recommended)</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                {imageUrl ? (
                  <div className="file-upload-preview" style={{ background: 'rgba(255,255,255,0.02)', padding: '8px 12px' }}>
                    <img src={imageUrl} alt="uploaded mascot" style={{ width: '40px', height: '40px', background: '#ffffff', borderRadius: '4px' }} />
                    <div style={{ flexGrow: 1, overflow: 'hidden' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {imageName}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setImageUrl(''); setImageName(''); }}
                      style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div className="file-upload-dropzone" onClick={triggerFileInput} style={{ padding: '16px' }}>
                    <Upload size={16} style={{ color: 'var(--text-secondary)' }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Click to upload file</span>
                  </div>
                )}
              </div>

              {/* Background Pattern */}
              <div className="form-control">
                <label htmlFor="custom-theme-pattern">Background Pattern</label>
                <select
                  id="custom-theme-pattern"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  className="form-input"
                  style={{ background: 'rgba(3, 7, 18, 0.4)', color: '#ffffff' }}
                >
                  <option value="stripes">Diagonal Stripes</option>
                  <option value="dots">Polka Dots</option>
                  <option value="stars">Star Confetti</option>
                  <option value="confetti">Mixed Confetti</option>
                </select>
              </div>
            </div>

            {/* Color Palette customization */}
            <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sliders size={14} /> Color Palette Selection
              </h4>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                <div className="color-picker-group">
                  <div className="color-input-wrapper">
                    <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Primary</span>
                </div>

                <div className="color-picker-group">
                  <div className="color-input-wrapper">
                    <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Secondary</span>
                </div>

                <div className="color-picker-group">
                  <div className="color-input-wrapper">
                    <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Accent</span>
                </div>

                <div className="color-picker-group">
                  <div className="color-input-wrapper">
                    <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Text/Outline</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
                style={{ padding: '12px 24px' }}
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  padding: '12px 28px',
                  background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                  boxShadow: `0 4px 14px ${primaryColor}44`
                }}
              >
                <Sparkles size={16} />
                Generate Custom Theme
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}
