import { useState, useEffect, useRef } from 'react';

export interface MouseParallaxState {
  x: number; // -1 to 1
  y: number; // -1 to 1
  targetX: number;
  targetY: number;
}

export function useMouseParallax(damping = 0.05) {
  const [coords, setCoords] = useState<MouseParallaxState>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  const stateRef = useRef({
    currentX: 0,
    currentY: 0,
    targetX: 0,
    targetY: 0,
  });

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth) * 2 - 1;
      const y = -(e.clientY / innerHeight) * 2 + 1;
      stateRef.current.targetX = x;
      stateRef.current.targetY = y;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let animId: number;
    const update = () => {
      const s = stateRef.current;
      s.currentX += (s.targetX - s.currentX) * damping;
      s.currentY += (s.targetY - s.currentY) * damping;

      setCoords({
        x: s.currentX,
        y: s.currentY,
        targetX: s.targetX,
        targetY: s.targetY,
      });

      animId = requestAnimationFrame(update);
    };

    animId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [damping]);

  return coords;
}
