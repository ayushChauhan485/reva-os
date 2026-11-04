// THE WALL OF REVA — a gallery wall / contact sheet / memory board.
import { Maximize, Shuffle } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { photoSize, photoSrc, viewablePhotos } from '../../lib/photos';
import { play } from '../../lib/sound';
import { useUI } from '../../store/uiStore';

type Layout = 'organic' | 'neat';

function shuffle<T>(xs: T[]) {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function Wall({ fullscreenOnly }: { fullscreenOnly?: boolean }) {
  const [layout, setLayout] = useState<Layout>('organic');
  const [density, setDensity] = useState(4);
  const [seed, setSeed] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const photos = useMemo(() => {
    const pool = viewablePhotos().filter((p) => p.kind === 'photo');
    return seed ? shuffle(pool) : pool;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed]);
  // stable tilt per photo, so hovering doesn't reshuffle
  const tilt = useMemo(() => Object.fromEntries(photos.map((p, i) => [p.id, ((i * 37 + seed * 13) % 9) - 4])), [photos, seed]);

  const open = (id: string) => {
    const ids = photos.map((p) => p.id);
    useUI.getState().openViewer(ids, ids.indexOf(id));
  };

  return (
    <div className="wall" ref={ref}>
      <header className="wall__head">
        <div>
          <div className="tag">photos.exe / studio</div>
          <h2>The Wall of Reva</h2>
        </div>
        <div className="wall__controls">
          <div className="seg" role="radiogroup" aria-label="Layout">
            {(['organic', 'neat'] as Layout[]).map((l) => (
              <button key={l} className="chip" role="radio" aria-checked={layout === l} aria-pressed={layout === l} onClick={() => setLayout(l)}>
                {l === 'organic' ? 'Organic collage' : 'Neat grid'}
              </button>
            ))}
          </div>
          <label className="wall__density">
            <span className="tag">density</span>
            <input type="range" min={2} max={7} value={density} onChange={(e) => setDensity(Number(e.target.value))} aria-label="Density" />
          </label>
          <button className="btn btn--sm" onClick={() => (play('paper'), setSeed((s) => s + 1))}>
            <Shuffle size={14} /> Shuffle
          </button>
          {!fullscreenOnly && (
            <button className="btn btn--sm" onClick={() => void ref.current?.requestFullscreen?.().catch(() => {})}>
              <Maximize size={14} /> Full screen
            </button>
          )}
        </div>
      </header>

      <div className={`wall__board wall__board--${layout}`} style={{ columnCount: layout === 'organic' ? density : undefined, gridTemplateColumns: layout === 'neat' ? `repeat(${density}, 1fr)` : undefined }}>
        {photos.map((p) => {
          const s = photoSize(p);
          return (
            <button
              key={p.id}
              className="wall__pin"
              style={layout === 'organic' ? ({ '--tilt': `${tilt[p.id]}deg` } as React.CSSProperties) : undefined}
              onClick={() => open(p.id)}
              aria-label={`Open ${p.title}`}
            >
              <img className="photo"
                src={photoSrc(p, { thumb: true }) ?? ''}
                alt={p.title}
                loading="lazy"
                width={s.w}
                height={s.h}
                style={layout === 'neat' ? { aspectRatio: '1' } : undefined}
              />
              {layout === 'organic' && <span className="wall__label">{p.title}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
