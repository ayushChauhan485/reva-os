// Lightweight canvas confetti. Renders nothing when motion is reduced.
import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../store/settingsStore';

const COLORS = ['#E8C46A', '#C9A24B', '#FAF7F0', '#D6B9D0', '#E5539B', '#AFC5DB'];

export function Confetti({ fire, count = 140 }: { fire: number; count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!fire || prefersReducedMotion()) return;
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const { width, height } = c.getBoundingClientRect();
    c.width = width * dpr;
    c.height = height * dpr;
    ctx.scale(dpr, dpr);
    const parts = Array.from({ length: count }, () => ({
      x: width / 2 + (Math.random() - 0.5) * width * 0.3,
      y: height * 0.45,
      vx: (Math.random() - 0.5) * 11,
      vy: -Math.random() * 11 - 4,
      r: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      w: 5 + Math.random() * 6,
      h: 3 + Math.random() * 5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
    let raf = 0;
    let t = 0;
    const tick = () => {
      t++;
      ctx.clearRect(0, 0, width, height);
      for (const p of parts) {
        p.vy += 0.22;
        p.vx *= 0.992;
        p.x += p.vx;
        p.y += p.vy;
        p.r += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.globalAlpha = Math.max(0, 1 - t / 190);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.r * 2)));
        ctx.restore();
      }
      if (t < 190) raf = requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, width, height);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [fire, count]);

  return <canvas ref={ref} className="confetti" aria-hidden="true" />;
}
