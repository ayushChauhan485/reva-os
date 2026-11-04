// Transient UI: toasts, the notification centre, the lightbox, the pufferfish.
import { create } from 'zustand';
import type { AppId } from '../data/apps';
import { play } from '../lib/sound';
import { useSettings } from './settingsStore';
import { useProgress } from './progressStore';

export interface Toast {
  id: number;
  title: string;
  body?: string;
  app?: AppId;
  icon?: 'info' | 'trophy' | 'puffer' | 'flower' | 'lock';
  time: Date;
}

interface UIState {
  toasts: Toast[];
  history: Toast[];
  unread: number;
  /** the shared photo viewer: ids from the registry */
  viewer: { ids: string[]; index: number; random?: boolean } | null;
  slideshow: { source: string; startId?: string } | null;
  pufferSummon: number;
  screensaver: boolean;
  bootKey: number;
  notify: (t: Omit<Toast, 'id' | 'time'>, opts?: { force?: boolean }) => void;
  dismiss: (id: number) => void;
  markRead: () => void;
  clearHistory: () => void;
  openViewer: (ids: string[], index?: number, opts?: { random?: boolean }) => void;
  setViewerIndex: (i: number) => void;
  closeViewer: () => void;
  openSlideshow: (source: string, startId?: string) => void;
  closeSlideshow: () => void;
  summonPufferfish: () => void;
  setScreensaver: (on: boolean) => void;
  reboot: () => void;
}

let nextId = 1;

export const useUI = create<UIState>()((set, get) => ({
  toasts: [],
  history: [],
  unread: 0,
  viewer: null,
  slideshow: null,
  pufferSummon: 0,
  screensaver: false,
  bootKey: 0,

  /** `force` = an event toast (e.g. new trophy); random ones respect the setting upstream. */
  notify: (t, opts) => {
    const toast: Toast = { ...t, id: nextId++, time: new Date() };
    const enabled = useSettings.getState().notifications;
    set({ history: [toast, ...get().history].slice(0, 30), unread: get().unread + 1 });
    if (!enabled && !opts?.force) return;
    play('notify');
    set({ toasts: [...get().toasts, toast].slice(-3) });
    window.setTimeout(() => get().dismiss(toast.id), 6500);
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
  markRead: () => set({ unread: 0 }),
  clearHistory: () => set({ history: [], unread: 0 }),

  openViewer: (ids, index = 0, opts) => {
    if (!ids.length) return;
    set({ viewer: { ids, index, random: opts?.random } });
    useProgress.getState().viewedPhoto(ids[index]);
  },
  setViewerIndex: (i) => {
    const v = get().viewer;
    if (!v) return;
    const n = v.ids.length;
    const index = (i + n) % n;
    set({ viewer: { ...v, index } });
    useProgress.getState().viewedPhoto(v.ids[index]);
  },
  closeViewer: () => set({ viewer: null }),
  openSlideshow: (source, startId) => set({ slideshow: { source, startId } }),
  closeSlideshow: () => set({ slideshow: null }),
  summonPufferfish: () => set({ pufferSummon: get().pufferSummon + 1 }),
  setScreensaver: (on) => set({ screensaver: on }),
  reboot: () => set({ bootKey: get().bootKey + 1 }),
}));
