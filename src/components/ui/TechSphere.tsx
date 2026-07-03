'use client';

import { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

// ─── Layout Constants ───
const CX = 300;
const CY = 300;
const RING_RADII = [0, 75, 135, 190, 240, 280];

// ─── Types ───
interface TechNode {
  id: string;
  label: string;
  short: string;
  ring: number;
  angle: number;
  category: string;
}

// ─── Node Data ───
const TECH_NODES: TechNode[] = [
  // Ring 1: Languages (core)
  { id: 'python', label: 'Python', short: 'PY', ring: 1, angle: 0, category: 'lang' },
  { id: 'javascript', label: 'JavaScript', short: 'JS', ring: 1, angle: 90, category: 'lang' },
  { id: 'typescript', label: 'TypeScript', short: 'TS', ring: 1, angle: 180, category: 'lang' },
  { id: 'html', label: 'HTML', short: '‹/›', ring: 1, angle: 270, category: 'lang' },

  // Ring 2: Frontend + Backend
  { id: 'react', label: 'React', short: 'Re', ring: 2, angle: 0, category: 'fe' },
  { id: 'tailwind', label: 'Tailwind CSS', short: 'TW', ring: 2, angle: 51, category: 'fe' },
  { id: 'bootstrap', label: 'Bootstrap', short: 'BS', ring: 2, angle: 103, category: 'fe' },
  { id: 'nodejs', label: 'Node.js', short: 'NJ', ring: 2, angle: 154, category: 'be' },
  { id: 'express', label: 'Express.js', short: 'EX', ring: 2, angle: 206, category: 'be' },
  { id: 'fastapi', label: 'FastAPI', short: 'FA', ring: 2, angle: 257, category: 'be' },
  { id: 'websockets', label: 'WebSockets', short: 'WS', ring: 2, angle: 308, category: 'be' },

  // Ring 3: Databases
  { id: 'postgresql', label: 'PostgreSQL', short: 'PG', ring: 3, angle: 15, category: 'db' },
  { id: 'mongodb', label: 'MongoDB', short: 'MD', ring: 3, angle: 75, category: 'db' },
  { id: 'firebase', label: 'Firebase', short: 'FB', ring: 3, angle: 135, category: 'db' },
  { id: 'supabase', label: 'Supabase', short: 'SB', ring: 3, angle: 195, category: 'db' },
  { id: 'pinecone', label: 'Pinecone', short: 'PC', ring: 3, angle: 255, category: 'db' },
  { id: 'sql', label: 'SQL', short: 'SQL', ring: 3, angle: 315, category: 'db' },

  // Ring 4: Tools
  { id: 'git', label: 'Git', short: 'Git', ring: 4, angle: 0, category: 'tools' },
  { id: 'github', label: 'GitHub', short: 'GH', ring: 4, angle: 45, category: 'tools' },
  { id: 'ghactions', label: 'GitHub Actions', short: 'GA', ring: 4, angle: 90, category: 'tools' },
  { id: 'docker', label: 'Docker', short: 'DK', ring: 4, angle: 135, category: 'tools' },
  { id: 'postman', label: 'Postman', short: 'PM', ring: 4, angle: 180, category: 'tools' },
  { id: 'figma', label: 'Figma', short: 'FG', ring: 4, angle: 225, category: 'tools' },
  { id: 'arcjet', label: 'Arcjet', short: 'AJ', ring: 4, angle: 270, category: 'tools' },
  { id: 'zod', label: 'Zod', short: 'Zod', ring: 4, angle: 315, category: 'tools' },

  // Ring 5: Focus Areas
  { id: 'aiml', label: 'AI / ML', short: 'AI', ring: 5, angle: 0, category: 'focus' },
  { id: 'cv', label: 'Computer Vision', short: 'CV', ring: 5, angle: 51, category: 'focus' },
  { id: 'apidesign', label: 'API Design', short: 'API', ring: 5, angle: 103, category: 'focus' },
  { id: 'bedev', label: 'Backend Dev', short: 'BE', ring: 5, angle: 154, category: 'focus' },
  { id: 'devops', label: 'DevOps', short: 'DO', ring: 5, angle: 206, category: 'focus' },
  { id: 'uiux', label: 'UI/UX Design', short: 'UX', ring: 5, angle: 257, category: 'focus' },
  { id: 'vcs', label: 'Version Control', short: 'VC', ring: 5, angle: 308, category: 'focus' },
];

// ─── Connections ───
const CONNECTIONS: [string, string][] = [
  // Language → Framework
  ['javascript', 'react'],
  ['javascript', 'nodejs'],
  ['typescript', 'react'],
  ['typescript', 'nodejs'],
  ['python', 'fastapi'],
  ['html', 'react'],
  // Framework internals
  ['react', 'tailwind'],
  ['nodejs', 'express'],
  ['nodejs', 'websockets'],
  // Database links
  ['postgresql', 'sql'],
  ['firebase', 'supabase'],
  // Tool links
  ['git', 'github'],
  ['github', 'ghactions'],
  // Cross-category
  ['python', 'aiml'],
  ['aiml', 'cv'],
  ['aiml', 'pinecone'],
  ['fastapi', 'apidesign'],
  ['nodejs', 'bedev'],
  ['express', 'bedev'],
  ['docker', 'devops'],
  ['git', 'vcs'],
  ['figma', 'uiux'],
  ['react', 'uiux'],
  ['zod', 'nodejs'],
  ['mongodb', 'nodejs'],
];

// ─── Traveling Particles ───
const TRAVELING_PARTICLES = [
  { from: 'javascript', to: 'react', duration: 4, delay: 0 },
  { from: 'python', to: 'aiml', duration: 5, delay: -2 },
  { from: 'nodejs', to: 'express', duration: 3.5, delay: -1 },
  { from: 'git', to: 'github', duration: 4.5, delay: -3 },
  { from: 'typescript', to: 'nodejs', duration: 5.5, delay: -1.5 },
  { from: 'docker', to: 'devops', duration: 4, delay: -2.5 },
  { from: 'react', to: 'uiux', duration: 6, delay: -4 },
  { from: 'aiml', to: 'pinecone', duration: 5, delay: -3.5 },
];

// ─── Helpers ───
function getPosition(ring: number, angle: number): { x: number; y: number } {
  const r = RING_RADII[ring];
  const a = ((angle - 90) * Math.PI) / 180;
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
}

// ─── Component ───
export function TechSphere() {
  const containerRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<SVGGElement>(null);
  const angleRef = useRef(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{
    label: string;
    x: number;
    y: number;
  } | null>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Precompute static positions
  const nodePositions = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    TECH_NODES.forEach((n) => map.set(n.id, getPosition(n.ring, n.angle)));
    return map;
  }, []);

  // Compute connected set on hover
  const connectedTo = useMemo(() => {
    if (!hoveredId) return new Set<string>();
    const s = new Set<string>();
    CONNECTIONS.forEach(([a, b]) => {
      if (a === hoveredId) s.add(b);
      if (b === hoveredId) s.add(a);
    });
    return s;
  }, [hoveredId]);

  // Slow continuous rotation via rAF (GPU-friendly)
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    let raf: number;
    const tick = () => {
      angleRef.current = (angleRef.current + 0.012) % 360;
      if (groupRef.current) {
        groupRef.current.setAttribute(
          'transform',
          `rotate(${angleRef.current}, ${CX}, ${CY})`
        );
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Mouse parallax
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setMouseOffset({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 16,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 16,
      });
      if (hoveredId) {
        setTooltip((prev) =>
          prev
            ? {
                ...prev,
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
              }
            : null
        );
      }
    },
    [hoveredId]
  );

  const handleMouseLeave = useCallback(() => {
    setMouseOffset({ x: 0, y: 0 });
  }, []);

  // Style helpers
  const getNodeOpacity = (id: string) => {
    if (!hoveredId) return 1;
    if (id === hoveredId || connectedTo.has(id)) return 1;
    return 0.1;
  };

  const getConnOpacity = (a: string, b: string) => {
    if (!hoveredId) return 0.1;
    if (a === hoveredId || b === hoveredId) return 0.5;
    return 0.02;
  };

  const getConnWidth = (a: string, b: string) => {
    if (!hoveredId) return 0.5;
    if (a === hoveredId || b === hoveredId) return 1.2;
    return 0.3;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square max-w-[520px] mx-auto select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Parallax wrapper */}
      <motion.div
        animate={{ x: mouseOffset.x, y: mouseOffset.y }}
        transition={{ type: 'spring', stiffness: 120, damping: 25 }}
        className="w-full h-full"
      >
        <svg
          viewBox="0 0 600 600"
          className="w-full h-full"
          style={{ overflow: 'visible' }}
        >
          {/* ── Orbital Rings (static, don't rotate) ── */}
          {RING_RADII.slice(1).map((r, i) => (
            <circle
              key={`ring-${i}`}
              cx={CX}
              cy={CY}
              r={r}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              opacity={0.06}
              strokeDasharray="3 8"
            />
          ))}

          {/* Center hub */}
          <circle cx={CX} cy={CY} r="6" fill="currentColor" opacity="0.06" />
          <circle cx={CX} cy={CY} r="2.5" fill="currentColor" opacity="0.18" />

          {/* ── Rotating Group ── */}
          <g ref={groupRef}>
            {/* Connection lines */}
            {CONNECTIONS.map(([fromId, toId], i) => {
              const from = nodePositions.get(fromId);
              const to = nodePositions.get(toId);
              if (!from || !to) return null;
              return (
                <line
                  key={`c-${i}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="currentColor"
                  strokeWidth={getConnWidth(fromId, toId)}
                  opacity={getConnOpacity(fromId, toId)}
                  style={{ transition: 'opacity 0.4s, stroke-width 0.4s' }}
                />
              );
            })}

            {/* Traveling particles */}
            {TRAVELING_PARTICLES.map((p, i) => {
              const from = nodePositions.get(p.from);
              const to = nodePositions.get(p.to);
              if (!from || !to) return null;
              return (
                <motion.circle
                  key={`tp-${i}`}
                  r="2"
                  fill="currentColor"
                  animate={{
                    cx: [from.x, to.x, from.x],
                    cy: [from.y, to.y, from.y],
                    opacity: [0, 0.4, 0.4, 0],
                  }}
                  transition={{
                    duration: p.duration,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: p.delay,
                  }}
                />
              );
            })}

            {/* ── Nodes ── */}
            {TECH_NODES.map((node) => {
              const pos = nodePositions.get(node.id)!;
              const r = node.ring === 1 ? 20 : node.ring <= 3 ? 17 : 15;
              const fs = node.ring === 1 ? 8.5 : node.ring <= 3 ? 7 : 6.5;
              const isHovered = hoveredId === node.id;
              const nodeOp = getNodeOpacity(node.id);

              return (
                <g
                  key={node.id}
                  opacity={nodeOp}
                  style={{ transition: 'opacity 0.4s' }}
                >
                  {/* Ripple halo on hover */}
                  {isHovered && (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.8"
                    >
                      <animate
                        attributeName="r"
                        from={String(r)}
                        to={String(r + 14)}
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        from="0.35"
                        to="0"
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}

                  {/* Node circle */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isHovered ? r + 3 : r}
                    fill={
                      node.ring === 1 || isHovered
                        ? 'currentColor'
                        : 'var(--background, #fff)'
                    }
                    stroke="currentColor"
                    strokeWidth={isHovered ? 1.5 : 0.8}
                    style={{ transition: 'r 0.3s, fill 0.3s, stroke-width 0.3s' }}
                    onMouseEnter={(e) => {
                      setHoveredId(node.id);
                      const rect =
                        containerRef.current?.getBoundingClientRect();
                      if (rect) {
                        setTooltip({
                          label: node.label,
                          x: e.clientX - rect.left,
                          y: e.clientY - rect.top,
                        });
                      }
                    }}
                    onMouseLeave={() => {
                      setHoveredId(null);
                      setTooltip(null);
                    }}
                    data-cursor-hover=""
                  />

                  {/* Abbreviation label (rotates with sphere) */}
                  <text
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={fs}
                    fontWeight={600}
                    fontFamily="var(--font-inter), system-ui, sans-serif"
                    fill={
                      node.ring === 1 || isHovered
                        ? 'var(--background, #fff)'
                        : 'currentColor'
                    }
                    letterSpacing="0.04em"
                    style={{
                      pointerEvents: 'none',
                      transition: 'fill 0.3s',
                    }}
                  >
                    {node.short}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </motion.div>

      {/* ── Tooltip (HTML, outside SVG) ── */}
      {tooltip && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute pointer-events-none z-10"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -140%)',
          }}
        >
          <div className="bg-foreground text-background px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wider whitespace-nowrap shadow-lg">
            {tooltip.label}
          </div>
        </motion.div>
      )}
    </div>
  );
}
