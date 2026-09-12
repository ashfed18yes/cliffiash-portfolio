import React, { useEffect, useRef, useState } from 'react';
import '../../styles/cursor.css';

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const hasMoved = useRef(false);

  const [isHovered, setIsHovered] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const isHoveredRef = useRef(false);
  const isMouseDownRef = useRef(false);

  useEffect(() => {
    // Disable custom cursor on touch/mobile devices
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    let animFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      if (!hasMoved.current) {
        hasMoved.current = true;
        ringPos.current = { x: e.clientX, y: e.clientY };
        setIsVisible(true);
      }

      // Detect if user is hovering over an interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactiveEl = target.closest(
          'a, button, input, select, textarea, [role="button"], .interactive, .contact-social-item, .hero-nav-item, .carousel-arrow, .project-card, .skill-node'
        );
        const hovered = !!interactiveEl;
        if (hovered !== isHoveredRef.current) {
          isHoveredRef.current = hovered;
          setIsHovered(hovered);
        }
      }
    };

    const handleMouseDown = () => {
      isMouseDownRef.current = true;
      setIsMouseDown(true);
    };

    const handleMouseUp = () => {
      isMouseDownRef.current = false;
      setIsMouseDown(false);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => {
      if (hasMoved.current) setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const render = () => {
      if (hasMoved.current) {
        // Trailing lerp delay for outer ring
        ringPos.current.x = lerp(ringPos.current.x, mousePos.current.x, 0.2);
        ringPos.current.y = lerp(ringPos.current.y, mousePos.current.y, 0.2);

        const isPressed = isMouseDownRef.current;
        const isHover = isHoveredRef.current;

        const ringScale = isPressed ? 0.85 : 1;
        const dotScale = isPressed ? 0.7 : (isHover ? 1.5 : 1);

        if (dotRef.current) {
          dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) scale(${dotScale})`;
        }

        if (ringRef.current) {
          ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) scale(${ringScale})`;
        }
      }

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <div className="custom-cursor-container" style={{ opacity: isVisible ? 1 : 0 }}>
      {/* Outer trailing circle ring */}
      <div
        ref={ringRef}
        className={`cursor-ring ${isHovered ? 'is-hovered' : ''} ${isMouseDown ? 'is-clicked' : ''}`}
      />
      {/* Inner precise dot */}
      <div
        ref={dotRef}
        className={`cursor-dot ${isHovered ? 'is-hovered' : ''} ${isMouseDown ? 'is-clicked' : ''}`}
      />
    </div>
  );
};
