import { useState, useEffect, useRef, useCallback } from 'react';
import { SKILL_ITEMS } from '../data/skills';

export interface CarouselState {
  activeIndex: number;
  offset: number; // continuously interpolated offset (float 0..total-1)
  targetOffset: number;
  isDragging: boolean;
}

export function useSkillsCarousel(initialIndex = 0, scrollProgress = 0) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [offset, setOffset] = useState(initialIndex);

  const totalItems = SKILL_ITEMS.length;

  const stateRef = useRef({
    currentOffset: initialIndex,
    targetOffset: initialIndex,
    isDragging: false,
    startX: 0,
    startOffset: initialIndex,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
    lastScrollProgress: scrollProgress,
    userInteractedTime: 0,
  });

  // Calculate target offset from scroll progress when user is scrolling inside Skills range
  // Skills active range: 0.85 to 2.45
  useEffect(() => {
    const s = stateRef.current;
    if (s.isDragging) return;

    // Check if user recently dragged/clicked arrow (allow 1s grace period before scroll takes over)
    const timeSinceInteraction = performance.now() - s.userInteractedTime;
    const isScrolling = Math.abs(scrollProgress - s.lastScrollProgress) > 0.001;
    s.lastScrollProgress = scrollProgress;

    if (scrollProgress >= 0.75 && scrollProgress <= 2.65) {
      if (isScrolling || timeSinceInteraction > 1200) {
        const skillsProgress = Math.max(0, Math.min(1, (scrollProgress - 0.85) / 1.70));
        const scrollTarget = skillsProgress * (totalItems - 1);
        s.targetOffset = Math.max(0, Math.min(totalItems - 1, scrollTarget));
      }
    }
  }, [scrollProgress, totalItems]);

  const syncScrollToCategory = useCallback((categoryIndex: number) => {
    if (typeof window === 'undefined') return;
    const vh = window.innerHeight || 800;
    // Map categoryIndex (0..8) back to scroll position in Skills range (0.85..2.55)
    const targetProgress = 0.85 + (categoryIndex / (totalItems - 1)) * 1.70;
    const targetY = targetProgress * vh;
    window.scrollTo({
      top: targetY,
      behavior: 'smooth',
    });
  }, [totalItems]);

  const navigateTo = useCallback(
    (newIndex: number) => {
      const clamped = Math.max(0, Math.min(totalItems - 1, newIndex));
      stateRef.current.userInteractedTime = performance.now();
      stateRef.current.targetOffset = clamped;
      syncScrollToCategory(clamped);
    },
    [totalItems, syncScrollToCategory]
  );

  const prev = useCallback(() => {
    const target = Math.max(0, stateRef.current.targetOffset - 1);
    stateRef.current.userInteractedTime = performance.now();
    stateRef.current.targetOffset = target;
    syncScrollToCategory(target);
  }, [syncScrollToCategory]);

  const next = useCallback(() => {
    const target = Math.min(totalItems - 1, stateRef.current.targetOffset + 1);
    stateRef.current.userInteractedTime = performance.now();
    stateRef.current.targetOffset = target;
    syncScrollToCategory(target);
  }, [totalItems, syncScrollToCategory]);

  // Pointer Drag Handlers (Desktop Mouse Drag & Mobile Touch Swipe)
  const handlePointerDown = useCallback((clientX: number) => {
    stateRef.current.isDragging = true;
    stateRef.current.startX = clientX;
    stateRef.current.startOffset = stateRef.current.currentOffset;
    stateRef.current.lastX = clientX;
    stateRef.current.lastTime = performance.now();
    stateRef.current.velocity = 0;
    stateRef.current.userInteractedTime = performance.now();
  }, []);

  const handlePointerMove = useCallback(
    (clientX: number) => {
      if (!stateRef.current.isDragging) return;
      const now = performance.now();
      const dt = Math.max(1, now - stateRef.current.lastTime);
      const dx = clientX - stateRef.current.lastX;

      stateRef.current.velocity = dx / dt;
      stateRef.current.lastX = clientX;
      stateRef.current.lastTime = now;
      stateRef.current.userInteractedTime = now;

      const totalDx = clientX - stateRef.current.startX;
      // Sensitivity: approx 180px drag per category
      const sensitivity = 0.0055;
      const proposed = stateRef.current.startOffset - totalDx * sensitivity;
      stateRef.current.currentOffset = Math.max(-0.4, Math.min(totalItems - 0.6, proposed));
      stateRef.current.targetOffset = Math.round(stateRef.current.currentOffset);
    },
    [totalItems]
  );

  const handlePointerUp = useCallback(() => {
    if (!stateRef.current.isDragging) return;
    stateRef.current.isDragging = false;
    stateRef.current.userInteractedTime = performance.now();

    // Apply gentle inertia
    const inertia = -stateRef.current.velocity * 35;
    const projected = stateRef.current.currentOffset + inertia;
    const snapped = Math.round(projected);
    const clamped = Math.max(0, Math.min(totalItems - 1, snapped));

    stateRef.current.targetOffset = clamped;
    syncScrollToCategory(clamped);
  }, [totalItems, syncScrollToCategory]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prev();
      } else if (e.key === 'ArrowRight') {
        next();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prev, next]);

  // Animation frame loop for buttery-smooth continuous spring motion
  useEffect(() => {
    let animId: number;

    const tick = () => {
      const s = stateRef.current;
      if (!s.isDragging) {
        const diff = s.targetOffset - s.currentOffset;
        s.currentOffset += diff * 0.14;

        if (Math.abs(diff) < 0.0005) {
          s.currentOffset = s.targetOffset;
        }
      }

      setOffset(s.currentOffset);
      const roundedIndex = Math.round(Math.max(0, Math.min(totalItems - 1, s.currentOffset)));
      setActiveIndex(roundedIndex);

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [totalItems]);

  return {
    offset,
    activeIndex,
    activeItem: SKILL_ITEMS[activeIndex] || SKILL_ITEMS[0],
    prev,
    next,
    navigateTo,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
