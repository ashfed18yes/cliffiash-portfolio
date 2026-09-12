import React from 'react';

interface HeroControlsProps {
  scrollProgress?: number;
}

export const HeroControls: React.FC<HeroControlsProps> = ({ scrollProgress = 0 }) => {
  const opacity = Math.max(0, Math.min(1, 1 - scrollProgress * 2.5));

  return (
    <aside
      className="hero-location-layer"
      aria-label="Location Information"
      style={{
        opacity,
        transform: `translateY(${-scrollProgress * 40}px)`,
        pointerEvents: opacity < 0.2 ? 'none' : 'auto',
        transition: 'opacity 0.15s ease-out',
      }}
    >
      <div className="hero-status-circle">
        <span className="hero-status-dot" />
      </div>
      <div className="hero-location-info">
        <span className="hero-location-label">BASED IN</span>
        <span className="hero-location-value">JAIPUR, INDIA</span>
      </div>
    </aside>
  );
};
