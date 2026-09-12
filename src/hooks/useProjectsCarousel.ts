import { useState, useEffect, useRef, useCallback } from 'react';
import { PROJECT_ITEMS } from '../data/projects';
import type { ProjectItem } from '../data/projects';

export function useProjectsCarousel(initialIndex = 0, scrollProgress = 0) {
  const [offset, setOffset] = useState(initialIndex);
  const totalItems = PROJECT_ITEMS.length;

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

  // === SCROLL-DRIVEN ORBIT (mirrors Skills exact behavior) ===
  // Projects active scroll range: 2.65 to 4.15
  useEffect(() => {
    const s = stateRef.current;
    if (s.isDragging) return;

    const timeSinceInteraction = performance.now() - s.userInteractedTime;
    const isScrolling = Math.abs(scrollProgress - s.lastScrollProgress) > 0.001;
    s.lastScrollProgress = scrollProgress;

    if (scrollProgress >= 2.65 && scrollProgress <= 4.15) {
      if (isScrolling || timeSinceInteraction > 1200) {
        // Map 2.65..4.15 to 0..totalItems-1
        const projectsProgress = Math.max(0, Math.min(1, (scrollProgress - 2.65) / 1.50));
        const scrollTarget = projectsProgress * (totalItems - 1);
        s.targetOffset = Math.max(0, Math.min(totalItems - 1, scrollTarget));
      }
    }
  }, [scrollProgress, totalItems]);

  const syncScrollToProject = useCallback((projectIndex: number) => {
    if (typeof window === 'undefined') return;
    const vh = window.innerHeight || 800;
    // Map projectIndex (0..totalItems-1) back to scroll position in Projects range (2.65..4.15)
    const targetProgress = 2.65 + (projectIndex / (totalItems - 1)) * 1.50;
    const targetY = targetProgress * vh;
    window.scrollTo({
      top: targetY,
      behavior: 'smooth',
    });
  }, [totalItems]);

  const navigateTo = useCallback(
    (targetIndex: number) => {
      const normalized = ((targetIndex % totalItems) + totalItems) % totalItems;
      stateRef.current.userInteractedTime = performance.now();
      stateRef.current.targetOffset = normalized;
      syncScrollToProject(normalized);
    },
    [totalItems, syncScrollToProject]
  );

  const prev = useCallback(() => {
    const current = Math.round(stateRef.current.targetOffset);
    const target = Math.max(0, current - 1);
    stateRef.current.userInteractedTime = performance.now();
    stateRef.current.targetOffset = target;
    syncScrollToProject(target);
  }, [syncScrollToProject]);

  const next = useCallback(() => {
    const current = Math.round(stateRef.current.targetOffset);
    const target = Math.min(totalItems - 1, current + 1);
    stateRef.current.userInteractedTime = performance.now();
    stateRef.current.targetOffset = target;
    syncScrollToProject(target);
  }, [totalItems, syncScrollToProject]);

  // Pointer Drag Handlers (Mouse & Touch)
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
      // ~180px per project step
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
    syncScrollToProject(clamped);
  }, [totalItems, syncScrollToProject]);

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

  // Smooth spring damping loop
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
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [totalItems]);

  const activeIndex = Math.round(Math.max(0, Math.min(totalItems - 1, offset)));
  const activeItem = PROJECT_ITEMS[activeIndex] || PROJECT_ITEMS[0];

  return {
    activeIndex,
    offset,
    prev,
    next,
    navigateTo,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    activeItem: activeItem as ProjectItem,
  };
}
