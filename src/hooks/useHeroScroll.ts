import { useState, useEffect } from 'react';

export interface HeroScrollState {
  progress: number; // 0 to 1
  isScrolling: boolean;
}

export function useHeroScroll() {
  const [scrollState, setScrollState] = useState<HeroScrollState>({
    progress: 0,
    isScrolling: false,
  });

  useEffect(() => {
    let timeoutId: number;

    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const vh = window.innerHeight || 800;
      // Normalized progress over the first viewport
      const progress = Math.min(Math.max(scrollY / vh, 0), 1);

      setScrollState({
        progress,
        isScrolling: true,
      });

      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        setScrollState((prev) => ({ ...prev, isScrolling: false }));
      }, 150);
    };

    // Wheel listener for touchpads / mousewheels to allow smooth transition preview
    const handleWheel = (e: WheelEvent) => {
      if (window.scrollY === 0 && e.deltaY > 0) {
        // Prepare subtle reactivity even on initial hero state
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
      window.clearTimeout(timeoutId);
    };
  }, []);

  return scrollState;
}
