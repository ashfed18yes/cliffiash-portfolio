import React from 'react';
import type { PortfolioSection } from '../../hooks/useScrollChoreography';

interface HeroTimelineProps {
  scrollProgress?: number;
  onNavigate?: (section: PortfolioSection) => void;
}

export const HeroTimeline: React.FC<HeroTimelineProps> = ({ scrollProgress = 0, onNavigate }) => {
  const opacity = Math.max(0, Math.min(1, 1 - scrollProgress * 2.5));

  const sections = [
    { num: '01', name: 'HOME', active: true, key: 'hero' as const },
    { num: '02', name: 'SKILLS', active: false, key: 'skills' as const },
    { num: '03', name: 'PROJECTS', active: false, key: 'projects' as const },
    { num: '04', name: 'EXPERIENCE', active: false, key: 'projects' as const },
    { num: '05', name: 'CREATIVE', active: false, key: 'projects' as const },
    { num: '06', name: 'CONTACT', active: false, key: 'contact' as const },
  ];

  return (
    <footer
      className="hero-bottom-bar"
      aria-label="Hero Navigation Footer"
      style={{
        opacity,
        transform: `translateY(${scrollProgress * 40}px)`,
        pointerEvents: opacity < 0.2 ? 'none' : 'auto',
        transition: 'opacity 0.15s ease-out',
      }}
    >
      <div className="hero-bottom-controls-row">
        {/* Scroll To Explore Indicator */}
        <div
          className="hero-scroll-control"
          aria-label="Scroll to explore indicator"
          onClick={() => onNavigate?.('skills')}
          style={{ cursor: 'pointer' }}
        >
          <div className="hero-scroll-circle">
            <span className="dot" />
          </div>
          <div className="hero-scroll-text">
            <span className="line1">SCROLL</span>
            <span className="line2">TO EXPLORE</span>
          </div>
        </div>

        {/* Showreel Interactive Control */}
        <div
          className="hero-showreel-control"
          role="button"
          tabIndex={0}
          aria-label="Play showreel"
          onClick={() => alert('Showreel video coming soon!')}
        >
          <div className="hero-showreel-btn">
            <span className="hero-play-icon" />
          </div>
          <div className="hero-showreel-text">
            <span className="line1">SHOWREEL</span>
            <span className="line2">A QUICK GLIMPSE</span>
          </div>
        </div>
      </div>

      {/* Horizontal Section Indicator Line */}
      <div className="hero-timeline-track-wrap">
        <div className="hero-timeline-line">
          <span className="hero-timeline-active-dot" />
        </div>
        <div className="hero-timeline-labels-row">
          <div className="hero-timeline-sections">
            {sections.map((sec) => (
              <div
                key={sec.num}
                className={`hero-timeline-item ${sec.active ? 'active' : ''}`}
                tabIndex={0}
                role="link"
                aria-label={`Go to section ${sec.num} ${sec.name}`}
                onClick={() => onNavigate?.(sec.key)}
              >
                <span className="num">{sec.num}</span>
                <span className="name">{sec.name}</span>
              </div>
            ))}
          </div>

          <div className="hero-workflow-steps">
            IDEAS &nbsp;→&nbsp; DESIGN &nbsp;→&nbsp; DEVELOP &nbsp;→&nbsp; DEPLOY
          </div>
        </div>
      </div>
    </footer>
  );
};
