'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export function CustomCursor() {
  const cursorDot = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
  const ringX = useSpring(mouseX, springConfig);
  const ringY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Detect touch devices — hide custom cursor on mobile
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsMobile(isTouchDevice);
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseEnter = () => setIsHidden(false);
    const handleMouseLeave = () => setIsHidden(true);

    // Track hoverable elements
    const addHoverListeners = () => {
      const hoverables = document.querySelectorAll(
        'a, button, [role="button"], input, textarea, select, [data-cursor-hover]'
      );
      hoverables.forEach((el) => {
        el.addEventListener('mouseenter', () => setIsHovering(true));
        el.addEventListener('mouseleave', () => setIsHovering(false));
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Initial + observe DOM changes for dynamic elements
    addHoverListeners();
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      observer.disconnect();
    };
  }, [mouseX, mouseY]);

  // Don't render on mobile/touch devices
  if (isMobile) return null;

  return (
    <>
      {/* Add global cursor:none style */}
      <style jsx global>{`
        @media (pointer: fine) {
          *, *::before, *::after {
            cursor: none !important;
          }
        }
      `}</style>

      {/* Dot (follows exactly) */}
      <motion.div
        ref={cursorDot}
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            scale: isHovering ? 0 : 1,
            opacity: isHidden ? 0 : 1,
          }}
          transition={{ duration: 0.15 }}
          className="w-2 h-2 rounded-full bg-white"
        />
      </motion.div>

      {/* Ring (follows with spring delay) */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            width: isHovering ? 56 : 32,
            height: isHovering ? 56 : 32,
            opacity: isHidden ? 0 : 1,
          }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="rounded-full border border-white/80"
          style={{
            backgroundColor: isHovering ? 'rgba(255,255,255,0.08)' : 'transparent',
          }}
        />
      </motion.div>
    </>
  );
}
