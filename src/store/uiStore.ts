// Transient UI: toasts, the notification centre, the lightbox, the pufferfish.
import { create } from 'zustand';
import type { AppId } from '../data/apps';
import type { Photo } from '../data/types';
import { play } from '../lib/sound';
import { useSettings } from './settingsStore';

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
  lightbox: { items: Photo[]; index: number } | null;
  pufferSummon: number;
  screensaver: boolean;
  bootKey: number;
  notify: (t: Omit<Toast, 'id' | 'time'>, opts?: { force?: boolean }) => void;
  dismiss: (id: number) => void;
  markRead: () => void;
  clearHistory: () => void;
  openLightbox: (items: Photo[], index?: number) => void;
  setLightboxIndex: (i: number) => void;
  closeLightbox: () => void;
  summonPufferfish: () => void;
  setScreensaver: (on: boolean) => void;
  reboot: () => void;
}

let nextId = 1;

export const useUI = create<UIState>()((set, get) => ({
  toasts: [],
  history: [],
  unread: 0,
  lightbox: null,
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

  openLightbox: (items, index = 0) => items.length && set({ lightbox: { items, index } }),
  setLightboxIndex: (i) => {
    const lb = get().lightbox;
    if (!lb) return;
    const n = lb.items.length;
    set({ lightbox: { ...lb, index: (i + n) % n } });
  },
  closeLightbox: () => set({ lightbox: null }),
  summonPufferfish: () => set({ pufferSummon: get().pufferSummon + 1 }),
  setScreensaver: (on) => set({ screensaver: on }),
  reboot: () => set({ bootKey: get().bootKey + 1 }),
}));
