// lost+found — find five small things hidden in a pixel room.
// Completing it unlocks a hidden category at the Reva Awards.
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Confetti } from '../../components/Confetti';
import { getPhoto, photoSrc } from '../../lib/photos';
import { play } from '../../lib/sound';
import { useProgress } from '../../store/progressStore';
import { useUI } from '../../store/uiStore';

type ItemId = 'pufferfish' | 'flower' | 'calendar' | 'photo' | 'message';

const ITEMS: { id: ItemId; label: string; x: number; y: number }[] = [
  { id: 'pufferfish', label: 'a pufferfish', x: 251, y: 65 },
  { id: 'flower', label: 'a flower', x: 33, y: 139 },
  { id: 'calendar', label: 'a tiny calendar', x: 147, y: 37 },
  { id: 'photo', label: 'a photograph', x: 118, y: 121 },
  { id: 'message', label: 'a message', x: 214, y: 190 },
];

const R = (x: number, y: number, w: number, h: number, fill: string, key?: string | number) => <rect key={key} x={x} y={y} width={w} height={h} fill={fill} />;

export default function FindGame() {
  const [found, setFound] = useState<ItemId[]>(() => (useProgress.getState().gameComplete ? ITEMS.map((i) => i.id) : []));
  const [misses, setMisses] = useState(0);
  const [hint, setHint] = useState<ItemId | null>(null);
  const [miss, setMiss] = useState<{ x: number; y: number; k: number } | null>(null);
  const [fire, setFire] = useState(0);
  const complete = found.length === ITEMS.length;
  const p20 = getPhoto('P20');
  const p20src = p20 ? photoSrc(p20, { thumb: true }) : null;

  const hit = (id: ItemId) => {
    if (found.includes(id)) return;
    play('pop');
    setFound((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setHint(null);
  };

  // celebrate once, the first time everything is found
  const celebrated = useRef(useProgress.getState().gameComplete);
  useEffect(() => {
    if (!complete || celebrated.current) return;
    celebrated.current = true;
    const t = window.setTimeout(() => {
      play('complete');
      setFire((f) => f + 1);
      useProgress.getState().patch({ gameComplete: true });
      useUI.getState().notify({ title: 'A hidden category has appeared at the Reva Awards.', body: 'The Academy noticed you looking.', icon: 'trophy', app: 'awards' }, { force: true });
    }, 350);
    return () => clearTimeout(t);
  }, [complete]);

  const onMiss = (e: React.PointerEvent<SVGSVGElement>) => {
    if ((e.target as Element).closest('[data-item]')) return;
    const svg = e.currentTarget.getBoundingClientRect();
    setMiss({ x: ((e.clientX - svg.left) / svg.width) * 320, y: ((e.clientY - svg.top) / svg.height) * 220, k: Date.now() });
    setMisses((m) => m + 1);
  };

  return (
    <div className="find">
      <header className="find__head">
        <div>
          <div className="tag">lost+found · a small search</div>
          <h2>Somewhere in this room…</h2>
        </div>
        <ul className="find__list">
          {ITEMS.map((it) => (
            <li key={it.id} className={found.includes(it.id) ? 'is-found' : ''}>
              {found.includes(it.id) ? '✓' : '○'} {it.label}
            </li>
          ))}
        </ul>
      </header>

      <div className="find__scene">
        <Confetti fire={fire} />
        <svg viewBox="0 0 320 220" className="find__svg" shapeRendering="crispEdges" onPointerDown={onMiss} role="img" aria-label="A small pixel bedroom-study with things hidden in it">
          {/* wall + floor */}
          {R(0, 0, 320, 150, '#ede4d5')}
          {Array.from({ length: 16 }, (_, i) => R(i * 20, 0, 1, 150, '#e2d6c2', `w${i}`))}
          {R(0, 150, 320, 70, '#b98a5e')}
          {Array.from({ length: 7 }, (_, i) => R(0, 156 + i * 10, 320, 1, '#a07448', `f${i}`))}
          {R(0, 148, 320, 3, '#343342')}

          {/* window, night sky */}
          {R(186, 18, 76, 60, '#343342')}
          {R(190, 22, 68, 52, '#2b3a5e')}
          {R(223, 22, 2, 52, '#343342')}
          {R(190, 47, 68, 2, '#343342')}
          {R(240, 28, 6, 6, '#faf7f0')}
          {[198, 210, 232, 250, 204].map((x, i) => R(x, 30 + (i * 7) % 36, 1, 1, '#faf7f0', `s${i}`))}
          {R(182, 78, 84, 4, '#c9a24b')}

          {/* fish bowl on the sill, with the pufferfish */}
          {R(242, 58, 20, 18, '#afc5db')}
          {R(240, 56, 24, 2, '#343342')}
          {R(244, 74, 16, 2, '#343342')}

          {/* bookshelf */}
          {R(12, 40, 70, 96, '#7a5236')}
          {R(16, 44, 62, 88, '#5e3e28')}
          {[68, 96, 124].map((y, i) => R(16, y, 62, 3, '#7a5236', `sh${i}`))}
          {[
            [18, 52, 6, 16, '#d6b9d0'],
            [25, 49, 5, 19, '#afc5db'],
            [31, 54, 7, 14, '#d9d49a'],
            [39, 50, 5, 18, '#d9473b'],
            [46, 52, 8, 16, '#faf7f0'],
            [56, 55, 6, 13, '#6f9a6a'],
            [18, 80, 8, 16, '#2f5bea'],
            [27, 78, 5, 18, '#d6b9d0'],
            [34, 82, 10, 14, '#c9a24b'],
            [60, 79, 6, 17, '#faf7f0'],
            [18, 108, 12, 16, '#d9d49a'],
            [44, 106, 6, 18, '#d9473b'],
            [51, 110, 9, 14, '#afc5db'],
          ].map(([x, y, w, h, c], i) => R(x as number, y as number, w as number, h as number, c as string, `b${i}`))}

          {/* plant pot with the flower */}
          {R(22, 156, 22, 18, '#d9473b')}
          {R(20, 154, 26, 4, '#b63a30')}
          {R(32, 140, 2, 16, '#6f9a6a')}
          {R(26, 146, 6, 3, '#6f9a6a')}
          {R(34, 142, 7, 3, '#6f9a6a')}

          {/* desk */}
          {R(92, 128, 120, 6, '#7a5236')}
          {R(96, 134, 6, 40, '#5e3e28')}
          {R(202, 134, 6, 40, '#5e3e28')}
          {R(150, 134, 52, 22, '#6b4a31')}
          {R(172, 143, 8, 2, '#c9a24b')}
          {/* computer */}
          {R(140, 92, 46, 36, '#e2d6c2')}
          {R(144, 96, 38, 24, '#343342')}
          {R(148, 104, 22, 2, '#d9d49a')}
          {R(148, 109, 14, 2, '#d6b9d0')}
          {R(156, 128, 14, 2, '#c9a24b')}
          {/* lamp */}
          {R(196, 104, 3, 24, '#343342')}
          {R(186, 98, 22, 8, '#d9d49a')}
          {/* mug */}
          {R(100, 118, 8, 10, '#afc5db')}
          {R(108, 120, 3, 5, '#afc5db')}

          {/* wall calendar (tiny) */}
          {R(140, 26, 15, 17, '#faf7f0')}
          {R(140, 26, 15, 5, '#d9473b')}
          {R(144, 34, 7, 1, '#343342')}
          {R(144, 37, 5, 1, '#343342')}
          {/* clock + poster as decoys */}
          {R(98, 30, 16, 16, '#faf7f0')}
          {R(105, 32, 2, 7, '#343342')}
          {R(105, 38, 5, 2, '#343342')}
          {R(276, 30, 30, 40, '#d6b9d0')}
          {R(280, 34, 22, 20, '#afc5db')}
          {R(280, 58, 22, 3, '#343342')}

          {/* rug + note under the corner */}
          {R(150, 182, 90, 24, '#afc5db')}
          {R(154, 186, 82, 16, '#d6b9d0')}
          {R(160, 192, 70, 4, '#faf7f0')}

          {/* chair */}
          {R(118, 150, 26, 5, '#343342')}
          {R(120, 155, 3, 20, '#343342')}
          {R(139, 155, 3, 20, '#343342')}
          {R(140, 120, 3, 32, '#343342')}

          {/* ── the five hidden things ─────────────── */}
          {/* pufferfish in the bowl */}
          <g data-item>
            {R(247, 62, 8, 7, '#d9d49a')}
            {R(255, 64, 3, 3, '#afc5db')}
            {R(249, 64, 2, 2, '#343342')}
            {R(246, 60, 1, 1, '#343342')}
            {R(250, 59, 1, 2, '#343342')}
            {R(254, 60, 1, 1, '#343342')}
          </g>
          {/* flower */}
          <g data-item>
            {R(30, 136, 6, 6, '#e3423a')}
            {R(32, 138, 2, 2, '#2b2a36')}
          </g>
          {/* tiny calendar number */}
          <g data-item>{R(146, 39, 3, 2, '#d9473b')}</g>
          {/* photograph leaning on the desk */}
          <g data-item>
            {R(112, 112, 13, 15, '#ffffff')}
            {p20src ? <image href={p20src} x={113} y={113} width={11} height={11} preserveAspectRatio="xMidYMid meet" /> : R(113, 113, 11, 11, '#afc5db')}
          </g>
          {/* folded message peeking out from under the rug */}
          <g data-item>
            {R(208, 186, 12, 8, '#faf7f0')}
            {R(208, 186, 12, 1, '#343342')}
            {R(213, 189, 2, 2, '#d9473b')}
          </g>

          {/* hit areas */}
          {ITEMS.map((it) => (
            <g key={it.id} data-item onPointerDown={(e) => (e.stopPropagation(), hit(it.id))} style={{ cursor: 'pointer' }}>
              <circle cx={it.x} cy={it.y} r={13} fill="transparent" shapeRendering="auto" />
              {found.includes(it.id) && <circle cx={it.x} cy={it.y} r={11} fill="none" stroke="#2f5bea" strokeWidth={1.5} strokeDasharray="3 2" shapeRendering="auto" />}
              {hint === it.id && <circle className="find__hint" cx={it.x} cy={it.y} r={22} fill="none" stroke="#e5539b" strokeWidth={1.5} shapeRendering="auto" />}
            </g>
          ))}

          {miss && (
            <text key={miss.k} x={miss.x} y={miss.y} className="find__miss" textAnchor="middle" fontSize="9" fontFamily="Silkscreen, monospace" fill="#343342">
              nope
            </text>
          )}
        </svg>

        <AnimatePresence>
          {complete && (
            <motion.div className="find__done" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <b>Everything found.</b>
              <p>A pufferfish, a flower, a 27th, a photograph and a message. That’s more or less the whole story, actually.</p>
              <p className="editor-note">A hidden category is now open at the Reva Awards.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="find__foot">
        <span className="tag">
          {found.length}/{ITEMS.length} found{misses > 2 && !complete ? ' · need a hand?' : ''}
        </span>
        {!complete && (
          <button
            className="btn btn--sm"
            onClick={() => {
              const left = ITEMS.find((i) => !found.includes(i.id));
              if (left) setHint(left.id);
              play('click');
            }}
          >
            Hint
          </button>
        )}
        {complete && (
          <button className="btn btn--sm" onClick={() => (setFound([]), setMisses(0))}>
            Hide them again
          </button>
        )}
      </footer>
    </div>
  );
}
