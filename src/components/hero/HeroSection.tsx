import React from 'react';
import { HeroNavigation } from './HeroNavigation';
import { HeroTypography } from './HeroTypography';
import { HeroControls } from './HeroControls';
import { HeroTimeline } from './HeroTimeline';
import { HeroCanvasBg } from './3d/HeroCanvasBg';
import { HeroCanvasFg } from './3d/HeroCanvasFg';
import { SkillsSection } from '../skills/SkillsSection';
import { ProjectsSection } from '../projects/ProjectsSection';
import { ContactSection } from '../contact/ContactSection';
import { useMouseParallax } from '../../hooks/useMouseParallax';
import { useSkillsCarousel } from '../../hooks/useSkillsCarousel';
import { useProjectsCarousel } from '../../hooks/useProjectsCarousel';
import type { PortfolioSection } from '../../hooks/useScrollChoreography';
import '../../styles/hero.css';

interface HeroSectionProps {
  scrollProgress: number;
  onNavigate: (section: PortfolioSection) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ scrollProgress, onNavigate }) => {
  const { x: mouseX, y: mouseY } = useMouseParallax(0.05);
  const skillsCarousel = useSkillsCarousel(0, scrollProgress);
  const projectsCarousel = useProjectsCarousel(0, scrollProgress);

  return (
    <section className="hero-viewport" aria-label="Ankit Sharma Portfolio — Interactive 3D Experience">
      {/* Layer 1: 3D Background Canvas (Studio lighting, background spheres, Skills Orbit & Projects Carousel) */}
      <HeroCanvasBg
        mouseX={mouseX}
        mouseY={mouseY}
        scrollProgress={scrollProgress}
        carouselOffset={skillsCarousel.offset}
        projectsCarouselOffset={projectsCarousel.offset}
        onBubbleClick={skillsCarousel.navigateTo}
        onProjectBubbleClick={projectsCarousel.navigateTo}
      />

      {/* Layer 2: Giant Display Typography (ANKIT / SHARMA + Hero Statement + CTAs) */}
      <HeroTypography
        scrollProgress={scrollProgress}
        onExplore={() => onNavigate('skills')}
        onConnect={() => {
          window.location.href = 'mailto:contact@ankitsharma.dev';
        }}
      />

      {/* Layer 3 & 4: 3D Integrated Hero Portrait Character & Foreground Wave Canvas */}
      <HeroCanvasFg mouseX={mouseX} mouseY={mouseY} scrollProgress={scrollProgress} />

      {/* Layer 5: Hero UI Overlays (Header, Location Badge, Bottom Timeline) */}
      <HeroNavigation scrollProgress={scrollProgress} onNavigate={onNavigate} />
      <HeroControls scrollProgress={scrollProgress} />
      <HeroTimeline scrollProgress={scrollProgress} onNavigate={onNavigate} />

      {/* Section 02 / SKILLS & TOOLS Overlay */}
      <SkillsSection
        carouselOffset={skillsCarousel.offset}
        activeIndex={skillsCarousel.activeIndex}
        activeItem={skillsCarousel.activeItem}
        onPrev={skillsCarousel.prev}
        onNext={skillsCarousel.next}
        onSelectIndex={skillsCarousel.navigateTo}
        onPointerDown={skillsCarousel.handlePointerDown}
        onPointerMove={skillsCarousel.handlePointerMove}
        onPointerUp={skillsCarousel.handlePointerUp}
        scrollProgress={scrollProgress}
        onNavigate={onNavigate}
      />

      {/* Section 03 / SELECTED PROJECTS Overlay */}
      <ProjectsSection
        carouselOffset={projectsCarousel.offset}
        activeIndex={projectsCarousel.activeIndex}
        activeItem={projectsCarousel.activeItem}
        onPrev={projectsCarousel.prev}
        onNext={projectsCarousel.next}
        onSelectIndex={projectsCarousel.navigateTo}
        onPointerDown={projectsCarousel.handlePointerDown}
        onPointerMove={projectsCarousel.handlePointerMove}
        onPointerUp={projectsCarousel.handlePointerUp}
        scrollProgress={scrollProgress}
        onNavigate={onNavigate}
      />

      {/* Section 06 / CONTACT Overlay */}
      <ContactSection
        scrollProgress={scrollProgress}
        onNavigate={onNavigate}
      />
    </section>
  );
};
