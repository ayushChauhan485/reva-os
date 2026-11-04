import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { config, type WallpaperId } from '../config';
import { safeStorage } from '../lib/storage';

export type MotionPref = 'system' | 'reduced' | 'full';
/** No mode crops the photo: fit = whole photo on a blurred surround, centre = smaller, plain = cream surround. */
export type WallpaperMode = 'fit' | 'centre' | 'plain';
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
    {
      name: 'revaos.settings',
      storage: safeStorage,
      version: 1,
      // v0 had cropping modes ('fill', 'blur'); both become 'fit'
      migrate: (state, version) => {
        const s = state as Partial<SettingsState> & { wallpaperPhoto?: { id: string; mode: string } | null };
        if (version < 1 && s.wallpaperPhoto && !['fit', 'centre', 'plain'].includes(s.wallpaperPhoto.mode)) {
          s.wallpaperPhoto = { id: s.wallpaperPhoto.id, mode: 'fit' };
        }
        return s as SettingsState;
      },
    },
  ),
);

const mq = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

export function prefersReducedMotion(pref: MotionPref = useSettings.getState().motion) {
  if (pref === 'reduced') return true;
  if (pref === 'full') return false;
  return !!mq?.matches;
}
