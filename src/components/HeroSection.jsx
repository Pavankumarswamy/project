import React, { useEffect, useState } from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';

export default function HeroSection({ selectedTheme, onScrollToThemes }) {
  const [confetti, setConfetti] = useState([]);

  // Generate randomized confetti elements for the hero background
  useEffect(() => {
    const colors = [selectedTheme.primaryColor, selectedTheme.secondaryColor, selectedTheme.accentColor, '#f472b6', '#38bdf8', '#ffffff'];
    const items = [...Array(24)].map((_, i) => ({
      id: i,
      color: colors[i % colors.length],
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${3 + Math.random() * 4}s`,
      size: `${6 + Math.random() * 12}px`
    }));
    setConfetti(items);
  }, [selectedTheme]);

  return (
    <header style={{
      position: 'relative',
      padding: '120px 0 100px 0',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderBottom: '1px solid rgba(255, 255, 255, 0.03)'
    }}>
      {/* Floating Confetti Layer */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
        {confetti.map(c => (
          <div
            key={c.id}
            className="confetti-piece"
            style={{
              left: c.left,
              animationDelay: c.delay,
              animationDuration: c.duration,
              backgroundColor: c.color,
              width: c.size,
              height: `calc(${c.size} * 1.5)`
            }}
          />
        ))}
      </div>

      {/* Decorative Orbs */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '400px',
        height: '400px',
        background: `radial-gradient(circle, ${selectedTheme.primaryColor}15 0%, transparent 70%)`,
        filter: 'blur(50px)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '10%',
        width: '500px',
        height: '500px',
        background: `radial-gradient(circle, ${selectedTheme.secondaryColor}11 0%, transparent 70%)`,
        filter: 'blur(60px)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        {/* Floating Tag */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '8px 18px',
          borderRadius: '9999px',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: selectedTheme.primaryColor,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          marginBottom: '24px',
          animation: 'float 3s ease-in-out infinite'
        }}>
          <Sparkles size={14} />
          <span>Interactive Designing Workshop</span>
        </div>

        {/* Hero Title */}
        <h1 style={{
          fontSize: '4.5rem',
          lineHeight: '1.05',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          maxWidth: '900px',
          margin: '0 auto 24px auto',
          fontFamily: 'var(--font-heading)'
        }}>
          Dynamic Supplies for Your Custom <span className="gradient-text">Birthday Themes</span>
        </h1>

        {/* Hero Description */}
        <p style={{
          fontSize: '1.25rem',
          color: 'var(--text-secondary)',
          maxWidth: '650px',
          margin: '0 auto 40px auto',
          lineHeight: '1.6',
          fontWeight: 400
        }}>
          Upload a single character image, pick your colors, and watch 20+ birthday items (bags, wraps, hats, and plates) programmatically render custom mockups instantly!
        </p>

        {/* Buttons */}
        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={onScrollToThemes}
            className="btn btn-primary"
            style={{
              padding: '16px 36px',
              fontSize: '1.05rem',
              borderRadius: '20px',
              background: `linear-gradient(135deg, ${selectedTheme.primaryColor} 0%, ${selectedTheme.secondaryColor} 100%)`,
              boxShadow: `0 8px 30px ${selectedTheme.primaryColor}44`,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            Browse Popular Themes
            <ArrowDown size={18} />
          </button>
          
          <a
            href="#supplies-grid"
            className="btn btn-secondary"
            style={{
              padding: '16px 36px',
              fontSize: '1.05rem',
              borderRadius: '20px'
            }}
          >
            View Live Previews
          </a>
        </div>

        {/* Trust/Feature Bullet Badges */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '40px',
          marginTop: '80px',
          flexWrap: 'wrap',
          color: 'var(--text-secondary)',
          fontSize: '0.9rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: selectedTheme.primaryColor, fontWeight: 800 }}>✓</span>
            <span>100% Vector Templates</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: selectedTheme.primaryColor, fontWeight: 800 }}>✓</span>
            <span>Programmatic Auto-Alignment</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: selectedTheme.primaryColor, fontWeight: 800 }}>✓</span>
            <span>Instant High-Res Exports</span>
          </div>
        </div>
      </div>
    </header>
  );
}
