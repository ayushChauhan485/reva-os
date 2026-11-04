// Small shared pieces: photos with fallbacks, chat bubbles, hidden pufferfish.
import { useState, type CSSProperties } from 'react';
import { msg, senderLabel, testimony } from '../data/curatedContent';
import { GAP, type PhotoId } from '../data/types';
import type { HiddenSpot } from '../data/easterEggs';
import { hiddenPufferfish } from '../data/easterEggs';
import { getPhoto, isDeveloped, photoSize, photoSrc, SECRET_BY_EGG, viewablePhotos } from '../lib/photos';
import { useProgress } from '../store/progressStore';
import { useUI } from '../store/uiStore';
import { play } from '../lib/sound';
import { Pufferfish } from './AppIcon';

/** A registry photo. `openable` opens the shared viewer; `group` pages through siblings. */
export function Img({
  id,
  full = false,
  className,
  style,
  openable,
  group,
}: {
  id: PhotoId;
  full?: boolean;
  className?: string;
  style?: CSSProperties;
  openable?: boolean;
  group?: PhotoId[];
}) {
  const p = getPhoto(id);
  const developed = useProgress((s) => s.developed);
  const [broken, setBroken] = useState(false);
  const src = p ? photoSrc(p, { thumb: !full }) : null;
  if (!p || !src || broken) {
    return (
      <div className={`placeholder-box ${className ?? ''}`} style={{ display: 'grid', placeItems: 'center', minHeight: 120, ...style }}>
        Photo missing: {id}
        <br />
        run npm run assets
      </div>
    );
  }
  if (!isDeveloped(p, developed)) return <div className={`undeveloped ${className ?? ''}`} style={style} aria-label="An undeveloped photograph" />;
  const size = photoSize(p);
  const img = (
    <img
      src={src}
      alt={p.description ?? p.title}
      width={size.w}
      height={size.h}
      loading="lazy"
      decoding="async"
      className={className}
      style={{ objectPosition: p.focus, ...style }}
      onError={() => setBroken(true)}
      draggable={false}
    />
  );
  if (!openable) return img;
  return (
    <button className="img-btn" aria-label={`Open photo: ${p.title}`} onClick={() => openPhotos(group ?? [id], id)}>
      {img}
    </button>
  );
}

/** Opens the viewer on `id`, paging through `ids` (only viewable ones). */
export function openPhotos(ids: PhotoId[], id?: PhotoId) {
  const ok = new Set(viewablePhotos().map((p) => p.id));
  const list = ids.filter((x) => ok.has(x));
  useUI.getState().openViewer(list, Math.max(0, id ? list.indexOf(id) : 0));
}

/** A run of chat messages; GAP entries render as "lines omitted". */
export function ChatThread({ ids, compact }: { ids: string[]; compact?: boolean }) {
  return (
    <>
      {ids.map((id, i) =>
        id === GAP ? (
          <div key={`gap${i}`} className="bubble-gap" aria-label="messages omitted">
            · · ·
          </div>
        ) : (
          <ChatBubble key={id} id={id} compact={compact} />
        ),
      )}
    </>
  );
}

export function ChatBubble({ id, compact }: { id: string; compact?: boolean }) {
  const m = msg(id);
  const mine = m.sender === 'Ayush';
  return (
    <div className={`bubble ${mine ? 'bubble--ruru' : 'bubble--reva'} ${compact ? 'bubble--compact' : ''}`}>
      <div className="bubble__text">{m.text}</div>
      <div className="bubble__meta">
        {senderLabel[m.sender]} · {m.date.replace(/\//g, '.')} · {m.time}
      </div>
    </div>
  );
}

export function TestimonyCard({ id }: { id: string }) {
  const t = testimony[id];
  return (
    <blockquote className="testimony">
      <p>“{t.text}”</p>
      <footer>
        — {t.witness}, <span>{t.source}</span>
      </footer>
    </blockquote>
  );
}

/** A tiny pufferfish tucked into an app. Five exist. */
export function HiddenPuffer({ spot, style }: { spot: HiddenSpot; style?: CSSProperties }) {
  const found = useProgress((s) => s.hiddenFound.includes(spot));
  return (
    <button
      className={`hidden-puffer ${found ? 'hidden-puffer--found' : ''}`}
      style={style}
      aria-label={found ? 'A pufferfish you already found' : 'A small pufferfish'}
      onClick={(e) => {
        e.stopPropagation();
        play('pop');
        const n = useProgress.getState().findHidden(spot);
        if (n === null) return;
        const total = hiddenPufferfish.length;
        if (n === total) useProgress.getState().develop(SECRET_BY_EGG.pufferfish);
        useUI.getState().notify(
          n === total
            ? { title: `All ${total} hidden pufferfish found.`, body: 'A photograph has developed in photos.exe.', icon: 'puffer', app: 'photos' }
            : { title: `Hidden pufferfish spotted (${n}/${total}).`, body: 'There are more of us.', icon: 'puffer' },
          { force: true },
        );
      }}
    >
      <Pufferfish size={22} />
    </button>
  );
}
