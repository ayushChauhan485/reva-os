// Small shared pieces: photos with fallbacks, chat bubbles, hidden pufferfish.
import { useState, type CSSProperties } from 'react';
import { photo as getPhoto, photos as getPhotos } from '../data/assets';
import { msg, senderLabel, testimony } from '../data/curatedContent';
import type { AssetKey } from '../data/types';
import type { HiddenSpot } from '../data/easterEggs';
import { hiddenPufferfish } from '../data/easterEggs';
import { useProgress } from '../store/progressStore';
import { useUI } from '../store/uiStore';
import { play } from '../lib/sound';
import { Pufferfish } from './AppIcon';

export function Img({
  asset,
  full = false,
  className,
  style,
  openable,
  group,
}: {
  asset: AssetKey;
  full?: boolean;
  className?: string;
  style?: CSSProperties;
  /** Open in the lightbox on click/Enter. Pass `group` to page through siblings. */
  openable?: boolean;
  group?: AssetKey[];
}) {
  const p = getPhoto(asset);
  const [broken, setBroken] = useState(false);
  if (!p || broken) {
    return (
      <div className={`placeholder-box ${className ?? ''}`} style={{ display: 'grid', placeItems: 'center', minHeight: 120, ...style }}>
        Photo missing: {asset}
        <br />
        run npm run assets
      </div>
    );
  }
  const img = (
    <img
      src={full ? p.src : p.thumb}
      alt={p.alt}
      width={p.width}
      height={p.height}
      loading="lazy"
      decoding="async"
      className={className}
      style={style}
      onError={() => setBroken(true)}
      draggable={false}
    />
  );
  if (!openable) return img;
  const items = getPhotos(group ?? [asset]);
  const index = Math.max(0, items.findIndex((x) => x.key === asset));
  return (
    <button className="img-btn" aria-label={`Open photo: ${p.alt}`} onClick={() => useUI.getState().openLightbox(items, index)}>
      {img}
    </button>
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
        useUI.getState().notify(
          n === total
            ? { title: `All ${total} hidden pufferfish found.`, body: 'The fish are impressed. The fish are rarely impressed.', icon: 'puffer' }
            : { title: `Hidden pufferfish spotted (${n}/${total}).`, body: 'There are more of us.', icon: 'puffer' },
          { force: true },
        );
      }}
    >
      <Pufferfish size={22} />
    </button>
  );
}
