import { motion } from 'motion/react';
import { useRef, type PointerEvent as RPointerEvent, type ReactNode } from 'react';
import { apps } from '../data/apps';
import { MENUBAR_H, useDesktop, type WindowState } from '../store/desktopStore';
import { useMediaQuery } from '../lib/hooks';

interface Props {
  win: WindowState;
  focused: boolean;
  children: ReactNode;
  /** Theme hook for apps that restyle their chrome (awards, terminal). */
  variant?: string;
}

export function Window({ win, focused, children, variant }: Props) {
  const meta = apps[win.id];
  const { focus, close, minimize, toggleMaximize, setRect } = useDesktop.getState();
  const ref = useRef<HTMLDivElement>(null);
  const phone = useMediaQuery('(max-width: 640px)');
  const canResize = useMediaQuery('(min-width: 1024px) and (pointer: fine)');

  const max = win.maximized && !phone;
  const style = max
    ? { left: 0, top: MENUBAR_H, width: '100%', height: `calc(100% - ${MENUBAR_H}px)`, zIndex: win.z }
    : { left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z };

  function startDrag(e: RPointerEvent) {
    if (phone || max || e.button !== 0) return;
    if ((e.target as HTMLElement).closest('button')) return;
    const el = ref.current;
    if (!el) return;
    const sx = e.clientX;
    const sy = e.clientY;
    const ox = win.x;
    const oy = win.y;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const move = (ev: PointerEvent) => {
      el.style.left = `${ox + ev.clientX - sx}px`;
      el.style.top = `${Math.max(MENUBAR_H, oy + ev.clientY - sy)}px`;
    };
    const up = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      setRect(win.id, { x: ox + ev.clientX - sx, y: oy + ev.clientY - sy });
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  function startResize(e: RPointerEvent) {
    e.stopPropagation();
    const el = ref.current;
    if (!el) return;
    const min = meta.minSize ?? { w: 380, h: 300 };
    const sx = e.clientX;
    const sy = e.clientY;
    const ow = win.w;
    const oh = win.h;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const size = (ev: PointerEvent) => ({
      w: Math.max(min.w, Math.min(window.innerWidth - win.x - 4, ow + ev.clientX - sx)),
      h: Math.max(min.h, Math.min(window.innerHeight - win.y - 4, oh + ev.clientY - sy)),
    });
    const move = (ev: PointerEvent) => {
      const s = size(ev);
      el.style.width = `${s.w}px`;
      el.style.height = `${s.h}px`;
    };
    const up = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      setRect(win.id, size(ev));
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  return (
    <motion.section
      ref={ref}
      role="dialog"
      aria-label={meta.title}
      aria-hidden={win.minimized || undefined}
      className={`win ${focused ? 'win--focused' : ''} ${max ? 'win--max' : ''} ${win.minimized ? 'win--hidden' : ''} ${variant ? `win--${variant}` : ''}`}
      style={style}
      initial={{ opacity: 0, scale: 0.94, y: 16 }}
      animate={win.minimized ? { opacity: 0, scale: 0.3, y: 400 } : { opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 10, transition: { duration: 0.14 } }}
      transition={{ type: 'spring', stiffness: 420, damping: 34, mass: 0.8 }}
      onPointerDownCapture={() => focus(win.id)}
      onFocusCapture={() => focus(win.id)}
    >
      <header className="win__bar" onPointerDown={startDrag} onDoubleClick={() => !phone && toggleMaximize(win.id)}>
        <div className="win__controls">
          <button className="win__ctl win__ctl--close" aria-label={`Close ${meta.title}`} onClick={() => close(win.id)}>
            <svg viewBox="0 0 10 10">
              <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
          <button className="win__ctl win__ctl--min" aria-label={`Minimise ${meta.title}`} onClick={() => minimize(win.id)}>
            <svg viewBox="0 0 10 10">
              <path d="M2 5h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
          <button className="win__ctl win__ctl--max" aria-label={max ? 'Restore size' : 'Maximise'} onClick={() => toggleMaximize(win.id)}>
            <svg viewBox="0 0 10 10">
              {max ? (
                <path d="M3 1.5h5.5V7M1.5 3h5.5v5.5H1.5z" fill="none" stroke="currentColor" strokeWidth="1.3" />
              ) : (
                <rect x="1.8" y="1.8" width="6.4" height="6.4" fill="none" stroke="currentColor" strokeWidth="1.5" />
              )}
            </svg>
          </button>
        </div>
        <div className="win__title">
          <span>{meta.title}</span>
        </div>
        <div className="win__file">{meta.file}</div>
      </header>
      <div className="win__body">{children}</div>
      {canResize && !max && <div className="win__resize" onPointerDown={startResize} aria-hidden="true" />}
    </motion.section>
  );
}
