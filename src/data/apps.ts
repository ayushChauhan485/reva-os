// App registry: desktop icon file names, window titles and default sizes.
export type AppId =
  | 'archive'
  | 'photos'
  | 'flowers'
  | 'dictionary'
  | 'calendar'
  | 'awards'
  | 'terminal'
  | 'classified'
  | 'settings'
  | 'lostfound'
  | 'about';

export interface AppMeta {
  id: AppId;
  file: string;
  title: string;
  size: { w: number; h: number };
  minSize?: { w: number; h: number };
  /** Counts toward "7 applications available" */
  core: boolean;
}

export const apps: Record<AppId, AppMeta> = {
  archive: { id: 'archive', file: 'our_archive.exe', title: 'Our Archive', size: { w: 860, h: 600 }, core: true },
  photos: { id: 'photos', file: 'photos.exe', title: 'Reva Photo Library', size: { w: 1060, h: 680 }, minSize: { w: 560, h: 420 }, core: true },
  flowers: { id: 'flowers', file: 'flower.exe', title: 'The Flower Department', size: { w: 880, h: 620 }, core: true },
  dictionary: { id: 'dictionary', file: 'reva_isms.exe', title: 'The Reva Dictionary', size: { w: 760, h: 600 }, core: true },
  calendar: { id: 'calendar', file: 'the_27th.exe', title: 'The 27th Club', size: { w: 860, h: 600 }, core: true },
  awards: { id: 'awards', file: 'reva_awards.exe', title: 'The 21st Reva Awards', size: { w: 960, h: 660 }, minSize: { w: 520, h: 460 }, core: true },
  terminal: { id: 'terminal', file: 'ruru.exe', title: 'Ruru Terminal', size: { w: 680, h: 460 }, core: true },
  classified: { id: 'classified', file: 'classified.exe', title: 'CLASSIFIED', size: { w: 620, h: 600 }, core: true },
  settings: { id: 'settings', file: 'settings.app', title: 'Settings', size: { w: 560, h: 560 }, core: false },
  lostfound: { id: 'lostfound', file: 'lost+found', title: 'lost+found', size: { w: 760, h: 600 }, core: false },
  about: { id: 'about', file: 'about.txt', title: 'About Reva OS', size: { w: 420, h: 400 }, core: false },
};

export const desktopOrder: AppId[] = ['archive', 'photos', 'flowers', 'dictionary', 'calendar', 'awards', 'terminal', 'classified'];
export const dockOrder: AppId[] = ['archive', 'photos', 'flowers', 'dictionary', 'calendar', 'awards', 'terminal', 'classified', 'settings'];
