'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'outline' | 'outline-light';
  className?: string;
  download?: boolean;
}

export function MagneticButton({
  children,
  href,
  onClick,
  variant = 'primary',
  className = '',
  download,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.15;
    const y = (clientY - (top + height / 2)) * 0.15;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const baseStyles =
    variant === 'primary'
      ? 'bg-foreground text-background hover:bg-foreground/90'
      : variant === 'outline-light'
        ? 'bg-transparent text-white border border-white/30 hover:bg-white hover:text-black'
        : 'bg-transparent text-foreground border border-border hover:bg-foreground hover:text-background';

  const content = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-3.5 rounded-full text-sm font-medium tracking-wide transition-colors duration-300 cursor-pointer ${baseStyles} ${className}`}
    >
      {children}
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} download={download} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}>
        {content}
      </a>
    );
  }

  return <button onClick={onClick} type="button">{content}</button>;
}
