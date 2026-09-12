import { useState, useEffect } from 'react';
import Lenis from 'lenis';

export type PortfolioSection = 'hero' | 'skills' | 'projects' | 'contact';

export interface ChoreographyState {
  progress: number; // 0 (Hero) to 1 (Skills) to 2 (Projects) to 3 (Contact)
  currentSection: PortfolioSection;
  scrollY: number;
}

export function useScrollChoreography() {
  const [state, setState] = useState<ChoreographyState>({
    progress: 0,
    currentSection: 'hero',
    scrollY: 0,
  });

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    const onScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const vh = window.innerHeight || 800;

      // 4 sections: Hero (0), Skills (1), Projects (2), Contact (3)
      const progress = Math.max(0, scrollY / vh);

      let currentSection: PortfolioSection = 'hero';
      if (progress >= 0.75 && progress < 2.65) {
        currentSection = 'skills';
      } else if (progress >= 2.65 && progress < 4.25) {
        currentSection = 'projects';
      } else if (progress >= 4.25) {
        currentSection = 'contact';
      }

      setState({
        progress,
        currentSection,
        scrollY,
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Call initial
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const scrollToSection = (section: PortfolioSection) => {
    const vh = window.innerHeight || 800;
    let targetY = 0;
    if (section === 'skills') {
      targetY = vh * 0.85;
    } else if (section === 'projects') {
      targetY = vh * 2.75;
    } else if (section === 'contact') {
      targetY = vh * 4.35;
    } else if (section === 'hero') {
      targetY = 0;
    }

    window.scrollTo({
      top: targetY,
      behavior: 'smooth',
    });
  };

  return {
    ...state,
    scrollToSection,
  };
}
