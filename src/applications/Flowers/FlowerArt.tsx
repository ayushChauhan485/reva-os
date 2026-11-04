// Original botanical illustrations. Fine ink lines, flat washes.
import type { Flower } from '../../data/types';
import type { StemId } from '../../data/flowers';

const INK = '#343342';
const line = { stroke: INK, strokeWidth: 1.6, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

function Stem({ d }: { d: string }) {
  return <path d={d} fill="none" stroke="#5e8a5a" strokeWidth="3" strokeLinecap="round" />;
}

function Leaf({ d, fill = '#8fb487' }: { d: string; fill?: string }) {
  return <path d={d} fill={fill} {...line} />;
}

function lilyPetal(rot: number, fill: string, inward: string, key: number, len = 62) {
  return (
    <g key={key} transform={`rotate(${rot} 100 96)`}>
      <path d={`M100 96 C 86 ${96 - len * 0.45}, 92 ${96 - len * 0.9}, 100 ${96 - len} C 108 ${96 - len * 0.9}, 114 ${96 - len * 0.45}, 100 96 Z`} fill={fill} {...line} />
      <path d={`M100 92 C 97 ${96 - len * 0.4}, 99 ${96 - len * 0.65}, 100 ${96 - len * 0.78}`} fill="none" stroke={inward} strokeWidth="5" strokeLinecap="round" opacity="0.85" />
      <path d={`M100 94 L100 ${96 - len * 0.85}`} stroke={INK} strokeWidth="0.8" opacity="0.4" />
    </g>
  );
}

export function FlowerArt({ art, size = 200 }: { art: Flower['art']; size?: number }) {
  return (
    <svg viewBox="0 0 200 240" width={size} height={(size * 240) / 200} aria-hidden="true" className="flower-art">
      {art === 'white-lily' && (
        <g>
          <Stem d="M100 100 C 98 150, 104 190, 100 236" />
          <Leaf d="M101 170 C 120 150, 150 150, 160 140 C 150 165, 125 175, 101 176 Z" />
          <Leaf d="M100 200 C 80 185, 55 186, 42 176 C 52 200, 78 206, 100 206 Z" />
          {[30, 150, 270].map((r, i) => lilyPetal(r, '#f4efe6', '#e8a7c8', i))}
          {[90, 210, 330].map((r, i) => lilyPetal(r, '#ffffff', '#e5539b', i + 3, 66))}
          {[-40, -15, 10, 35, 60, -65].map((a, i) => (
            <g key={i} transform={`rotate(${a} 100 96)`}>
              <path d="M100 96 L100 62" stroke="#c6a94f" strokeWidth="1.2" />
              <ellipse cx="100" cy="60" rx="2.4" ry="5" fill="#b46b2e" stroke={INK} strokeWidth="0.8" />
            </g>
          ))}
        </g>
      )}

      {art === 'tiger-lily' && (
        <g>
          <Stem d="M100 236 C 100 180, 96 120, 108 60 C 112 44, 122 40, 128 44" />
          <Leaf d="M100 200 L 60 186 L 100 192 Z" />
          <Leaf d="M100 180 L 142 168 L 100 174 Z" />
          <Leaf d="M99 150 L 64 136 L 99 144 Z" />
          <g transform="translate(36 30)">
            {[0, 60, 120, 180, 240, 300].map((r, i) => (
              <g key={i} transform={`rotate(${r} 92 70)`}>
                <path d="M92 70 C 80 48, 82 26, 96 14 C 112 6, 118 18, 108 22 C 100 30, 100 50, 92 70 Z" fill="#ec8a3a" {...line} />
                {[0, 1, 2, 3].map((k) => (
                  <circle key={k} cx={93 + (k % 2) * 4} cy={56 - k * 8} r="1.6" fill="#5c1a2a" />
                ))}
              </g>
            ))}
            {[-30, -10, 10, 30].map((a, i) => (
              <g key={i} transform={`rotate(${a + 180} 92 70)`}>
                <path d="M92 70 C 92 90, 94 104, 92 118" fill="none" stroke="#b4462a" strokeWidth="1.2" />
                <ellipse cx="92" cy="120" rx="2.4" ry="5" fill="#5c1a2a" />
              </g>
            ))}
            <circle cx="92" cy="70" r="5" fill="#d0642a" {...line} />
          </g>
        </g>
      )}

      {art === 'poppy' && (
        <g>
          <path d="M102 236 C 96 190, 112 150, 100 110" fill="none" stroke="#6b9264" strokeWidth="3" strokeLinecap="round" />
          {Array.from({ length: 14 }, (_, i) => (
            <path key={i} d={`M${101 + Math.sin(i) * 3} ${120 + i * 8} l${i % 2 ? 5 : -5} -3`} stroke="#6b9264" strokeWidth="1" />
          ))}
          <path d="M60 236 C 60 210, 52 200, 58 186" fill="none" stroke="#6b9264" strokeWidth="2.4" />
          <path d="M58 186 c -8 -4 -8 -16 0 -20 c 8 4 8 16 0 20 z" fill="#8fb487" {...line} />
          <g transform="translate(0 -4)">
            <path d="M100 100 C 60 110, 40 70, 62 46 C 78 30, 100 44, 100 100 Z" fill="#e3423a" {...line} />
            <path d="M100 100 C 140 110, 160 70, 138 46 C 122 30, 100 44, 100 100 Z" fill="#e3423a" {...line} />
            <path d="M100 100 C 64 92, 66 50, 100 40 C 134 50, 136 92, 100 100 Z" fill="#f05a4a" {...line} />
            <path d="M100 100 C 70 124, 50 98, 64 82 M100 100 C 130 124, 150 98, 136 82" fill="#d23a33" {...line} />
            <path d="M74 62 q8 6 4 16 M126 62 q-8 6 -4 16 M100 50 q-4 10 0 20" fill="none" stroke="#a52a27" strokeWidth="1" />
            <circle cx="100" cy="78" r="13" fill="#2b2a36" />
            {Array.from({ length: 18 }, (_, i) => {
              const a = (i / 18) * Math.PI * 2;
              return <circle key={i} cx={100 + Math.cos(a) * 15} cy={78 + Math.sin(a) * 15} r="1.6" fill="#2b2a36" />;
            })}
            <path d="M92 78h16M100 70v16M94 72l12 12M106 72l-12 12" stroke="#6f6c80" strokeWidth="1" />
          </g>
        </g>
      )}

      {art === 'white-memoir' && (
        <g>
          <path d="M70 140 L100 236 L130 140 Z" fill="#7fa577" opacity="0.5" />
          {[
            [70, 92],
            [100, 76],
            [130, 92],
            [86, 116],
            [116, 116],
            [100, 100],
          ].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="17" fill="#fbf9f3" {...line} />
              <path d={`M${x} ${y} m-9 0 a9 9 0 1 1 9 9 a6 6 0 1 1 -6 -6 a3 3 0 1 1 3 3`} fill="none" stroke={INK} strokeWidth="1.1" />
            </g>
          ))}
          {[
            [52, 72],
            [150, 70],
            [60, 120],
            [142, 124],
            [100, 54],
          ].map(([x, y], i) => (
            <g key={i}>
              {[0, 72, 144, 216, 288].map((r) => (
                <circle key={r} cx={x + Math.cos((r * Math.PI) / 180) * 4} cy={y + Math.sin((r * Math.PI) / 180) * 4} r="3" fill="#fff" stroke={INK} strokeWidth="0.8" />
              ))}
              <circle cx={x} cy={y} r="1.8" fill="#d9d49a" />
            </g>
          ))}
          <path d="M58 130 L100 236 L142 130 L120 150 L100 140 L80 150 Z" fill="#e2d6c2" {...line} />
          <path d="M66 136 L100 236 L80 150 Z" fill="#d4c4aa" {...line} />
          <path d="M88 180 q12 8 24 0 M100 184 l-14 20 M100 184 l14 20" fill="none" stroke="#d6b9d0" strokeWidth="3" strokeLinecap="round" />
        </g>
      )}

      {art === 'wildflower' && (
        <g>
          <Stem d="M100 236 C 96 200, 106 160, 100 120" />
          <Leaf d="M101 190 C 116 176, 132 178, 140 170 C 132 190, 116 194, 101 194 Z" />
          {[0, 72, 144, 216, 288].map((r) => (
            <ellipse key={r} cx="100" cy="88" rx="12" ry="24" transform={`rotate(${r} 100 112)`} fill="#d6b9d0" {...line} />
          ))}
          <circle cx="100" cy="112" r="10" fill="#d9d49a" {...line} />
          <g transform="translate(132 54) rotate(10)">
            <rect x="0" y="0" width="44" height="24" rx="3" fill="#faf7f0" {...line} />
            <circle cx="7" cy="12" r="2.4" fill="none" stroke={INK} />
            <text x="27" y="17" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="13" fill={INK}>
              ?
            </text>
          </g>
        </g>
      )}

      {art === 'handmade' && (
        <g>
          <path d="M80 150 h40 l-6 86 h-28 z" fill="#d6e3ee" opacity="0.8" {...line} />
          {[
            [70, 90, -30],
            [130, 90, 30],
            [100, 70, 0],
          ].map(([x, y, r], i) => (
            <g key={i} transform={`translate(${x - 100} ${y - 96}) rotate(${r} 100 96) scale(0.6) translate(66 64)`}>
              {[0, 60, 120, 180, 240, 300].map((p, k) => lilyPetal(p, '#f4c6db', '#e5539b', k, 50))}
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}

/** Small heads for the bouquet studio. Drawn around (0,0), roughly 56px wide. */
export function StemHead({ id }: { id: StemId }) {
  switch (id) {
    case 'white-lily':
      return (
        <g>
          {[0, 60, 120, 180, 240, 300].map((r) => (
            <g key={r} transform={`rotate(${r})`}>
              <path d="M0 0 C -8 -10, -5 -22, 0 -26 C 5 -22, 8 -10, 0 0 Z" fill="#fff" {...line} strokeWidth={1.3} />
              <path d="M0 -3 L0 -17" stroke="#e5539b" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
            </g>
          ))}
          <circle r="2.5" fill="#c6a94f" />
        </g>
      );
    case 'tiger-lily':
      return (
        <g>
          {[30, 90, 150, 210, 270, 330].map((r) => (
            <g key={r} transform={`rotate(${r})`}>
              <path d="M0 0 C -7 -10, -6 -20, 0 -24 C 8 -26, 9 -18, 4 -16 C 2 -10, 2 -6, 0 0 Z" fill="#ec8a3a" {...line} strokeWidth={1.3} />
              <circle cx="0" cy="-12" r="1.3" fill="#5c1a2a" />
            </g>
          ))}
          <circle r="3" fill="#b4462a" />
        </g>
      );
    case 'poppy':
      return (
        <g>
          {[0, 90, 180, 270].map((r) => (
            <path key={r} transform={`rotate(${r})`} d="M0 0 C -18 -4, -18 -24, 0 -24 C 18 -24, 18 -4, 0 0 Z" fill="#e3423a" {...line} strokeWidth={1.3} />
          ))}
          <circle r="7" fill="#2b2a36" />
          <circle r="2" fill="#6f6c80" />
        </g>
      );
    case 'white-rose':
      return (
        <g>
          <circle r="16" fill="#fbf9f3" {...line} strokeWidth={1.3} />
          <path d="M-8 0 a8 8 0 1 1 8 8 a5 5 0 1 1 -5 -5 a2.5 2.5 0 1 1 2.5 2.5" fill="none" stroke={INK} strokeWidth="1.1" />
        </g>
      );
    case 'babys-breath':
      return (
        <g>
          {[
            [0, 0],
            [-9, -6],
            [8, -8],
            [-4, -15],
            [10, 4],
            [-11, 6],
            [3, 10],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="4" fill="#fff" stroke={INK} strokeWidth="1" />
          ))}
        </g>
      );
    case 'leaf':
      return (
        <g>
          {[-20, -8, 4].map((y, i) => (
            <g key={i}>
              <ellipse cx={-7} cy={y} rx="7" ry="5" fill="#9cb8a0" {...line} strokeWidth={1.1} />
              <ellipse cx={7} cy={y + 5} rx="7" ry="5" fill="#9cb8a0" {...line} strokeWidth={1.1} />
            </g>
          ))}
        </g>
      );
  }
}
