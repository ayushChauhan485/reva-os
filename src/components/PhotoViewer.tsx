// The one photo viewer every app opens. Photos are shown whole (object-fit:
// contain); zoom/pan never crops the stored file.
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Expand, Heart, Image as ImageIcon, Info, Link2, Maximize, Minus, Plus, Shuffle, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { calendarEvents } from '../data/calendar';
import { flowers } from '../data/flowers';
import { memoryById, dotDate } from '../data/memories';
import { albumNames, dateLabel, getPhoto, photoSize, photoSrc, randomPhoto, type PhotoAsset } from '../lib/photos';
import { photoDims } from '../data/photoLibrary';
import { play } from '../lib/sound';
import { useDesktop } from '../store/desktopStore';
import { useProgress } from '../store/progressStore';
import { useSettings, type WallpaperMode } from '../store/settingsStore';
import { useUI } from '../store/uiStore';
import { useIsPhone } from '../lib/hooks';

const MODES: { id: WallpaperMode; label: string }[] = [
  { id: 'fill', label: 'Fill' },
  { id: 'fit', label: 'Fit' },
  { id: 'centre', label: 'Centre' },
  { id: 'blur', label: 'Blurred' },
];

export function PhotoViewer() {
  const v = useUI((s) => s.viewer);
  return <AnimatePresence>{v && <ViewerInner key="viewer" />}</AnimatePresence>;
}

function ViewerInner() {
  const v = useUI((s) => s.viewer)!;
  const p = getPhoto(v.ids[v.index]);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [info, setInfo] = useState(false);
  const [original, setOriginal] = useState(false);
  const [wpMenu, setWpMenu] = useState(false);
  const fav = useProgress((s) => (p ? s.photoFavourites.includes(p.id) : false));
  const phone = useIsPhone();
  const root = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const ui = useUI.getState();
  const go = (d: number) => ui.setViewerIndex(v.index + d);

  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setOriginal(false);
    setWpMenu(false);
  }, [v.index, v.ids]);

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
    const key = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return;
      if (e.key === 'Escape') {
        if (document.fullscreenElement) return;
        useUI.getState().closeViewer();
      }
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === '+' || e.key === '=') setZoom((z) => Math.min(4, z + 0.5));
      if (e.key === '-') setZoom((z) => Math.max(1, z - 0.5));
      if (e.key === '0') (setZoom(1), setPan({ x: 0, y: 0 }));
      if (e.key.toLowerCase() === 'i') setInfo((x) => !x);
      if (e.key.toLowerCase() === 'f') toggleFav();
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  });

  if (!p) return null;
  const size = photoSize(p, original);
  const src = photoSrc(p, { original })!;
  const edit = photoDims[p.id]?.edit;
  const date = dateLabel(p);

  function toggleFav() {
    if (!p) return;
    play('pop');
    useProgress.getState().togglePhotoFavourite(p.id);
  }

  const fullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void root.current?.requestFullscreen?.().catch(() => {});
  };

  const onPanStart = (e: React.PointerEvent) => {
    if (zoom === 1) return;
    e.preventDefault();
    const sx = e.clientX - pan.x;
    const sy = e.clientY - pan.y;
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    const move = (ev: PointerEvent) => setPan({ x: ev.clientX - sx, y: ev.clientY - sy });
    const up = () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
  };

  const memory = p.relatedMemoryId ? memoryById(p.relatedMemoryId) : undefined;
  const calDate = p.eventAssociation === 'confirmed' ? (p.eventDate ?? null) : null;
  const calEvent = calDate ? calendarEvents.find((e) => e.date === calDate) : undefined;
  const flower = flowers.find((f) => f.photo === p.id || f.handmadePhoto === p.id || f.timeline?.includes(p.id));

  return (
    <motion.div
      ref={root}
      className={`viewer ${info ? 'viewer--info' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo viewer: ${p.title}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <header className="viewer__top">
        <div className="viewer__count mono">
          {v.index + 1} / {v.ids.length}
          {v.random && <span className="viewer__tag">random</span>}
        </div>
        <div className="viewer__tools">
          <button className="vbtn" onClick={() => setZoom((z) => Math.max(1, z - 0.5))} aria-label="Zoom out" disabled={zoom === 1}>
            <Minus size={16} />
          </button>
          <span className="mono viewer__zoom">{Math.round(zoom * 100)}%</span>
          <button className="vbtn" onClick={() => setZoom((z) => Math.min(4, z + 0.5))} aria-label="Zoom in">
            <Plus size={16} />
          </button>
          <button className="vbtn" onClick={() => (setZoom(1), setPan({ x: 0, y: 0 }))} aria-label="Fit to screen / reset zoom">
            <Expand size={16} />
          </button>
          <button className="vbtn" onClick={fullscreen} aria-label="Full screen">
            <Maximize size={16} />
          </button>
          <button className={`vbtn ${fav ? 'is-on' : ''}`} onClick={toggleFav} aria-pressed={fav} aria-label={fav ? 'Remove from favourites' : 'Add to favourites'}>
            <Heart size={16} fill={fav ? 'currentColor' : 'none'} />
          </button>
          <button className={`vbtn ${info ? 'is-on' : ''}`} onClick={() => setInfo(!info)} aria-pressed={info} aria-label="Information">
            <Info size={16} />
          </button>
          <button ref={closeRef} className="vbtn" onClick={() => useUI.getState().closeViewer()} aria-label="Close viewer">
            <X size={16} />
          </button>
        </div>
      </header>

      <div
        className={`viewer__stage ${zoom > 1 ? 'is-zoomed' : ''}`}
        onWheel={(e) => setZoom((z) => Math.min(4, Math.max(1, z - e.deltaY * 0.0025)))}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null || zoom > 1) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
        onClick={(e) => e.target === e.currentTarget && zoom === 1 && useUI.getState().closeViewer()}
      >
        <motion.img
          key={src}
          className="viewer__img"
          src={src}
          alt={p.description ?? p.title}
          width={size.w}
          height={size.h}
          draggable={false}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, aspectRatio: `${size.w} / ${size.h}` }}
          onPointerDown={onPanStart}
          onDoubleClick={() => (zoom > 1 ? (setZoom(1), setPan({ x: 0, y: 0 })) : setZoom(2))}
        />
        {v.ids.length > 1 && (
          <>
            <button className="viewer__nav viewer__nav--prev" onClick={() => go(-1)} aria-label="Previous photo">
              <ChevronLeft />
            </button>
            <button className="viewer__nav viewer__nav--next" onClick={() => go(1)} aria-label="Next photo">
              <ChevronRight />
            </button>
          </>
        )}
      </div>

      <footer className="viewer__caption">
        <div className="viewer__title">{p.title}</div>
        <div className="viewer__meta mono">
          <span className={`date date--${date.kind}`}>{date.text}</span>
          <span>{albumNames(p).join(' · ')}</span>
        </div>
        <div className="viewer__actions">
          {v.random && (
            <button
              className="btn btn--sm"
              onClick={() => {
                const r = randomPhoto(p.id);
                if (r) useUI.getState().openViewer([r.id], 0, { random: true });
              }}
            >
              <Shuffle size={14} /> Another one
            </button>
          )}
          {memory && (
            <button className="btn btn--sm" onClick={() => (useUI.getState().closeViewer(), useDesktop.getState().open('archive', { memoryId: memory.id }))}>
              <Link2 size={14} /> {memory.title}
            </button>
          )}
          <span className="viewer__wp">
            <button className="btn btn--sm" onClick={() => setWpMenu(!wpMenu)} aria-expanded={wpMenu}>
              <ImageIcon size={14} /> Set as wallpaper
            </button>
            {wpMenu && (
              <span className="viewer__wpmenu" role="menu">
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    role="menuitem"
                    onClick={() => {
                      useSettings.getState().set({ wallpaperPhoto: { id: p.id, mode: m.id } });
                      setWpMenu(false);
                      play('click');
                      useUI.getState().notify({ title: 'Wallpaper updated.', body: `${p.title} · ${m.label}`, icon: 'info' }, { force: true });
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </span>
            )}
          </span>
        </div>
      </footer>

      {!phone && v.ids.length > 1 && (
        <nav className="viewer__strip" aria-label="Filmstrip">
          {v.ids.map((id, i) => {
            const q = getPhoto(id);
            if (!q) return null;
            return (
              <button key={id} className={`viewer__thumb ${i === v.index ? 'is-on' : ''}`} onClick={() => useUI.getState().setViewerIndex(i)} aria-label={q.title}>
                <img src={photoSrc(q, { thumb: true }) ?? ''} alt="" loading="lazy" />
              </button>
            );
          })}
        </nav>
      )}

      <AnimatePresence>
        {info && (
          <motion.aside className="viewer__info scroll" initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 40, opacity: 0 }}>
            <h3>{p.title}</h3>
            {p.description && <p>{p.description}</p>}
            <dl>
              <dt>Date</dt>
              <dd>{date.text}</dd>
              <dt>Date status</dt>
              <dd>{p.dateStatus === 'verified' ? 'verified' : p.dateStatus === 'approximate' ? 'approximate (file date, not a capture date)' : 'unknown'}</dd>
              <dt>Event</dt>
              <dd>{p.eventAssociation === 'confirmed' ? 'confirmed' : 'not assigned to an event'}</dd>
              <dt>Albums</dt>
              <dd>{albumNames(p).join(', ')}</dd>
              <dt>Type</dt>
              <dd>{p.kind === 'video-still' ? 'still frame from a video' : 'photograph'} · {size.w}×{size.h}</dd>
              {p.tags.length > 0 && (
                <>
                  <dt>Tags</dt>
                  <dd>{p.tags.map((t) => `#${t}`).join(' ')}</dd>
                </>
              )}
            </dl>
            {edit && (
              <div className="viewer__edit">
                <div className="tag">{edit.approved ? 'shown edited' : 'edit available, not shown'}</div>
                <p>Edit removes {edit.removes}. The original file is untouched.</p>
                {edit.approved && (
                  <button className="btn btn--sm" onClick={() => setOriginal(!original)}>
                    {original ? 'Show edited' : 'Show unedited'}
                  </button>
                )}
              </div>
            )}
            {(memory || calEvent || flower) && (
              <div className="viewer__links">
                <div className="tag">memory connections</div>
                {memory && (
                  <button onClick={() => (useUI.getState().closeViewer(), useDesktop.getState().open('archive', { memoryId: memory.id }))}>Archive · {memory.title} →</button>
                )}
                {calEvent && (
                  <button onClick={() => (useUI.getState().closeViewer(), useDesktop.getState().open('calendar'))}>27th Club · {dotDate(calEvent.date)} →</button>
                )}
                {flower && <button onClick={() => (useUI.getState().closeViewer(), useDesktop.getState().open('flowers'))}>Flower Department · {flower.name} →</button>}
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export type { PhotoAsset };
