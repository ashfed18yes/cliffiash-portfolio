import React from 'react';
import { SKILL_ITEMS } from '../../data/skills';
import type { SkillItem } from '../../data/skills';
import '../../styles/skills.css';

import type { PortfolioSection } from '../../hooks/useScrollChoreography';

interface SkillsSectionProps {
  carouselOffset: number;
  activeIndex: number;
  activeItem: SkillItem;
  onPrev: () => void;
  onNext: () => void;
  onSelectIndex: (index: number) => void;
  onPointerDown: (clientX: number) => void;
  onPointerMove: (clientX: number) => void;
  onPointerUp: () => void;
  scrollProgress: number;
  onNavigate?: (section: PortfolioSection) => void;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  carouselOffset: _carouselOffset,
  activeIndex,
  activeItem,
  onPrev,
  onNext,
  onSelectIndex,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  scrollProgress,
  onNavigate,
}) => {
  // Skills opacity and transform driven by scroll progress in dedicated timeline (0.65 to 2.60)
  const skillsEnter = Math.max(0, Math.min(1, (scrollProgress - 0.55) / 0.25));
  const skillsExit = Math.max(0, Math.min(1, 1 - (scrollProgress - 2.45) / 0.20));
  const skillsProgress = skillsEnter * skillsExit;
  const isVisible = skillsProgress > 0.01;

  if (!isVisible) return null;

  return (
    <div
      className="skills-overlay-container"
      style={{
        opacity: skillsProgress,
        transform: `translateY(${(1 - skillsProgress) * 40}px)`,
        pointerEvents: skillsProgress > 0.5 ? 'auto' : 'none',
      }}
      aria-label={`02 Skills and Tools Section — Active: ${activeItem.name} (${activeIndex + 1} of ${SKILL_ITEMS.length})`}
      data-active-category={activeItem.category}
    >
      {/* Top Center Section Indicator */}
      <div className="skills-top-badge" aria-hidden="true">
        <span className="skills-badge-dot">•</span>
        <span className="skills-badge-text">02 / SKILLS</span>
      </div>

      {/* Left Column: Massive Editorial Display Typography */}
      <div className="skills-left-content">
        <span className="skills-section-num">02</span>
        <h2 className="skills-title">
          <span>SKILLS</span>
          <span>&amp; TOOLS</span>
        </h2>
        <p className="skills-subtitle">
          TECHNOLOGIES I WORK WITH
          <br />
          TO TURN IDEAS INTO REALITY.
        </p>
      </div>

      {/* Right Column: Statement and Description */}
      <div className="skills-right-content">
        <div className="skills-statement-block">
          <span>DIFFERENT TOOLS.</span>
          <span>SAME PURPOSE.</span>
          <span>BUILDING IDEAS.</span>
        </div>
        <p className="skills-description">
          From code to design, from automation
          <br />
          to content — these are the tools I use
          <br />
          to bring ideas to life.
        </p>
      </div>

      {/* Center 3D Carousel Interactive Controls & Gesture Layer */}
      <div
        className="skills-carousel-hitbox"
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
          className="skills-carousel-arrow arrow-left"
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          aria-label="Previous skill"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>

        {/* Right Arrow Button */}
        <button
          type="button"
          className="skills-carousel-arrow arrow-right"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          aria-label="Next skill"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>

      {/* Active Category Technology Tags & Discrete Navigation Dots (Centered below 3D orbit) */}
      <div className="skills-tech-tags-container" aria-label={`Technologies for ${activeItem.category}`}>
        <div className="skills-active-category-label">
          <span className="skills-category-num">0{activeIndex + 1} / 0{SKILL_ITEMS.length}</span>
          <span className="skills-category-divider">—</span>
          <span className="skills-category-name">{activeItem.category}</span>
        </div>
        <div className="skills-tech-pills">
          {activeItem.subSkills.map((tech) => (
            <span key={tech} className="skills-tech-pill">
              {tech}
            </span>
          ))}
        </div>
        <div className="skills-orbit-dots" aria-label="Skill category pagination">
          {SKILL_ITEMS.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              className={`skills-orbit-dot ${idx === activeIndex ? 'active' : ''}`}
              onClick={() => onSelectIndex(idx)}
              aria-label={`Jump to skill ${idx + 1}: ${item.name}`}
            />
          ))}
        </div>
      </div>

      {/* Floating Bottom Right Badge: Full Stack Developer — Always Learning */}
      <div className="skills-floating-pill" role="status" aria-label="Role indicator: Full Stack Developer, Always Learning">
        <div className="skills-pill-iris">
          <div className="skills-iris-center" />
        </div>
        <div className="skills-pill-meta">
          <span className="skills-pill-title">FULL STACK DEVELOPER</span>
          <span className="skills-pill-subtitle">
            ALWAYS LEARNING <span className="arrow-glyph">↗</span>
          </span>
        </div>
      </div>

      {/* Bottom Timeline for Skills Section */}
      <footer className="skills-bottom-bar" aria-label="Skills Navigation Footer">
        <div className="skills-timeline-track">
          <div className="skills-timeline-line">
            {/* Active dot positioned over 02 SKILLS */}
            <span className="skills-timeline-active-dot" />
          </div>
          <div className="skills-timeline-labels">
            <div
              className="skills-timeline-item"
              role="link"
              tabIndex={0}
              onClick={() => onNavigate?.('hero')}
            >
              <span className="num">01</span>
              <span className="name">HOME</span>
            </div>
            <div className="skills-timeline-item active">
              <span className="num">02</span>
              <span className="name">SKILLS</span>
            </div>
            <div
              className="skills-timeline-item"
              role="link"
              tabIndex={0}
              onClick={() => onNavigate?.('projects')}
            >
              <span className="num">03</span>
              <span className="name">PROJECTS</span>
            </div>
            <div className="skills-timeline-item">
              <span className="num">04</span>
              <span className="name">EXPERIENCE</span>
            </div>
            <div className="skills-timeline-item">
              <span className="num">05</span>
              <span className="name">CREATIVE</span>
            </div>
            <div
              className="skills-timeline-item"
              role="link"
              tabIndex={0}
              onClick={() => onNavigate?.('contact')}
            >
              <span className="num">06</span>
              <span className="name">CONTACT</span>
            </div>
          </div>
        </div>

        {/* Right Scroll To Explore Pill */}
        <div className="skills-scroll-explore" aria-label="Scroll to explore">
          <span className="skills-explore-bar" />
          <span className="skills-explore-text">SCROLL TO EXPLORE</span>
        </div>
      </footer>
    </div>
  );
};
