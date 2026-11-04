// Trophies for the Reva Awards. One base, a unique topper per category.
import type { TrophyStyle } from '../data/types';

const INK = '#2a0b13';
const s = { stroke: INK, strokeWidth: 2, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

const TOPPERS: Record<TrophyStyle, React.ReactNode> = {
  quill: (
    <g>
      <path d="M60 18 C 82 26, 82 52, 62 70 L 56 66 C 66 50, 66 34, 60 18 Z" fill="#faf0d8" {...s} />
      <path d="M60 22 C 66 40, 64 56, 58 68" fill="none" stroke={INK} strokeWidth="1.2" />
      <path d="M56 66 l-4 8" {...s} />
    </g>
  ),
  scales: (
    <g>
      <path d="M60 22 v46 M38 32 h44" {...s} fill="none" />
      <path d="M30 50 l8 -18 l8 18 z M74 50 l8 -18 l8 18 z" fill="#f5d98a" {...s} />
      <path d="M28 50 a10 5 0 0 0 20 0 z M72 50 a10 5 0 0 0 20 0 z" fill="#e8c46a" {...s} />
      <circle cx="60" cy="22" r="4" fill="#e8c46a" {...s} />
    </g>
  ),
  loop: (
    <g>
      <path d="M40 46 c 0 -14 20 -14 20 0 s 20 14 20 0 s -20 -14 -20 0 s -20 14 -20 0 z" fill="none" stroke="#e8c46a" strokeWidth="7" />
      <path d="M40 46 c 0 -14 20 -14 20 0 s 20 14 20 0 s -20 -14 -20 0 s -20 14 -20 0 z" fill="none" {...s} />
    </g>
  ),
  hands: (
    <g>
      <path d="M38 60 c -6 -16 4 -28 14 -22 l 8 8 l 8 -8 c 10 -6 20 6 14 22 z" fill="#f5d98a" {...s} />
      <circle cx="60" cy="34" r="8" fill="#faf0d8" {...s} />
    </g>
  ),
  puffer: (
    <g>
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <path key={i} d={`M${56 + Math.cos(a) * 17} ${44 + Math.sin(a) * 17}L${56 + Math.cos(a) * 23} ${44 + Math.sin(a) * 23}`} {...s} />;
      })}
      <path d="M72 44 l12 -8 v16 z" fill="#afc5db" {...s} />
      <circle cx="56" cy="44" r="17" fill="#e8c46a" {...s} />
      <circle cx="49" cy="40" r="4" fill="#faf7f0" {...s} strokeWidth={1.5} />
      <circle cx="48.4" cy="40.4" r="1.8" fill={INK} />
    </g>
  ),
  poppy: (
    <g>
      {[0, 90, 180, 270].map((r) => (
        <path key={r} transform={`rotate(${r} 60 44)`} d="M60 44 C 44 40, 44 20, 60 20 C 76 20, 76 40, 60 44 Z" fill="#e3423a" {...s} />
      ))}
      <circle cx="60" cy="44" r="7" fill="#2b2a36" />
    </g>
  ),
  calendar: (
    <g>
      <rect x="40" y="22" width="40" height="42" rx="4" fill="#faf0d8" {...s} />
      <path d="M40 26 a4 4 0 0 1 4 -4 h32 a4 4 0 0 1 4 4 v8 h-40 z" fill="#d9473b" {...s} />
      <text x="60" y="58" textAnchor="middle" fontFamily="Fraunces Variable, Georgia, serif" fontWeight="700" fontSize="20" fill={INK}>
        30
      </text>
    </g>
  ),
  star: (
    <g>
      <path d="M60 14 l9 19 21 3 -15 14 4 21 -19 -10 -19 10 4 -21 -15 -14 21 -3 z" fill="#f5d98a" {...s} />
      <path d="M60 28 l4 9 10 1.5 -7 7 2 10 -9 -5 -9 5 2 -10 -7 -7 10 -1.5 z" fill="#faf0d8" stroke="none" />
    </g>
  ),
  magnifier: (
    <g>
      <circle cx="56" cy="40" r="17" fill="#cfe0ee" {...s} />
      <path d="M48 32 a10 10 0 0 1 10 -4" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <path d="M68 52 l14 14" stroke="#e8c46a" strokeWidth="8" strokeLinecap="round" />
      <path d="M68 52 l14 14" {...s} />
    </g>
  ),
};

export function Trophy({ style, size = 120, shine = true }: { style: TrophyStyle; size?: number; shine?: boolean }) {
  return (
    <svg viewBox="0 0 120 150" width={size} height={(size * 150) / 120} aria-hidden="true" className="trophy">
      <defs>
        <linearGradient id="gold" x1="0" x2="1">
          <stop offset="0" stopColor="#b8862f" />
          <stop offset="0.45" stopColor="#f5d98a" />
          <stop offset="0.6" stopColor="#e8c46a" />
          <stop offset="1" stopColor="#a8782a" />
        </linearGradient>
      </defs>
      <path d="M36 70 h48 v8 a24 24 0 0 1 -48 0 z" fill="url(#gold)" {...s} />
      <path d="M36 76 c-10 0 -12 14 -2 18 M84 76 c10 0 12 14 2 18" fill="none" {...s} />
      <path d="M54 100 h12 v16 h-12 z" fill="url(#gold)" {...s} />
      <path d="M40 116 h40 l4 10 h-48 z" fill="#5c1a2a" {...s} />
      <path d="M32 126 h56 v12 h-56 z" fill="url(#gold)" {...s} />
      <path d="M44 132 h32" stroke={INK} strokeWidth="1" opacity="0.5" />
      {TOPPERS[style]}
      {shine && <path className="trophy__glint" d="M42 74 l6 0 l-10 22 l-4 0 z" fill="#fff" opacity="0.5" />}
    </svg>
  );
}
