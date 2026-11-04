// Drag flowers around, or just tap: tap a stem to add, tap a flower to select,
// then remove or turn it. Works without drag on phones.
import { AnimatePresence, motion } from 'motion/react';
import { RotateCw, Shuffle, Sparkles, Trash2, Wand2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { HiddenPuffer } from '../../components/common';
import { Pufferfish } from '../../components/AppIcon';
import { bouquetCopy, stems, type StemId } from '../../data/flowers';
import { play } from '../../lib/sound';
import { useProgress } from '../../store/progressStore';
import { StemHead } from './FlowerArt';

interface Placed {
  uid: number;
  stem: StemId;
  x: number; // 0..1 across the arrangement area
  y: number; // 0..1 down the arrangement area
  rot: number;
}

const VASES = ['glass', 'ceramic', 'jar'] as const;
type Vase = (typeof VASES)[number];

const W = 320;
const H = 360;
const MOUTH = { x: 160, y: 250 };

let uid = 1;

export function BouquetStudio() {
  const [items, setItems] = useState<Placed[]>([]);
  const [sel, setSel] = useState<number | null>(null);
  const [vase, setVase] = useState<Vase>('glass');
  const [done, setDone] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const add = (stem: StemId) => {
    if (items.length >= 18) return;
    play('pop');
    const n = items.length;
    const p: Placed = { uid: uid++, stem, x: 0.5 + (Math.random() - 0.5) * 0.6, y: 0.18 + Math.random() * 0.35, rot: (Math.random() - 0.5) * 40 };
    if (n === 0) p.x = 0.5;
    setItems([...items, p]);
    setSel(p.uid);
    setDone(false);
  };

  const update = (id: number, patch: Partial<Placed>) => setItems((xs) => xs.map((x) => (x.uid === id ? { ...x, ...patch } : x)));

  const remove = (id: number) => {
    play('close');
    setItems((xs) => xs.filter((x) => x.uid !== id));
    setSel(null);
  };

  const arrange = () => {
    play('click');
    const n = items.length;
    setItems((xs) =>
      xs.map((x, i) => {
        const t = n === 1 ? 0.5 : i / (n - 1);
        const row = i % 2;
        return { ...x, x: 0.14 + t * 0.72, y: 0.16 + row * 0.16 + Math.abs(t - 0.5) * 0.3, rot: (t - 0.5) * 50 };
      }),
    );
  };

  const shuffle = () => {
    play('click');
    setItems((xs) => xs.map((x) => ({ ...x, x: 0.15 + Math.random() * 0.7, y: 0.12 + Math.random() * 0.45, rot: (Math.random() - 0.5) * 50 })));
  };

  const onDrag = (e: React.PointerEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    setSel(id);
    const svg = svgRef.current;
    if (!svg) return;
    const target = e.currentTarget as SVGGElement;
    target.setPointerCapture(e.pointerId);
    let moved = false;
    const toLocal = (ev: { clientX: number; clientY: number }) => {
      const r = svg.getBoundingClientRect();
      return { x: Math.min(0.95, Math.max(0.05, (ev.clientX - r.left) / r.width)), y: Math.min(0.66, Math.max(0.05, ((ev.clientY - r.top) / r.height) * (H / (MOUTH.y + 10)))) };
    };
    const move = (ev: PointerEvent) => {
      moved = true;
      update(id, toLocal(ev));
    };
    const up = () => {
      target.removeEventListener('pointermove', move);
      target.removeEventListener('pointerup', up);
      if (moved) play('click');
    };
    target.addEventListener('pointermove', move);
    target.addEventListener('pointerup', up);
  };

  const pos = (p: Placed) => ({ x: p.x * W, y: p.y * (MOUTH.y + 10) });
  const selected = items.find((x) => x.uid === sel);

  return (
    <div className="studio">
      <div className="studio__palette" aria-label="Add a flower">
        <div className="tag">tap to add a stem</div>
        <div className="studio__stems">
          {stems.map((s) => (
            <button key={s.id} className="studio__stem" onClick={() => add(s.id)} aria-label={`Add ${s.label}`}>
              <svg viewBox="-30 -30 60 60" width="46" height="46" aria-hidden="true">
                <StemHead id={s.id} />
              </svg>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
        <div className="tag" style={{ marginTop: 14 }}>
          vase
        </div>
        <div className="studio__vases">
          {VASES.map((v) => (
            <button key={v} className="chip" aria-pressed={vase === v} onClick={() => setVase(v)}>
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="studio__stage">
        <div className="studio__toolbar">
          <button className="btn btn--sm" onClick={arrange} disabled={items.length < 2}>
            <Wand2 size={14} /> Arrange
          </button>
          <button className="btn btn--sm" onClick={shuffle} disabled={items.length < 2}>
            <Shuffle size={14} /> Shuffle
          </button>
          <button className="btn btn--sm btn--ghost" onClick={() => (setItems([]), setSel(null), setDone(false))} disabled={!items.length}>
            Reset
          </button>
        </div>

        <div className="studio__canvas">
          <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="studio__svg" onPointerDown={(e) => e.target === e.currentTarget && setSel(null)} role="img" aria-label={`Bouquet with ${items.length} flowers`}>
            <ellipse cx={MOUTH.x} cy={H - 8} rx="110" ry="8" fill="rgba(52,51,66,0.12)" />
            {items.map((p) => {
              const { x, y } = pos(p);
              return <path key={`s${p.uid}`} d={`M${MOUTH.x + (x - MOUTH.x) * 0.15} ${MOUTH.y + 30} Q ${MOUTH.x + (x - MOUTH.x) * 0.3} ${(y + MOUTH.y) / 2} ${x} ${y}`} fill="none" stroke="#5e8a5a" strokeWidth="2.6" strokeLinecap="round" />;
            })}
            {items.map((p) => {
              const { x, y } = pos(p);
              return (
                <g
                  key={p.uid}
                  transform={`translate(${x} ${y}) rotate(${p.rot}) scale(1.35)`}
                  className={`studio__flower ${sel === p.uid ? 'is-sel' : ''}`}
                  onPointerDown={(e) => onDrag(e, p.uid)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${stems.find((s) => s.id === p.stem)?.label}, selected: ${sel === p.uid}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Delete' || e.key === 'Backspace') remove(p.uid);
                    if (e.key === 'Enter') setSel(p.uid);
                  }}
                >
                  {sel === p.uid && <circle r="30" fill="none" stroke="#2f5bea" strokeDasharray="4 3" strokeWidth="1.5" />}
                  <StemHead id={p.stem} />
                </g>
              );
            })}
            <Vase kind={vase} />
          </svg>
          <HiddenPuffer spot="flowers" style={{ position: 'absolute', right: '22%', bottom: 18, transform: 'scale(.8)', opacity: 0.75 }} />

          {items.length === 0 && <p className="studio__empty">An empty vase. Add a stem to begin.</p>}

          <AnimatePresence>
            {done && (
              <motion.div className="studio__done" initial={{ opacity: 0, y: 14, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}>
                <motion.div className="studio__done-fish" initial={{ y: 40, rotate: -20 }} animate={{ y: 0, rotate: 0 }} transition={{ delay: 0.5, type: 'spring' }}>
                  <Pufferfish size={44} />
                </motion.div>
                <p className="studio__done-title">{bouquetCopy.done}</p>
                <p className="editor-note">{bouquetCopy.surprise}</p>
                <button className="btn btn--sm" onClick={() => setDone(false)}>
                  Keep arranging
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="studio__actions">
          {selected ? (
            <>
              <span className="tag">{stems.find((s) => s.id === selected.stem)?.label} selected · drag to move</span>
              <button className="btn btn--sm" onClick={() => update(selected.uid, { rot: selected.rot + 20 })}>
                <RotateCw size={14} /> Turn
              </button>
              <button className="btn btn--sm" onClick={() => remove(selected.uid)}>
                <Trash2 size={14} /> Remove
              </button>
            </>
          ) : (
            <span className="tag">{items.length ? `${items.length} stems · tap one to select` : ' '}</span>
          )}
          <button
            className="btn btn--sm btn--primary"
            style={{ marginLeft: 'auto' }}
            disabled={items.length < 3}
            onClick={() => {
              play('complete');
              setSel(null);
              setDone(true);
              useProgress.getState().patch({ bouquetsMade: useProgress.getState().bouquetsMade + 1 });
            }}
            title={items.length < 3 ? 'Add at least three stems' : undefined}
          >
            <Sparkles size={14} /> Finish bouquet
          </button>
        </div>
      </div>
    </div>
  );
}

function Vase({ kind }: { kind: Vase }) {
  const stroke = { stroke: '#343342', strokeWidth: 2, strokeLinejoin: 'round' as const };
  if (kind === 'glass')
    return (
      <g>
        <path d="M118 244 h84 l-6 20 c 18 22 14 64 -6 88 h-60 c -20 -24 -24 -66 -6 -88 z" fill="rgba(175,197,219,0.45)" {...stroke} />
        <path d="M128 300 c 20 6 44 6 64 0" fill="none" stroke="#5e8a5a" strokeWidth="1.5" opacity="0.6" />
        <path d="M134 270 c -6 20 -6 48 4 70" fill="none" stroke="#fff" strokeWidth="3" opacity="0.6" strokeLinecap="round" />
      </g>
    );
  if (kind === 'ceramic')
    return (
      <g>
        <path d="M122 244 h76 c 0 14 -8 18 -8 24 c 24 18 28 56 8 84 h-76 c -20 -28 -16 -66 8 -84 c 0 -6 -8 -10 -8 -24 z" fill="#faf7f0" {...stroke} />
        <path d="M120 300 h80" stroke="#d6b9d0" strokeWidth="6" />
        <path d="M120 312 h80" stroke="#afc5db" strokeWidth="3" />
      </g>
    );
  return (
    <g>
      <rect x="112" y="244" width="96" height="108" rx="14" fill="#d9d49a" {...stroke} />
      <rect x="106" y="238" width="108" height="16" rx="4" fill="#c9a24b" {...stroke} />
      <rect x="130" y="284" width="60" height="34" rx="3" fill="#faf7f0" {...stroke} />
      <text x="160" y="306" textAnchor="middle" fontFamily="Caveat, cursive" fontSize="17" fill="#343342">
        for Reva
      </text>
    </g>
  );
}
