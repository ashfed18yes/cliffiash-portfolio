import React from 'react';

interface HeroTypographyProps {
  onExplore?: () => void;
  onConnect?: () => void;
  scrollProgress?: number;
}

export const HeroTypography: React.FC<HeroTypographyProps> = ({
  onExplore,
  onConnect,
  scrollProgress = 0,
}) => {
  // During Hero -> Skills transition, typography moves upward and fades out
  const opacity = Math.max(0, Math.min(1, 1 - scrollProgress * 2.4));
  const translateY = -scrollProgress * 130;
  const isPointerActive = opacity > 0.2;

  return (
    <>
      {/* Editorial Role Label above name (z-index: 10) */}
      <div
        className="hero-intro-label"
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          pointerEvents: isPointerActive ? 'auto' : 'none',
        }}
      >
        <span>COMPUTER SCIENCE STUDENT</span>
        <span>•</span>
        <span>DEVELOPER</span>
        <span>•</span>
        <span>CREATIVE BUILDER</span>
      </div>

      {/* Main Massive Display Typography (z-index: 2 - in front of bg canvas, behind portrait) */}
      <div
        className="hero-name-layer"
        aria-label="Ankit Sharma"
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
        }}
      >
        <h1 className="hero-name-row-1">ANKIT</h1>
        <h1 className="hero-name-row-2">SHARMA</h1>
      </div>

      {/* Personal Statement (Right side, z-index: 10) */}
      <div
        className="hero-statement-layer"
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          pointerEvents: isPointerActive ? 'auto' : 'none',
        }}
      >
        <div className="hero-statement-text">
          <span>I don’t just</span>
          <span>write code.</span>
          <span>I build things.</span>
        </div>
        <div className="hero-statement-tags">
          SOFTWARE / WEB / CREATIVE / AUTOMATION
        </div>
      </div>

      {/* CTA Buttons (Right side, z-index: 10) */}
      <div
        className="hero-cta-layer"
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          pointerEvents: isPointerActive ? 'auto' : 'none',
        }}
      >
        <a
          href="#skills"
          className="hero-btn-primary"
          onClick={(e) => {
            e.preventDefault();
            onExplore?.();
          }}
          aria-label="Explore my work — scroll to skills section"
        >
          <span>EXPLORE MY WORK</span>
          <span className="btn-arrow">↗</span>
        </a>
        <a
          href="#contact"
          className="hero-btn-secondary"
          onClick={(e) => {
            e.preventDefault();
            onConnect?.();
          }}
          aria-label="Let's connect"
        >
          <span>LET'S CONNECT</span>
          <span className="btn-arrow">↗</span>
        </a>
      </div>
    </>
  );
};
