import React from 'react';
import type { ProjectItem } from '../../data/projects';
import '../../styles/projects.css';

import type { PortfolioSection } from '../../hooks/useScrollChoreography';

interface ProjectsSectionProps {
  carouselOffset: number;
  activeIndex: number;
  activeItem: ProjectItem;
  onPrev: () => void;
  onNext: () => void;
  onSelectIndex: (index: number) => void;
  onPointerDown: (clientX: number) => void;
  onPointerMove: (clientX: number) => void;
  onPointerUp: () => void;
  scrollProgress: number;
  onNavigate?: (section: PortfolioSection) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  carouselOffset: _carouselOffset,
  activeIndex: _activeIndex,
  activeItem,
  onPrev,
  onNext,
  onSelectIndex: _onSelectIndex,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  scrollProgress,
  onNavigate,
}) => {
  // Driven by scroll choreography (fades in past Skills, fades out approaching Contact)
  const projectsEnter = Math.max(0, Math.min(1, (scrollProgress - 2.50) / 0.20));
  const projectsExit = Math.max(0, Math.min(1, 1 - (scrollProgress - 4.15) / 0.25));
  const projectsProgress = projectsEnter * projectsExit;
  const isVisible = projectsProgress > 0.01;

  if (!isVisible) return null;

  return (
    <div
      className="projects-overlay-container"
      style={{
        opacity: projectsProgress,
        transform: `translateY(${(1 - projectsProgress) * 35}px)`,
        pointerEvents: projectsProgress > 0.5 ? 'auto' : 'none',
      }}
      aria-label={`03 Selected Projects Section — Active: ${activeItem.name} (${activeItem.number})`}
    >
      {/* Top Left Massive Editorial Display */}
      <div className="projects-left-content">
        <span className="projects-section-num">03</span>
        <h2 className="projects-title">
          <span>SELECTED</span>
          <span>PROJECTS</span>
        </h2>
        <p className="projects-subtitle">
          REAL PROJECTS.
          <br />
          REAL IMPACT.
          <br />
          BUILT WITH PURPOSE.
        </p>
      </div>

      {/* Top Right Editorial Copy */}
      <div className="projects-right-content">
        <div className="projects-statement-block">
          <span>IDEAS</span>
          <span>DESIGN</span>
          <span>DEVELOP</span>
          <span>DEPLOY</span>
        </div>
        <div className="projects-editorial-divider" />
        <p className="projects-description">
          A collection of websites, applications
          <br />
          and digital experiences I've built
          <br />
          for real people and real problems.
        </p>
      </div>

      {/* Center 3D Carousel Interactive Hitbox & Navigation Arrows */}
      <div
        className="projects-carousel-hitbox"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          onPointerDown(e.clientX);
        }}
        onPointerMove={(e) => onPointerMove(e.clientX)}
        onPointerUp={(e) => {
          try {
            e.currentTarget.releasePointerCapture(e.pointerId);
          } catch {
            // noop
          }
          onPointerUp();
        }}
        onPointerCancel={onPointerUp}
      >
        {/* Left Arrow Button */}
        <button
          type="button"
          className="projects-carousel-arrow arrow-left"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          aria-label="Previous project"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>

        {/* Right Arrow Button */}
        <button
          type="button"
          className="projects-carousel-arrow arrow-right"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          aria-label="Next project"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>

      {/* Center Bottom Project Information Area */}
      <div className="projects-info-area">
        <div className="projects-info-layout">
          <div className="projects-info-text-col">
            <span className="projects-counter">{activeItem.number}</span>
            <div className="projects-name-row">
              <h3 className="projects-name">{activeItem.name}</h3>
              <span className="projects-dash">—</span>
            </div>
            <p className="projects-desc">{activeItem.description}</p>

            {activeItem.techPills && activeItem.techPills.length > 0 && (
              <div className="projects-tech-pills">
                {activeItem.techPills.map((tech) => (
                  <span key={tech} className="projects-tech-pill">
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="projects-info-action-col">
            <a
              href={activeItem.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="projects-live-btn"
              aria-label={`Open live site for ${activeItem.name} in new tab`}
            >
              View Live Site <span className="arrow-glyph">↗</span>
            </a>
          </div>
        </div>
      </div>

      {/* Lower Left Scroll To Explore Indicator */}
      <div
        className="projects-scroll-control"
        role="button"
        tabIndex={0}
        aria-label="Scroll to explore indicator"
        onClick={() => onNavigate?.('projects')}
      >
        <div className="projects-scroll-circle">
          <span className="dot" />
        </div>
        <div className="projects-scroll-text">
          <span className="line1">SCROLL</span>
          <span className="line2">TO EXPLORE</span>
        </div>
      </div>

      {/* Lower Right Showreel Indicator */}
      <div
        className="projects-showreel-control"
        role="button"
        tabIndex={0}
        aria-label="Play showreel: A quick glimpse"
        onClick={() => alert('Showreel video coming soon!')}
      >
        <div className="projects-showreel-btn">
          <span className="projects-play-icon" />
        </div>
        <div className="projects-showreel-text">
          <span className="line1">SHOWREEL</span>
          <span className="line2">A QUICK GLIMPSE</span>
        </div>
      </div>

      {/* Bottom Timeline for Projects Section */}
      <footer className="projects-bottom-bar" aria-label="Projects Navigation Footer">
        <div className="projects-timeline-track">
          <div className="projects-timeline-line">
            {/* Active dot positioned over 03 PROJECTS */}
            <span className="projects-timeline-active-dot" />
          </div>
          <div className="projects-timeline-labels-row">
            <div className="projects-timeline-labels">
              <div
                className="projects-timeline-item"
                role="link"
                tabIndex={0}
                onClick={() => onNavigate?.('hero')}
              >
                <span className="num">01</span>
                <span className="name">HOME</span>
              </div>
              <div
                className="projects-timeline-item"
                role="link"
                tabIndex={0}
                onClick={() => onNavigate?.('skills')}
              >
                <span className="num">02</span>
                <span className="name">SKILLS</span>
              </div>
              <div className="projects-timeline-item active">
                <span className="num">03</span>
                <span className="name">PROJECTS</span>
              </div>
              <div className="projects-timeline-item">
                <span className="num">04</span>
                <span className="name">EXPERIENCE</span>
              </div>
              <div className="projects-timeline-item">
                <span className="num">05</span>
                <span className="name">CREATIVE</span>
              </div>
              <div
                className="projects-timeline-item"
                role="link"
                tabIndex={0}
                onClick={() => onNavigate?.('contact')}
              >
                <span className="num">06</span>
                <span className="name">CONTACT</span>
              </div>
            </div>

            <div className="projects-more-ahead">
              <span>MORE PROJECTS AHEAD</span>
              <span>↓</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
