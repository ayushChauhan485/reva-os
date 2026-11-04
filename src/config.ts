// Site-wide settings you may want to change without touching components.
export type WallpaperId = 'paper' | 'powder' | 'night';

/** Pattern wallpapers. Any photo can also be set as wallpaper from photos.exe. */
export const wallpapers: { id: WallpaperId; label: string }[] = [
  { id: 'paper', label: 'Cream paper' },
  { id: 'powder', label: 'Powder blue' },
  { id: 'night', label: 'After midnight' },
];

export const config = {
  userName: 'Reva',
  makerName: 'Ruru',
  version: '21.0',
  /** Default wallpaper pattern. */
  wallpaper: 'paper' as WallpaperId,
  /** Default photo wallpaper (photo id + mode), or null for the pattern. */
  wallpaperPhoto: null as null | { id: string; mode: 'fit' | 'centre' | 'plain' },
  /** Photos of the two of you (album 02 and couple photos elsewhere). Turn off for a public version. */
  showPrivateAlbums: true,
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
