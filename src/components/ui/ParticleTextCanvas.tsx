'use client';

import { useRef, useEffect, useCallback } from 'react';

// ─── Configuration ───
const PARTICLE_COUNT = 2500;
const SPRING = 0.022;
const DAMPING = 0.93;
const NOISE = 0.25;
const MOUSE_RADIUS = 80;
const MOUSE_FORCE = 6;
const CONN_DIST = 35;
const MAX_CONNS = 100;
const CELL = 45;
const SCATTER_MS = 220;

// ─── Types ───
interface Particle {
  x: number;
  y: number;
  tx: number;
  ty: number;
  vx: number;
  vy: number;
  sz: number;
  op: number;
  has: boolean;
}

// ─── Text → Target Positions ───
function sampleText(
  text: string,
  w: number,
  h: number,
  max: number
): { x: number; y: number }[] {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  ctx.clearRect(0, 0, w, h);

  // Adaptive font size
  let fs = Math.min(w * 0.1, 58);
  if (text.length > 15) fs = Math.min(w * 0.07, 46);
  if (text.length > 25) fs = Math.min(w * 0.055, 36);

  ctx.font = `700 ${fs}px Inter, system-ui, sans-serif`;
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Word wrap
  const words = text.split(' ');
  const lines: string[] = [];
  let cur = '';
  const mw = w * 0.85;
  for (const word of words) {
    const test = cur ? `${cur} ${word}` : word;
    if (ctx.measureText(test).width > mw && cur) {
      lines.push(cur);
      cur = word;
    } else {
      cur = test;
    }
  }
  if (cur) lines.push(cur);

  const lh = fs * 1.35;
  const th = lines.length * lh;
  const sy = (h - th) / 2 + lh / 2;
  lines.forEach((l, i) => ctx.fillText(l, w / 2, sy + i * lh));

  // Scan pixels for filled areas
  const d = ctx.getImageData(0, 0, w, h).data;
  const pts: { x: number; y: number }[] = [];
  const gap = 2;
  for (let y = 0; y < h; y += gap) {
    for (let x = 0; x < w; x += gap) {
      if (d[(y * w + x) * 4 + 3] > 128) pts.push({ x, y });
    }
  }

  // Fisher-Yates shuffle
  for (let i = pts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pts[i], pts[j]] = [pts[j], pts[i]];
  }
  return pts.slice(0, max);
}

// ─── Component ───
interface Props {
  activeText: string;
}

export function ParticleTextCanvas({ activeText }: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const cvsRef = useRef<HTMLCanvasElement>(null);
  const psRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const szRef = useRef({ w: 600, h: 500 });
  const dprRef = useRef(1);
  const rafRef = useRef(0);
  const txtRef = useRef('');

  // ── Create particles ──
  const init = useCallback((w: number, h: number) => {
    const arr: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr.push({
        x: Math.random() * w,
        y: Math.random() * h,
        tx: 0,
        ty: 0,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        sz: 1 + Math.random() * 1.5,
        op: 0.1 + Math.random() * 0.45,
        has: false,
      });
    }
    psRef.current = arr;
  }, []);

  // ── Assign targets from text ──
  const morphTo = useCallback((text: string) => {
    const { w, h } = szRef.current;
    const ps = psRef.current;
    ps.forEach((p) => { p.has = false; });
    if (!text) return;

    const targets = sampleText(text, w, h, Math.min(Math.floor(PARTICLE_COUNT * 0.6), 1500));

    // Shuffle particle indices for random assignment
    const idx = Array.from({ length: ps.length }, (_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    targets.forEach((t, i) => {
      if (i < idx.length) {
        const p = ps[idx[i]];
        p.tx = t.x;
        p.ty = t.y;
        p.has = true;
      }
    });
  }, []);

  // ── Render loop ──
  const draw = useCallback(() => {
    const cvs = cvsRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;

    const { w, h } = szRef.current;
    const dpr = dprRef.current;
    const ps = psRef.current;
    const m = mouseRef.current;
    const t = performance.now() * 0.001;

    ctx.clearRect(0, 0, w * dpr, h * dpr);
    ctx.save();
    ctx.scale(dpr, dpr);

    // ── Spatial grid ──
    const grid = new Map<string, number[]>();
    for (let i = 0; i < ps.length; i++) {
      const k = `${(ps[i].x / CELL) | 0},${(ps[i].y / CELL) | 0}`;
      let c = grid.get(k);
      if (!c) { c = []; grid.set(k, c); }
      c.push(i);
    }

    // ── Connection lines (non-targeted particles only) ──
    let cn = 0;
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0,0,0,0.035)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < ps.length && cn < MAX_CONNS; i += 4) {
      const p = ps[i];
      if (p.has) continue;
      const gx = (p.x / CELL) | 0;
      const gy = (p.y / CELL) | 0;
      for (let dx = -1; dx <= 1 && cn < MAX_CONNS; dx++) {
        for (let dy = -1; dy <= 1 && cn < MAX_CONNS; dy++) {
          const cell = grid.get(`${gx + dx},${gy + dy}`);
          if (!cell) continue;
          for (const j of cell) {
            if (j <= i || ps[j].has) continue;
            const ex = p.x - ps[j].x;
            const ey = p.y - ps[j].y;
            if (ex * ex + ey * ey < CONN_DIST * CONN_DIST) {
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(ps[j].x, ps[j].y);
              if (++cn >= MAX_CONNS) break;
            }
          }
        }
      }
    }
    ctx.stroke();

    // ── Update & draw particles ──
    for (let i = 0; i < ps.length; i++) {
      const p = ps[i];

      if (p.has) {
        // Spring + noise + wave
        p.vx += (p.tx - p.x) * SPRING;
        p.vy += (p.ty - p.y) * SPRING;
        p.vx *= DAMPING;
        p.vy *= DAMPING;
        p.x += p.vx + (Math.random() - 0.5) * NOISE + Math.sin(t * 0.5 + p.tx * 0.01) * 0.12;
        p.y += p.vy + (Math.random() - 0.5) * NOISE + Math.cos(t * 0.6 + p.ty * 0.01) * 0.08;
      } else {
        // Free drift
        p.vx += (Math.random() - 0.5) * 0.06;
        p.vy += (Math.random() - 0.5) * 0.06;
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
      }

      // Mouse repulsion
      const mx = p.x - m.x;
      const my = p.y - m.y;
      const md2 = mx * mx + my * my;
      if (md2 < MOUSE_RADIUS * MOUSE_RADIUS && md2 > 1) {
        const md = Math.sqrt(md2);
        const f = ((MOUSE_RADIUS - md) / MOUSE_RADIUS) * MOUSE_FORCE * 0.08;
        p.vx += (mx / md) * f;
        p.vy += (my / md) * f;
      }

      // Render
      const a = p.has ? p.op * 0.85 : p.op * 0.3;
      ctx.fillStyle = `rgba(15,15,15,${a})`;
      ctx.fillRect(p.x - p.sz * 0.5, p.y - p.sz * 0.5, p.sz, p.sz);
    }

    ctx.restore();
    rafRef.current = requestAnimationFrame(draw);
  }, []);

  // ── Setup & cleanup ──
  useEffect(() => {
    const box = boxRef.current;
    const cvs = cvsRef.current;
    if (!box || !cvs) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    dprRef.current = dpr;

    const resize = () => {
      const r = box.getBoundingClientRect();
      const w = Math.floor(r.width);
      const h = Math.floor(r.height);
      szRef.current = { w, h };
      cvs.width = w * dpr;
      cvs.height = h * dpr;
      cvs.style.width = `${w}px`;
      cvs.style.height = `${h}px`;
    };

    resize();
    init(szRef.current.w, szRef.current.h);
    document.fonts.ready.then(() => {
      if (txtRef.current) morphTo(txtRef.current);
    });

    rafRef.current = requestAnimationFrame(draw);
    const ro = new ResizeObserver(resize);
    ro.observe(box);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [init, draw, morphTo]);

  // ── React to text changes ──
  useEffect(() => {
    if (activeText === txtRef.current) return;
    txtRef.current = activeText;

    // Phase 1: scatter
    psRef.current.forEach((p) => {
      p.has = false;
      p.vx += (Math.random() - 0.5) * 2.5;
      p.vy += (Math.random() - 0.5) * 2.5;
    });

    // Phase 2: regroup
    const id = setTimeout(() => {
      document.fonts.ready.then(() => morphTo(activeText));
    }, SCATTER_MS);

    return () => clearTimeout(id);
  }, [activeText, morphTo]);

  // ── Mouse handlers ──
  const onMove = useCallback((e: React.MouseEvent) => {
    const r = cvsRef.current?.getBoundingClientRect();
    if (r) mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
  }, []);

  const onLeave = useCallback(() => {
    mouseRef.current = { x: -9999, y: -9999 };
  }, []);

  return (
    <div
      ref={boxRef}
      className="relative w-full h-full min-h-[400px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <canvas ref={cvsRef} className="absolute inset-0" />
    </div>
  );
}
