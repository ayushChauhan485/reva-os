// Site-wide settings you may want to change without touching components.
import type { AssetKey } from './data/types';

export type WallpaperId = 'paper' | 'powder' | 'night' | 'photo-golden' | 'photo-archive';

export const wallpapers: { id: WallpaperId; label: string; photo?: AssetKey }[] = [
  { id: 'paper', label: 'Cream paper' },
  { id: 'powder', label: 'Powder blue' },
  { id: 'night', label: 'After midnight' },
  { id: 'photo-golden', label: 'Golden hour (photo)', photo: 'portraitGoldenHour' },
  { id: 'photo-archive', label: 'The archivist (photo)', photo: 'archiveHero' },
];

export const config = {
  userName: 'Reva',
  makerName: 'Ruru',
  version: '21.0',
  /** Default wallpaper. Swap to a photo id from `wallpapers` above. */
  wallpaper: 'paper' as WallpaperId,
  /** Seconds of inactivity before the screensaver (only when no window is open). */
  screensaverAfter: 50,
  /** Random notification spacing, in seconds. */
  notificationEvery: [80, 150] as [number, number],
  /** Wandering pufferfish spacing, in seconds. */
  pufferfishEvery: [40, 85] as [number, number],
  /** Today's date override for testing, e.g. '2026-11-27'. Leave null in production. */
  todayOverride: null as string | null,
};

export function today(): Date {
  return config.todayOverride ? new Date(`${config.todayOverride}T12:00:00`) : new Date();
}
