// Toasts, lightbox, screensaver, the wandering pufferfish and the
// background schedulers that drive them.
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { config } from '../config';
import { photos, portraitKeys } from '../data/assets';
import { pufferLines, randomNotes, screensaverLines } from '../data/easterEggs';
import { pick, rand, useNow } from '../lib/hooks';
import { play } from '../lib/sound';
import { hasVisibleWindows, useDesktop } from '../store/desktopStore';
import { prefersReducedMotion, useSettings } from '../store/settingsStore';
import { useUI } from '../store/uiStore';
import { Pufferfish } from './AppIcon';

const ICONS = { info: 'ℹ︎', trophy: '🏆', puffer: '🐡', flower: '✿', lock: '🔒' };

export function Toasts() {
  const toasts = useUI((s) => s.toasts);
  return (
    <div className="toasts" aria-live="polite">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, transition: { duration: 0.16 } }}
          >
            <div className="toast" role="status">
              <span className={`toast__icon toast__icon--${t.icon ?? 'info'}`} aria-hidden="true">
                {ICONS[t.icon ?? 'info']}
              </span>
              <button
                style={{ all: 'unset', cursor: t.app ? 'pointer' : 'default', minWidth: 0 }}
                onClick={() => {
                  if (t.app) useDesktop.getState().open(t.app);
                  useUI.getState().dismiss(t.id);
                }}
              >
                <div className="toast__meta">Reva OS{t.app ? ' · click to open' : ''}</div>
                <div className="toast__title">{t.title}</div>
                {t.body && <div className="toast__body">{t.body}</div>}
              </button>
              <button className="toast__x" aria-label="Dismiss" onClick={() => useUI.getState().dismiss(t.id)}>
                <X size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function Lightbox() {
  const lb = useUI((s) => s.lightbox);
  const [zoom, setZoom] = useState(false);
  const touchX = useRef<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!lb) return;
    setZoom(false);
    closeRef.current?.focus();
    const key = (e: KeyboardEvent) => {
      const ui = useUI.getState();
      if (e.key === 'Escape') ui.closeLightbox();
      if (e.key === 'ArrowRight') ui.setLightboxIndex((ui.lightbox?.index ?? 0) + 1);
      if (e.key === 'ArrowLeft') ui.setLightboxIndex((ui.lightbox?.index ?? 0) - 1);
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [lb?.items, lb?.index]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatePresence>
      {lb && (
        <motion.div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && useUI.getState().closeLightbox()}
        >
          <div className="lightbox__top">
            <span>
              {lb.index + 1} / {lb.items.length}
            </span>
            <span style={{ display: 'flex', gap: 8 }}>
              <button className="icon-btn" aria-label={zoom ? 'Fit to screen' : 'View full size'} onClick={() => setZoom(!zoom)}>
                {zoom ? <ZoomOut size={16} /> : <ZoomIn size={16} />}
              </button>
              <button ref={closeRef} className="icon-btn" aria-label="Close photo viewer" onClick={() => useUI.getState().closeLightbox()}>
                <X size={16} />
              </button>
            </span>
          </div>
          {(() => {
            const p = lb.items[lb.index];
            return (
              <>
                <div
                  className={`lightbox__stage ${zoom ? 'lightbox__stage--zoom' : ''}`}
                  onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
                  onTouchEnd={(e) => {
                    if (touchX.current === null || zoom) return;
                    const dx = e.changedTouches[0].clientX - touchX.current;
                    if (Math.abs(dx) > 50) useUI.getState().setLightboxIndex(lb.index + (dx < 0 ? 1 : -1));
                    touchX.current = null;
                  }}
                >
                  <motion.img
                    key={p.src}
                    className="lightbox__img"
                    src={p.src}
                    alt={p.alt}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setZoom(!zoom)}
                  />
                  {lb.items.length > 1 && (
                    <>
                      <button className="lightbox__nav lightbox__nav--prev" aria-label="Previous photo" onClick={() => useUI.getState().setLightboxIndex(lb.index - 1)}>
                        <ChevronLeft />
                      </button>
                      <button className="lightbox__nav lightbox__nav--next" aria-label="Next photo" onClick={() => useUI.getState().setLightboxIndex(lb.index + 1)}>
                        <ChevronRight />
                      </button>
                    </>
                  )}
                </div>
                <div className="lightbox__caption">
                  <b>{p.caption ?? p.alt}</b>
                  {p.date && <span>{p.date}</span>}
                </div>
              </>
            );
          })()}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Idle screensaver. Never starts while a window, photo or letter is open. */
export function Screensaver() {
  const on = useUI((s) => s.screensaver);
  const enabled = useSettings((s) => s.screensaver);
  const [i, setI] = useState(0);
  const now = useNow(1000);
  const pics = photos(portraitKeys);

  useEffect(() => {
    if (!enabled) return;
    let t = 0;
    const reset = () => {
      if (useUI.getState().screensaver) useUI.getState().setScreensaver(false);
      clearTimeout(t);
      t = window.setTimeout(() => {
        const ui = useUI.getState();
        if (!hasVisibleWindows() && !ui.lightbox && document.visibilityState === 'visible') ui.setScreensaver(true);
        else reset();
      }, config.screensaverAfter * 1000);
    };
    const evs = ['pointerdown', 'pointermove', 'keydown', 'wheel', 'touchstart'] as const;
    evs.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();
    return () => {
      clearTimeout(t);
      evs.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [enabled]);

  useEffect(() => {
    if (!on) return;
    const t = window.setInterval(() => setI((n) => n + 1), 7000);
    return () => clearInterval(t);
  }, [on]);

  const reduce = prefersReducedMotion();
  const p = pics.length ? pics[i % pics.length] : null;

  return (
    <AnimatePresence>
      {on && (
        <motion.div className="saver" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} aria-hidden="true">
          <AnimatePresence>
            {p && (
              <motion.div
                key={i}
                className="saver__photo"
                style={{ backgroundImage: `url(${p.src})` }}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 0.75, scale: reduce ? 1.08 : 1 }}
                exit={{ opacity: 0 }}
                transition={{ opacity: { duration: 1.6 }, scale: { duration: 8, ease: 'linear' } }}
              />
            )}
          </AnimatePresence>
          <div className="saver__veil" />
          <div className="saver__text">
            <div className="saver__clock">{now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div>
            <AnimatePresence mode="wait">
              <motion.div key={i} className="saver__line" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {screensaverLines[i % screensaverLines.length]}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Occasional system notifications. */
export function NotificationScheduler() {
  useEffect(() => {
    let t = 0;
    let last = -1;
    const schedule = (first = false) => {
      const [a, b] = config.notificationEvery;
      t = window.setTimeout(
        () => {
          const ui = useUI.getState();
          if (useSettings.getState().notifications && !ui.screensaver && !ui.lightbox && document.visibilityState === 'visible') {
            let idx = Math.floor(Math.random() * randomNotes.length);
            if (idx === last) idx = (idx + 1) % randomNotes.length;
            last = idx;
            const n = randomNotes[idx];
            ui.notify({ ...n, icon: n.app === 'awards' ? 'trophy' : n.app === 'flowers' ? 'flower' : 'info' });
          }
          schedule();
        },
        first ? 22_000 : rand(a, b) * 1000,
      );
    };
    schedule(true);
    return () => clearTimeout(t);
  }, []);
  return null;
}

/** The pufferfish occasionally swims across the desktop. */
export function WanderingPufferfish() {
  const enabled = useSettings((s) => s.pufferfish);
  const summon = useUI((s) => s.pufferSummon);
  const [trip, setTrip] = useState<{ id: number; y: number; ltr: boolean } | null>(null);
  const [puffed, setPuffed] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let t = 0;
    const go = () => {
      const [a, b] = config.pufferfishEvery;
      t = window.setTimeout(() => {
        if (!useUI.getState().screensaver && document.visibilityState === 'visible') launch();
        go();
      }, rand(a, b) * 1000);
    };
    go();
    return () => clearTimeout(t);
  }, [enabled]);

  useEffect(() => {
    if (summon) launch();
  }, [summon]);

  function launch() {
    setPuffed(false);
    const id = Date.now();
    setTrip({ id, y: rand(0.25, 0.7) * window.innerHeight, ltr: Math.random() > 0.4 });
    // with reduced motion it simply appears, waits, and leaves
    if (prefersReducedMotion()) window.setTimeout(() => setTrip((t) => (t?.id === id ? null : t)), 9000);
  }

  const reduce = prefersReducedMotion();
  const w = typeof window !== 'undefined' ? window.innerWidth : 1200;

  return (
    <AnimatePresence>
      {trip && (
        <motion.button
          key={trip.id}
          className="puffer"
          aria-label="A pufferfish is swimming by. Click it."
          style={{ top: trip.y, left: 0, scaleX: trip.ltr ? -1 : 1 }}
          initial={reduce ? { x: w - 90, opacity: 0 } : { x: trip.ltr ? -80 : w + 20 }}
          animate={
            reduce
              ? { x: w - 90, opacity: 1 }
              : { x: trip.ltr ? [-80, w * 0.45, w * 0.55, w + 20] : [w + 20, w * 0.55, w * 0.45, -80], y: [0, -18, 14, -6] }
          }
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          transition={reduce ? { duration: 0.4 } : { duration: 16, times: [0, 0.42, 0.62, 1], ease: 'easeInOut' }}
          onAnimationComplete={() => !reduce && setTrip(null)}
          onClick={() => {
            play('pop');
            setPuffed(true);
            const line = pick(pufferLines);
            const toTerminal = Math.random() < 0.35;
            useUI.getState().notify(
              { title: line, body: toTerminal ? 'Ruru.exe would like a word.' : undefined, icon: 'puffer', app: toTerminal ? 'terminal' : undefined },
              { force: true },
            );
            window.setTimeout(() => setTrip(null), 900);
          }}
        >
          <Pufferfish puffed={puffed} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
