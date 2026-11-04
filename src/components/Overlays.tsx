// Toasts, screensaver, the wandering pufferfish and the
// background schedulers that drive them.
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { config } from '../config';
import { photoSrc } from '../lib/photos';
import { PhotoFill, sourcePhotos } from './Slideshow';
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

/** Idle screensaver. Never starts while a window, photo, slideshow or letter is open. */
export function Screensaver() {
  const on = useUI((s) => s.screensaver);
  const enabled = useSettings((s) => s.screensaver);

  useEffect(() => {
    if (!enabled) return;
    let t = 0;
    const reset = () => {
      if (useUI.getState().screensaver) useUI.getState().setScreensaver(false);
      clearTimeout(t);
      t = window.setTimeout(() => {
        const ui = useUI.getState();
        if (!hasVisibleWindows() && !ui.viewer && !ui.slideshow && document.visibilityState === 'visible') ui.setScreensaver(true);
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

  return <AnimatePresence>{on && <SaverInner key="saver" />}</AnimatePresence>;
}

function SaverInner() {
  const { saverSource, saverStyle, saverShuffle, saverSound } = useSettings();
  const now = useNow(1000);
  const [i, setI] = useState(0);
  const reduce = prefersReducedMotion();
  const pics = useMemo(() => {
    let xs = sourcePhotos(saverSource).filter((p) => p.kind === 'photo');
    if (!xs.length) xs = sourcePhotos('all').filter((p) => p.kind === 'photo');
    return saverShuffle ? [...xs].sort(() => Math.random() - 0.5) : xs;
  }, [saverSource, saverShuffle]);

  useEffect(() => {
    const t = window.setInterval(() => setI((n) => n + 1), saverStyle === 'filmstrip' ? 4000 : 6500);
    return () => clearInterval(t);
  }, [saverStyle]);

  useEffect(() => {
    if (!saverSound) return;
    play('ambient');
  }, [i, saverSound]);

  const p = pics.length ? pics[i % pics.length] : null;
  const line = screensaverLines[i % screensaverLines.length];

  return (
    <motion.div className={`saver saver--${saverStyle}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} aria-hidden="true">
      {saverStyle === 'drift' && (
        <AnimatePresence>
          {p && (
            <motion.div
              key={i}
              className="saver__photo"
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 0.8, scale: reduce ? 1.06 : 1 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 1.6 }, scale: { duration: 9, ease: 'linear' } }}
            >
              <PhotoFill p={p} />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {saverStyle === 'polaroid' && (
        <div className="saver__table">
          <AnimatePresence>
            {[0, 1, 2].map((k) => {
              const q = pics.length ? pics[(i + k) % pics.length] : null;
              if (!q) return null;
              const rot = ((i + k) * 47) % 14 - 7;
              return (
                <motion.figure
                  key={`${q.id}-${i + k}`}
                  className={`saver__polaroid saver__polaroid--${k}`}
                  initial={{ opacity: 0, y: reduce ? 0 : 40, rotate: rot - 4 }}
                  animate={{ opacity: 1, y: 0, rotate: rot }}
                  exit={{ opacity: 0, transition: { duration: 0.6 } }}
                  transition={{ duration: 1.2, delay: k * 0.15 }}
                >
                  <img src={photoSrc(q, { thumb: k > 0 }) ?? ''} alt="" style={{ objectPosition: q.focus }} />
                  <figcaption>{q.title}</figcaption>
                </motion.figure>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {saverStyle === 'filmstrip' && (
        <div className="saver__film">
          <motion.div className="saver__film-track" animate={{ x: `calc(50vw - ${(i % Math.max(1, pics.length)) * 340 + 160}px)` }} transition={{ duration: reduce ? 0 : 1.4, ease: [0.4, 0, 0.2, 1] }}>
            {pics.map((q, n) => (
              <div key={q.id} className={`saver__film-frame ${n === i % pics.length ? 'is-on' : ''}`}>
                <img src={photoSrc(q, { thumb: true }) ?? ''} alt="" style={{ objectPosition: q.focus }} />
              </div>
            ))}
          </motion.div>
        </div>
      )}

      <div className="saver__veil" />
      <div className="saver__text">
        <div className="saver__clock">{now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div>
        <AnimatePresence mode="wait">
          <motion.div key={i} className="saver__line" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {p && saverStyle !== 'polaroid' ? `${p.title} · ${line}` : line}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
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
          if (useSettings.getState().notifications && !ui.screensaver && !ui.viewer && !ui.slideshow && document.visibilityState === 'visible') {
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
