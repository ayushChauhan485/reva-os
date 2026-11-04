// MAKE A MEMORY STRIP — pick 3 or 4 photos, caption them, export PNG/JPEG.
// Dates are printed only when the photo has a verified/confirmed date.
import { Download, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { dotDate } from '../../data/memories';
import { getPhoto, photoSrc, trustedDate, viewablePhotos } from '../../lib/photos';
import { play } from '../../lib/sound';

const FRAME_W = 520;
const FRAME_H = 390;
const PAD = 34;
const GAP = 22;
const HEAD = 60;
const FOOT = 120;

type Theme = 'dark' | 'cream';

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}

/** draws the whole `img` inside the box on a mat (like object-fit: contain): nothing is cropped */
function drawContain(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number, mat: string) {
  ctx.fillStyle = mat;
  ctx.fillRect(x, y, w, h);
  const scale = Math.min(w / img.width, h / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

export function StripMaker() {
  const pool = viewablePhotos().filter((p) => p.kind === 'photo');
  const [picked, setPicked] = useState<string[]>([]);
  const [captions, setCaptions] = useState<Record<string, string>>({});
  const [theme, setTheme] = useState<Theme>('cream');
  const [showDates, setShowDates] = useState(true);
  const [title, setTitle] = useState('');
  const canvas = useRef<HTMLCanvasElement>(null);

  const toggle = (id: string) => {
    play('click');
    setPicked((xs) => (xs.includes(id) ? xs.filter((x) => x !== id) : xs.length >= 4 ? xs : [...xs, id]));
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const c = canvas.current;
      if (!c) return;
      const n = Math.max(picked.length, 3);
      c.width = FRAME_W + PAD * 2;
      c.height = HEAD + n * FRAME_H + (n - 1) * GAP + FOOT;
      const ctx = c.getContext('2d');
      if (!ctx) return;
      await document.fonts.ready;
      const ink = theme === 'dark' ? '#f3eddf' : '#343342';
      ctx.fillStyle = theme === 'dark' ? '#1d1c25' : '#f4ecdf';
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = ink;
      ctx.font = '22px Silkscreen, monospace';
      ctx.textBaseline = 'middle';
      ctx.fillText('REVA.EXE', PAD, HEAD / 2 + 4);
      ctx.font = '15px "IBM Plex Mono", monospace';
      ctx.textAlign = 'right';
      ctx.fillText('memory strip · v21.0', c.width - PAD, HEAD / 2 + 4);
      ctx.textAlign = 'left';
      for (let i = 0; i < n; i++) {
        const y = HEAD + i * (FRAME_H + GAP);
        const p = picked[i] ? getPhoto(picked[i]) : undefined;
        if (!p) {
          ctx.strokeStyle = theme === 'dark' ? '#4a4656' : '#c9bda7';
          ctx.setLineDash([8, 6]);
          ctx.strokeRect(PAD + 0.5, y + 0.5, FRAME_W - 1, FRAME_H - 1);
          ctx.setLineDash([]);
          continue;
        }
        try {
          const img = await loadImage(photoSrc(p)!);
          if (cancelled) return;
          drawContain(ctx, img, PAD, y, FRAME_W, FRAME_H, theme === 'dark' ? '#2b2a36' : '#e6ddcc');
        } catch {
          /* missing file: leave the frame empty */
        }
        const cap = captions[p.id]?.trim();
        const d = showDates ? trustedDate(p) : null;
        if (cap || d) {
          const grad = ctx.createLinearGradient(0, y + FRAME_H - 70, 0, y + FRAME_H);
          grad.addColorStop(0, 'rgba(0,0,0,0)');
          grad.addColorStop(1, 'rgba(0,0,0,0.55)');
          ctx.fillStyle = grad;
          ctx.fillRect(PAD, y + FRAME_H - 70, FRAME_W, 70);
          ctx.fillStyle = '#fff';
          if (cap) {
            ctx.font = '30px Caveat, cursive';
            ctx.fillText(cap, PAD + 16, y + FRAME_H - 26, FRAME_W - 150);
          }
          if (d) {
            ctx.font = '14px "IBM Plex Mono", monospace';
            ctx.textAlign = 'right';
            ctx.fillStyle = '#f5d98a';
            ctx.fillText(dotDate(d), PAD + FRAME_W - 14, y + FRAME_H - 24);
            ctx.textAlign = 'left';
          }
        }
      }
      ctx.fillStyle = ink;
      ctx.font = '40px Caveat, cursive';
      ctx.fillText(title.trim() || ' ', PAD, c.height - FOOT / 2);
      ctx.font = '16px "IBM Plex Mono", monospace';
      ctx.textAlign = 'right';
      ctx.fillText('— Ruru 🐡', c.width - PAD, c.height - FOOT / 2);
      ctx.textAlign = 'left';
    })();
    return () => {
      cancelled = true;
    };
  }, [picked, captions, theme, showDates, title]);

  const download = (type: 'png' | 'jpeg') => {
    const c = canvas.current;
    if (!c || picked.length < 3) return;
    c.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reva-memory-strip.${type === 'png' ? 'png' : 'jpg'}`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
        play('complete');
      },
      `image/${type}`,
      0.92,
    );
  };

  return (
    <div className="strip">
      <header className="wall__head">
        <div>
          <div className="tag">photos.exe / studio</div>
          <h2>Make a memory strip</h2>
          <p className="editor-note">Pick three or four. Dates appear only where they’re verified.</p>
        </div>
        <div className="wall__controls">
          <div className="seg" role="radiogroup" aria-label="Border">
            {(['cream', 'dark'] as Theme[]).map((t) => (
              <button key={t} className="chip" role="radio" aria-checked={theme === t} aria-pressed={theme === t} onClick={() => setTheme(t)}>
                {t} border
              </button>
            ))}
          </div>
          <label className="chip" style={{ cursor: 'pointer' }}>
            <input type="checkbox" checked={showDates} onChange={(e) => setShowDates(e.target.checked)} /> verified dates
          </label>
        </div>
      </header>

      <div className="strip__grid">
        <div>
          <div className="tag">{picked.length}/4 selected</div>
          <div className="strip__pool">
            {pool.map((p) => {
              const i = picked.indexOf(p.id);
              return (
                <button key={p.id} className={`strip__pick ${i >= 0 ? 'is-on' : ''}`} onClick={() => toggle(p.id)} aria-pressed={i >= 0} aria-label={`${i >= 0 ? 'Remove' : 'Add'} ${p.title}`} disabled={i < 0 && picked.length >= 4}>
                  <img className="photo" src={photoSrc(p, { thumb: true }) ?? ''} alt="" loading="lazy" />
                  {i >= 0 && <span className="strip__num">{i + 1}</span>}
                </button>
              );
            })}
          </div>
          {picked.length > 0 && (
            <div className="strip__captions">
              <div className="tag">captions (optional)</div>
              {picked.map((id, i) => (
                <label key={id} className="strip__cap">
                  <span className="mono">{i + 1}</span>
                  <input className="field" maxLength={36} placeholder={getPhoto(id)?.title} value={captions[id] ?? ''} onChange={(e) => setCaptions({ ...captions, [id]: e.target.value })} />
                </label>
              ))}
              <label className="strip__cap">
                <span className="mono">✎</span>
                <input className="field" maxLength={28} placeholder="A title for the strip (optional)" value={title} onChange={(e) => setTitle(e.target.value)} />
              </label>
            </div>
          )}
        </div>
        <div className="strip__preview">
          <canvas ref={canvas} className={`strip__canvas strip__canvas--${theme}`} aria-label="Memory strip preview" />
          <div className="strip__actions">
            <button className="btn btn--sm btn--primary" disabled={picked.length < 3} onClick={() => download('png')}>
              <Download size={14} /> PNG
            </button>
            <button className="btn btn--sm" disabled={picked.length < 3} onClick={() => download('jpeg')}>
              <Download size={14} /> JPEG
            </button>
            <button className="btn btn--sm btn--ghost" onClick={() => (setPicked([]), setCaptions({}), setTitle(''))} disabled={!picked.length}>
              <RotateCcw size={14} /> Start over
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
