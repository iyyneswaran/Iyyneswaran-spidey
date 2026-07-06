'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

// ─── Timing (milliseconds) ───
const DRIFT_DURATION = 800;       // Initial scattered drift
const GATHER_DURATION = 2000;     // Particles coalesce to form text
const HOLD_DURATION = 1400;       // Hold the formed text briefly
const DISSOLVE_DURATION = 1200;    // Text dissolves into dust
const FADE_DURATION = 800;        // Overlay fades out

// ─── Particle Config ───
const PARTICLE_COUNT = 8000;
const TEXT_STRING = 'IYYNESWARAN P';
const CONN_DIST_SQ = 30 * 30;
const MAX_CONNECTIONS = 150;

interface LoaderParticle {
  // current position
  x: number;
  y: number;
  // target (text position)
  tx: number;
  ty: number;
  // initial scatter origin
  ox: number;
  oy: number;
  // velocity for dissolve
  dvx: number;
  dvy: number;
  // appearance
  size: number;
  baseOpacity: number;
  // flags
  isTextParticle: boolean;
  // dissolve direction randomness
  dissolveAngle: number;
  dissolveSpeed: number;
}

/**
 * Sample pixel positions from rendered text on an offscreen canvas.
 */
function sampleTextPositions(
  text: string,
  w: number,
  h: number,
  maxPoints: number
): { x: number; y: number }[] {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.clearRect(0, 0, w, h);

  // Responsive font sizing
  let fontSize: number;
  if (w < 480) {
    fontSize = Math.min(w * 0.08, 32);
  } else if (w < 768) {
    fontSize = Math.min(w * 0.085, 48);
  } else if (w < 1200) {
    fontSize = Math.min(w * 0.065, 64);
  } else {
    fontSize = Math.min(w * 0.055, 80);
  }

  ctx.font = `800 ${fontSize}px Inter, system-ui, -apple-system, sans-serif`;
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Handle line wrapping for narrow viewports
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  const maxLineWidth = w * 0.88;

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxLineWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);

  const lineHeight = fontSize * 1.4;
  const totalHeight = lines.length * lineHeight;
  const startY = (h - totalHeight) / 2 + lineHeight / 2;

  lines.forEach((line, i) => {
    ctx.fillText(line, w / 2, startY + i * lineHeight);
  });

  const imageData = ctx.getImageData(0, 0, w, h).data;
  const points: { x: number; y: number }[] = [];
  const gap = 1.5;

  for (let y = 0; y < h; y += gap) {
    for (let x = 0; x < w; x += gap) {
      const alpha = imageData[(Math.floor(y) * w + Math.floor(x)) * 4 + 3];
      if (alpha > 128) {
        points.push({ x, y });
      }
    }
  }

  // Fisher-Yates shuffle
  for (let i = points.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [points[i], points[j]] = [points[j], points[i]];
  }

  return points.slice(0, maxPoints);
}

export function CinematicLoader({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<LoaderParticle[]>([]);
  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const completedRef = useRef(false);
  const [overlayOpacity, setOverlayOpacity] = useState(1);
  const [isDone, setIsDone] = useState(false);

  const initParticles = useCallback((w: number, h: number) => {
    const textTargets = sampleTextPositions(
      TEXT_STRING,
      w,
      h,
      Math.min(PARTICLE_COUNT * 0.6, 4800)
    );

    const particles: LoaderParticle[] = [];

    // Text particles: assigned to text positions
    for (let i = 0; i < textTargets.length; i++) {
      const target = textTargets[i];
      const angle = Math.random() * Math.PI * 2;
      const dist = 150 + Math.random() * Math.max(w, h) * 0.5;
      particles.push({
        x: target.x + Math.cos(angle) * dist,
        y: target.y + Math.sin(angle) * dist,
        tx: target.x,
        ty: target.y,
        ox: target.x + Math.cos(angle) * dist,
        oy: target.y + Math.sin(angle) * dist,
        dvx: 0,
        dvy: 0,
        size: 0.8 + Math.random() * 1.4,
        baseOpacity: 0.35 + Math.random() * 0.55,
        isTextParticle: true,
        dissolveAngle: Math.random() * Math.PI * 2,
        dissolveSpeed: 1.5 + Math.random() * 4,
      });
    }

    // Ambient particles: float freely with connections
    const ambientCount = PARTICLE_COUNT - textTargets.length;
    for (let i = 0; i < ambientCount; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      particles.push({
        x,
        y,
        tx: x,
        ty: y,
        ox: x,
        oy: y,
        dvx: (Math.random() - 0.5) * 0.4,
        dvy: (Math.random() - 0.5) * 0.4,
        size: 0.5 + Math.random() * 1.0,
        baseOpacity: 0.05 + Math.random() * 0.15,
        isTextParticle: false,
        dissolveAngle: Math.random() * Math.PI * 2,
        dissolveSpeed: 0.5 + Math.random() * 1.5,
      });
    }

    particlesRef.current = particles;
  }, []);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const w = Math.floor(rect.width);
    const h = Math.floor(rect.height);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Resize canvas if needed
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    }

    const elapsed = performance.now() - startTimeRef.current;
    const particles = particlesRef.current;

    ctx.clearRect(0, 0, w * dpr, h * dpr);
    ctx.save();
    ctx.scale(dpr, dpr);

    const totalActive = DRIFT_DURATION + GATHER_DURATION + HOLD_DURATION + DISSOLVE_DURATION;

    // ── Phase calculation ──
    let phase: 'drift' | 'gather' | 'hold' | 'dissolve' | 'fade';
    let phaseProgress: number;

    if (elapsed < DRIFT_DURATION) {
      phase = 'drift';
      phaseProgress = elapsed / DRIFT_DURATION;
    } else if (elapsed < DRIFT_DURATION + GATHER_DURATION) {
      phase = 'gather';
      phaseProgress = (elapsed - DRIFT_DURATION) / GATHER_DURATION;
    } else if (elapsed < DRIFT_DURATION + GATHER_DURATION + HOLD_DURATION) {
      phase = 'hold';
      phaseProgress = (elapsed - DRIFT_DURATION - GATHER_DURATION) / HOLD_DURATION;
    } else if (elapsed < totalActive) {
      phase = 'dissolve';
      phaseProgress = (elapsed - DRIFT_DURATION - GATHER_DURATION - HOLD_DURATION) / DISSOLVE_DURATION;
    } else {
      phase = 'fade';
      phaseProgress = Math.min((elapsed - totalActive) / FADE_DURATION, 1);
    }

    // ── Easing functions ──
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const easeInCubic = (t: number) => t * t * t;
    const easeInOutQuart = (t: number) =>
      t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

    const time = elapsed * 0.001;

    // ── Draw connecting lines between ambient particles ──
    if (phase !== 'fade' || phaseProgress < 0.5) {
      const lineAlpha = phase === 'fade' ? (1 - phaseProgress * 2) * 0.04 : 0.04;
      let connCount = 0;
      ctx.beginPath();
      ctx.strokeStyle = `rgba(0, 0, 0, ${lineAlpha})`;
      ctx.lineWidth = 0.4;

      for (let i = 0; i < particles.length && connCount < MAX_CONNECTIONS; i += 5) {
        const p = particles[i];
        if (p.isTextParticle) continue;
        for (let j = i + 5; j < particles.length && connCount < MAX_CONNECTIONS; j += 5) {
          const q = particles[j];
          if (q.isTextParticle) continue;
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          if (dx * dx + dy * dy < CONN_DIST_SQ) {
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            connCount++;
          }
        }
      }
      ctx.stroke();
    }

    // ── Update and draw particles ──
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      let alpha: number;

      if (p.isTextParticle) {
        switch (phase) {
          case 'drift': {
            // Particles gently float from their scatter origin
            const drift = easeOutCubic(phaseProgress);
            // Slight inward drift toward target
            p.x = p.ox + (p.tx - p.ox) * drift * 0.08;
            p.y = p.oy + (p.ty - p.oy) * drift * 0.08;
            // Add subtle noise
            p.x += Math.sin(time * 1.5 + i * 0.1) * 1.5;
            p.y += Math.cos(time * 1.2 + i * 0.13) * 1.5;
            alpha = p.baseOpacity * phaseProgress * 0.5;
            break;
          }
          case 'gather': {
            // Smooth convergence to target position
            const gatherEase = easeInOutQuart(phaseProgress);
            const startX = p.ox + (p.tx - p.ox) * 0.08;
            const startY = p.oy + (p.ty - p.oy) * 0.08;
            p.x = startX + (p.tx - startX) * gatherEase;
            p.y = startY + (p.ty - startY) * gatherEase;
            // Diminishing organic noise as particles settle
            const noiseScale = (1 - gatherEase) * 2.5;
            p.x += Math.sin(time * 2 + i * 0.07) * noiseScale;
            p.y += Math.cos(time * 1.7 + i * 0.09) * noiseScale;
            alpha = p.baseOpacity * (0.5 + gatherEase * 0.5);
            break;
          }
          case 'hold': {
            // Settled on target with very subtle breathing
            p.x = p.tx + Math.sin(time * 0.8 + i * 0.05) * 0.3;
            p.y = p.ty + Math.cos(time * 0.6 + i * 0.07) * 0.2;
            alpha = p.baseOpacity;
            break;
          }
          case 'dissolve': {
            // Particles explode outward as dust
            const dissolveEase = easeInCubic(phaseProgress);
            const speed = p.dissolveSpeed * dissolveEase * 60;
            p.x = p.tx + Math.cos(p.dissolveAngle) * speed;
            p.y = p.ty + Math.sin(p.dissolveAngle) * speed - dissolveEase * 20;
            // Add turbulence
            p.x += Math.sin(time * 3 + i) * dissolveEase * 8;
            p.y += Math.cos(time * 2.5 + i * 0.7) * dissolveEase * 6;
            alpha = p.baseOpacity * (1 - easeOutCubic(phaseProgress));
            break;
          }
          case 'fade': {
            alpha = 0;
            break;
          }
          default:
            alpha = 0;
        }
      } else {
        // Ambient particles: gentle perpetual drift
        p.x += p.dvx + Math.sin(time * 0.5 + i * 0.03) * 0.08;
        p.y += p.dvy + Math.cos(time * 0.4 + i * 0.04) * 0.06;

        // Wrap around
        if (p.x < -5) p.x = w + 5;
        if (p.x > w + 5) p.x = -5;
        if (p.y < -5) p.y = h + 5;
        if (p.y > h + 5) p.y = -5;

        if (phase === 'fade') {
          alpha = p.baseOpacity * (1 - phaseProgress);
        } else if (phase === 'dissolve') {
          alpha = p.baseOpacity * (1 - phaseProgress * 0.5);
        } else {
          alpha = p.baseOpacity;
        }
      }

      if (alpha < 0.005) continue;

      // Draw particle
      ctx.fillStyle = `rgba(10, 10, 10, ${Math.min(alpha, 1)})`;
      const s = p.size;
      ctx.fillRect(p.x - s * 0.5, p.y - s * 0.5, s, s);
    }

    ctx.restore();

    // ── Handle overlay fade ──
    if (phase === 'fade') {
      setOverlayOpacity(1 - easeOutCubic(phaseProgress));
      if (phaseProgress >= 1 && !completedRef.current) {
        completedRef.current = true;
        setIsDone(true);
        onComplete();
        return;
      }
    }

    rafRef.current = requestAnimationFrame(render);
  }, [onComplete]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const rect = container.getBoundingClientRect();
    const w = Math.floor(rect.width);
    const h = Math.floor(rect.height);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    // Wait for fonts, then init
    document.fonts.ready.then(() => {
      initParticles(w, h);
      startTimeRef.current = performance.now();
      rafRef.current = requestAnimationFrame(render);
    });

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [initParticles, render]);

  if (isDone) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        opacity: overlayOpacity,
        backgroundColor: '#ffffff',
        pointerEvents: overlayOpacity > 0 ? 'all' : 'none',
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ display: 'block' }}
      />
    </div>
  );
}
