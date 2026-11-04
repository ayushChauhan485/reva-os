// Window manager state: which windows exist, where, and in what order.
import { create } from 'zustand';
import { apps, type AppId } from '../data/apps';
import { play } from '../lib/sound';

export const MENUBAR_H = 30;
export const DOCK_SPACE = 84;

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface WindowState extends Rect {
  id: AppId;
  z: number;
  minimized: boolean;
  maximized: boolean;
  /** Incremented each time the window is (re)opened, to replay the open animation. */
  session: number;
}

/** Per-app payloads, e.g. "open the archive at this memory". */
export type Intent = { app: AppId; memoryId?: string; albumId?: string; nonce: number };

interface DesktopState {
  windows: Partial<Record<AppId, WindowState>>;
  focused: AppId | null;
  topZ: number;
  intent: Intent | null;
  open: (id: AppId, opts?: { memoryId?: string; albumId?: string }) => void;
  close: (id: AppId) => void;
  focus: (id: AppId) => void;
  minimize: (id: AppId) => void;
  toggleMaximize: (id: AppId) => void;
  setRect: (id: AppId, r: Partial<Rect>) => void;
  dockClick: (id: AppId) => void;
  minimizeAll: () => void;
  closeAll: () => void;
}

let cascade = 0;

function initialRect(id: AppId): Rect {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const { w, h } = apps[id].size;
  const W = Math.min(w, vw - 40);
  const H = Math.min(h, vh - MENUBAR_H - DOCK_SPACE - 20);
  const step = (cascade++ % 6) * 28;
  const x = Math.max(12, Math.round((vw - W) / 2 - 80 + step));
  const y = Math.max(MENUBAR_H + 12, Math.round((vh - H - DOCK_SPACE) / 2 - 30 + step));
  return { x, y, w: W, h: H };
}

export function clampRect(r: Rect): Rect {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  // keep at least 120px of the title bar reachable
  const x = Math.min(Math.max(r.x, -r.w + 120), vw - 120);
  const y = Math.min(Math.max(r.y, MENUBAR_H), vh - 48);
  return { ...r, x, y };
}

export const useDesktop = create<DesktopState>()((set, get) => ({
  windows: {},
  focused: null,
  topZ: 10,
  intent: null,

  open: (id, opts) => {
    const { windows, topZ } = get();
    const existing = windows[id];
    const z = topZ + 1;
    const intent = opts?.memoryId || opts?.albumId ? { app: id, memoryId: opts.memoryId, albumId: opts.albumId, nonce: Date.now() } : get().intent;
    if (existing) {
      if (existing.minimized) play('open');
      set({
        windows: { ...windows, [id]: { ...existing, minimized: false, z } },
        focused: id,
        topZ: z,
        intent,
      });
      return;
    }
    play('open');
    set({
      windows: {
        ...windows,
        [id]: { id, ...initialRect(id), z, minimized: false, maximized: false, session: Date.now() },
      },
      focused: id,
      topZ: z,
      intent,
    });
  },

  close: (id) => {
    const { [id]: _gone, ...rest } = get().windows;
    play('close');
    const next = topVisible(rest);
    set({ windows: rest, focused: next });
  },

  focus: (id) => {
    const { windows, topZ, focused } = get();
    const w = windows[id];
    if (!w || (focused === id && w.z === topZ)) return;
    const z = topZ + 1;
    set({ windows: { ...windows, [id]: { ...w, z } }, focused: id, topZ: z });
  },

  minimize: (id) => {
    const { windows } = get();
    const w = windows[id];
    if (!w) return;
    play('minimize');
    const next = { ...windows, [id]: { ...w, minimized: true } };
    set({ windows: next, focused: topVisible(next) });
  },

  toggleMaximize: (id) => {
    const { windows } = get();
    const w = windows[id];
    if (!w) return;
    set({ windows: { ...windows, [id]: { ...w, maximized: !w.maximized } } });
  },

  setRect: (id, r) => {
    const { windows } = get();
    const w = windows[id];
    if (!w) return;
    set({ windows: { ...windows, [id]: { ...w, ...clampRect({ ...w, ...r }) } } });
  },

  dockClick: (id) => {
    const { windows, focused } = get();
    const w = windows[id];
    if (!w) return get().open(id);
    if (w.minimized) return get().open(id);
    if (focused === id) return get().minimize(id);
    get().focus(id);
  },

  minimizeAll: () => {
    const { windows } = get();
    const next = Object.fromEntries(Object.entries(windows).map(([k, w]) => [k, { ...w!, minimized: true }]));
    set({ windows: next, focused: null });
  },

  closeAll: () => set({ windows: {}, focused: null }),
}));

function topVisible(ws: Partial<Record<AppId, WindowState>>): AppId | null {
  const vis = Object.values(ws).filter((w) => w && !w.minimized) as WindowState[];
  if (!vis.length) return null;
  return vis.sort((a, b) => b.z - a.z)[0].id;
}

export const hasVisibleWindows = () => Object.values(useDesktop.getState().windows).some((w) => w && !w.minimized);
