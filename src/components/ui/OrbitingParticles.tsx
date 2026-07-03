'use client';

import { motion } from 'framer-motion';

interface Particle {
  id: number;
  size: number;
  orbitRadius: number; // percentage of container
  duration: number;
  delay: number;
  opacity: number;
  direction: 1 | -1; // 1 = clockwise, -1 = counter-clockwise
}

const PARTICLES: Particle[] = [
  { id: 1, size: 5, orbitRadius: 54, duration: 12, delay: 0, opacity: 0.7, direction: 1 },
  { id: 2, size: 3, orbitRadius: 56, duration: 18, delay: -4, opacity: 0.4, direction: -1 },
  { id: 3, size: 6, orbitRadius: 52, duration: 15, delay: -8, opacity: 0.6, direction: 1 },
  { id: 4, size: 3, orbitRadius: 58, duration: 20, delay: -2, opacity: 0.35, direction: -1 },
  { id: 5, size: 4, orbitRadius: 55, duration: 10, delay: -6, opacity: 0.55, direction: 1 },
  { id: 6, size: 2, orbitRadius: 60, duration: 25, delay: -1, opacity: 0.3, direction: 1 },
  { id: 7, size: 4, orbitRadius: 50, duration: 14, delay: -10, opacity: 0.5, direction: -1 },
  { id: 8, size: 5, orbitRadius: 57, duration: 11, delay: -7, opacity: 0.45, direction: 1 },
  { id: 9, size: 2, orbitRadius: 62, duration: 22, delay: -3, opacity: 0.25, direction: -1 },
  { id: 10, size: 4, orbitRadius: 53, duration: 16, delay: -5, opacity: 0.5, direction: 1 },
  { id: 11, size: 3, orbitRadius: 59, duration: 19, delay: -9, opacity: 0.35, direction: -1 },
  { id: 12, size: 2, orbitRadius: 51, duration: 13, delay: -11, opacity: 0.4, direction: 1 },
];

function ParticleDot({ particle }: { particle: Particle }) {
  const startAngle = (particle.id * 30) % 360;

  return (
    <motion.div
      className="absolute rounded-full bg-foreground"
      style={{
        width: particle.size,
        height: particle.size,
        top: '50%',
        left: '50%',
        marginTop: -particle.size / 2,
        marginLeft: -particle.size / 2,
      }}
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: [
          particle.opacity * 0.3,
          particle.opacity,
          particle.opacity * 0.5,
          particle.opacity,
          particle.opacity * 0.3,
        ],
        x: [
          Math.cos((startAngle * Math.PI) / 180) * particle.orbitRadius * 2.5,
          Math.cos(((startAngle + 90 * particle.direction) * Math.PI) / 180) * particle.orbitRadius * 2.5,
          Math.cos(((startAngle + 180 * particle.direction) * Math.PI) / 180) * particle.orbitRadius * 2.5,
          Math.cos(((startAngle + 270 * particle.direction) * Math.PI) / 180) * particle.orbitRadius * 2.5,
          Math.cos(((startAngle + 360 * particle.direction) * Math.PI) / 180) * particle.orbitRadius * 2.5,
        ],
        y: [
          Math.sin((startAngle * Math.PI) / 180) * particle.orbitRadius * 2.5,
          Math.sin(((startAngle + 90 * particle.direction) * Math.PI) / 180) * particle.orbitRadius * 2.5,
          Math.sin(((startAngle + 180 * particle.direction) * Math.PI) / 180) * particle.orbitRadius * 2.5,
          Math.sin(((startAngle + 270 * particle.direction) * Math.PI) / 180) * particle.orbitRadius * 2.5,
          Math.sin(((startAngle + 360 * particle.direction) * Math.PI) / 180) * particle.orbitRadius * 2.5,
        ],
        scale: [0.8, 1.2, 1, 1.3, 0.8],
      }}
      transition={{
        duration: particle.duration,
        repeat: Infinity,
        ease: 'linear',
        delay: particle.delay,
      }}
    />
  );
}

export function OrbitingParticles() {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-visible"
      aria-hidden="true"
      style={{ zIndex: 1 }}
    >
      {PARTICLES.map((particle) => (
        <ParticleDot key={particle.id} particle={particle} />
      ))}
    </div>
  );
}
