// Full-screen slideshow. Photographs only; captions come from the registry.
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Pause, Play, Volume2, VolumeX, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { albumPhotos, dateLabel, photoSrc, trustedDate, viewablePhotos, visibleAlbums, type PhotoAsset } from '../lib/photos';
import { play } from '../lib/sound';
import { useProgress } from '../store/progressStore';
import { useUI } from '../store/uiStore';
import { prefersReducedMotion } from '../store/settingsStore';

type Order = 'library' | 'random' | 'date';

/** Resolves 'all' | 'favourites' | album id to viewable photographs. */
export function sourcePhotos(source: string): PhotoAsset[] {
  const ok = new Set(viewablePhotos().map((p) => p.id));
  if (source === 'favourites') {
    const favs = useProgress.getState().photoFavourites;
    return viewablePhotos().filter((p) => favs.includes(p.id));
  }
  if (source === 'all') return viewablePhotos();
  return albumPhotos(source as Parameters<typeof albumPhotos>[0]).filter((p) => ok.has(p.id));
}

function order(xs: PhotoAsset[], o: Order) {
  if (o === 'random') return [...xs].sort(() => Math.random() - 0.5);
  if (o === 'date') {
    // verified/confirmed dates first in order; the rest keep library order after them
    const dated = xs.filter((p) => trustedDate(p)).sort((a, b) => trustedDate(a)!.localeCompare(trustedDate(b)!));
    return [...dated, ...xs.filter((p) => !trustedDate(p))];
  }
  return xs;
}

export function Slideshow() {
  const s = useUI((st) => st.slideshow);
  return <AnimatePresence>{s && <Inner key="ss" />}</AnimatePresence>;
}

function Inner() {
  const s = useUI((st) => st.slideshow)!;
  const [source, setSource] = useState(s.source);
  const [ord, setOrd] = useState<Order>('library');
  const [playing, setPlaying] = useState(true);
  const [interval, setIntervalS] = useState(5);
  const [captions, setCaptions] = useState(true);
  const [sound, setSound] = useState(false);
  const [i, setI] = useState(0);
  const [chrome, setChrome] = useState(true);
  const hide = useRef(0);

  const list = useMemo(() => order(sourcePhotos(source), ord), [source, ord]);

  useEffect(() => {
    const start = s.startId ? list.findIndex((p) => p.id === s.startId) : 0;
    setI(Math.max(0, start));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);

  useEffect(() => {
    if (!playing || list.length < 2) return;
    const t = window.setTimeout(() => setI((n) => (n + 1) % list.length), interval * 1000);
    return () => clearTimeout(t);
  }, [playing, i, interval, list.length]);

  useEffect(() => {
    if (sound) play('notify');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') useUI.getState().closeSlideshow();
      if (e.key === 'ArrowRight') setI((n) => (n + 1) % Math.max(1, list.length));
      if (e.key === 'ArrowLeft') setI((n) => (n - 1 + list.length) % Math.max(1, list.length));
      if (e.key === ' ') {
        e.preventDefault();
        setPlaying((x) => !x);
      }
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [list.length]);

  const poke = () => {
    setChrome(true);
    clearTimeout(hide.current);
    hide.current = window.setTimeout(() => setChrome(false), 2800);
  };

  const p = list[i];
  const reduce = prefersReducedMotion();

  return (
    <motion.div className={`slideshow ${chrome ? '' : 'slideshow--quiet'}`} role="dialog" aria-modal="true" aria-label="Slideshow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onPointerMove={poke} onClick={poke}>
      <AnimatePresence mode="popLayout">
        {p ? (
          <motion.figure
            key={p.id + i}
            className="slideshow__frame"
            initial={{ opacity: 0, scale: reduce ? 1 : 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
          >
            <PhotoFill p={p} />
            {captions && (
              <figcaption>
                <b>{p.title}</b>
                <span className="mono">{dateLabel(p).text}</span>
              </figcaption>
            )}
          </motion.figure>
        ) : (
          <p className="slideshow__empty">No photographs in this selection yet.</p>
        )}
      </AnimatePresence>

      <div className="slideshow__bar">
        <button className="vbtn" onClick={() => setI((n) => (n - 1 + list.length) % Math.max(1, list.length))} aria-label="Previous">
          <ChevronLeft size={16} />
        </button>
        <button className="vbtn" onClick={() => setPlaying(!playing)} aria-label={playing ? 'Pause' : 'Play'}>
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button className="vbtn" onClick={() => setI((n) => (n + 1) % Math.max(1, list.length))} aria-label="Next">
          <ChevronRight size={16} />
        </button>
        <span className="mono slideshow__count">
          {list.length ? i + 1 : 0}/{list.length}
        </span>
        <select className="slideshow__sel" value={source} onChange={(e) => setSource(e.target.value)} aria-label="Album">
          <option value="all">All photographs</option>
          <option value="favourites">Favourites</option>
          {visibleAlbums().map((a) => (
            <option key={a.id} value={a.id}>
              {a.title}
            </option>
          ))}
        </select>
        <select className="slideshow__sel" value={ord} onChange={(e) => setOrd(e.target.value as Order)} aria-label="Order">
          <option value="library">Library order</option>
          <option value="random">Random</option>
          <option value="date">By verified date</option>
        </select>
        <label className="slideshow__range">
          <span className="mono">{interval}s</span>
          <input type="range" min={2} max={12} value={interval} onChange={(e) => setIntervalS(Number(e.target.value))} aria-label="Seconds per photo" />
        </label>
        <button className={`vbtn ${captions ? 'is-on' : ''}`} onClick={() => setCaptions(!captions)} aria-pressed={captions} aria-label="Captions">
          Aa
        </button>
        <button className={`vbtn ${sound ? 'is-on' : ''}`} onClick={() => setSound(!sound)} aria-pressed={sound} aria-label="Sound">
          {sound ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
        <button className="vbtn" onClick={() => useUI.getState().closeSlideshow()} aria-label="Close slideshow">
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
}

/** Photo on a blurred copy of itself, so portraits never get cropped. */
export function PhotoFill({ p, className }: { p: PhotoAsset; className?: string }) {
  const src = srcOf(p);
  return (
    <div className={`pfill ${className ?? ''}`}>
      <div className="pfill__blur" style={{ backgroundImage: `url(${srcOf(p, true)})` }} />
      <img className="pfill__img" src={src} alt={p.description ?? p.title} />
    </div>
  );
}

function srcOf(p: PhotoAsset, thumb = false) {
  return photoSrc(p, { thumb }) ?? '';
}
