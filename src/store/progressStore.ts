// Things Reva has done or found. Persisted locally so a revisit remembers.
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { safeStorage } from '../lib/storage';
import type { HiddenSpot } from '../data/easterEggs';

interface ProgressState {
  revealedAwards: string[];
  votes: Record<string, number>;
  closingSeen: boolean;
  secretUnlocked: boolean;
  gameComplete: boolean;
  hiddenFound: HiddenSpot[];
  soReva: Record<string, number>;
  favourites: string[];
  lastMemory: string | null;
  bouquetsMade: number;
  photoFavourites: string[];
  recentPhotos: string[];
  /** secret photos that have been unlocked */
  developed: string[];
  revealAward: (id: string) => boolean;
  vote: (poll: string, option: number) => void;
  findHidden: (spot: HiddenSpot) => number | null;
  toggleFavourite: (id: string) => void;
  togglePhotoFavourite: (id: string) => void;
  viewedPhoto: (id: string) => void;
  develop: (id: string) => boolean;
  bump: (id: string) => void;
  patch: (p: Partial<ProgressState>) => void;
  reset: () => void;
}

const initial = {
  revealedAwards: [] as string[],
  votes: {} as Record<string, number>,
  closingSeen: false,
  secretUnlocked: false,
  gameComplete: false,
  hiddenFound: [] as HiddenSpot[],
  soReva: {} as Record<string, number>,
  favourites: [] as string[],
  lastMemory: null as string | null,
  bouquetsMade: 0,
  photoFavourites: [] as string[],
  recentPhotos: [] as string[],
  developed: [] as string[],
};

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...initial,
      /** returns true if this is a new reveal */
      revealAward: (id) => {
        if (get().revealedAwards.includes(id)) return false;
        set({ revealedAwards: [...get().revealedAwards, id] });
        return true;
      },
      vote: (poll, option) => set({ votes: { ...get().votes, [poll]: option } }),
      /** returns new count, or null if already found */
      findHidden: (spot) => {
        if (get().hiddenFound.includes(spot)) return null;
        const next = [...get().hiddenFound, spot];
        set({ hiddenFound: next });
        return next.length;
      },
      toggleFavourite: (id) => {
        const f = get().favourites;
        set({ favourites: f.includes(id) ? f.filter((x) => x !== id) : [...f, id] });
      },
      togglePhotoFavourite: (id) => {
        const f = get().photoFavourites;
        set({ photoFavourites: f.includes(id) ? f.filter((x) => x !== id) : [...f, id] });
      },
      viewedPhoto: (id) => set({ recentPhotos: [id, ...get().recentPhotos.filter((x) => x !== id)].slice(0, 12) }),
      /** returns true if newly developed */
      develop: (id) => {
        if (get().developed.includes(id)) return false;
        set({ developed: [...get().developed, id] });
        return true;
      },
      bump: (id) => set({ soReva: { ...get().soReva, [id]: (get().soReva[id] ?? 0) + 1 } }),
      patch: (p) => set(p),
      reset: () => set(initial),
    }),
    { name: 'revaos.progress', storage: safeStorage },
  ),
);
