import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { config, type WallpaperId } from '../config';
import { safeStorage } from '../lib/storage';

export type MotionPref = 'system' | 'reduced' | 'full';
export type WallpaperMode = 'fill' | 'fit' | 'centre' | 'blur';
export type SaverStyle = 'filmstrip' | 'polaroid' | 'drift';

interface SettingsState {
  sound: boolean;
  volume: number;
  motion: MotionPref;
  notifications: boolean;
  screensaver: boolean;
  pufferfish: boolean;
  wallpaper: WallpaperId;
  wallpaperPhoto: { id: string; mode: WallpaperMode } | null;
  /** 'all' | 'favourites' | an album id */
  saverSource: string;
  saverStyle: SaverStyle;
  saverShuffle: boolean;
  saverSound: boolean;
  set: (patch: Partial<Omit<SettingsState, 'set'>>) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      sound: true,
      volume: 0.6,
      motion: 'system',
      notifications: true,
      screensaver: true,
      pufferfish: true,
      wallpaper: config.wallpaper,
      wallpaperPhoto: config.wallpaperPhoto,
      saverSource: 'all',
      saverStyle: 'polaroid',
      saverShuffle: true,
      saverSound: false,
      set: (patch) => set(patch),
    }),
    { name: 'revaos.settings', storage: safeStorage },
  ),
);

const mq = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

export function prefersReducedMotion(pref: MotionPref = useSettings.getState().motion) {
  if (pref === 'reduced') return true;
  if (pref === 'full') return false;
  return !!mq?.matches;
}
