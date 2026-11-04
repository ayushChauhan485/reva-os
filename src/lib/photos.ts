// Helpers over the photo registry. Every app resolves photos through here.
import { config } from '../config';
import { albums, photoDims, photoLibrary, type AlbumId, type PhotoAsset } from '../data/photoLibrary';
import { useProgress } from '../store/progressStore';
import { useUI } from '../store/uiStore';
import { play } from './sound';

const BASE = `${import.meta.env.BASE_URL}assets/photos/`;

/** Ruru's real handwriting, cut from his scanned sheet. */
export const handwritingHeader = `${import.meta.env.BASE_URL}assets/illustrations/happy-21st-riruu.png`;
const byId = new Map(photoLibrary.map((p) => [p.id, p]));

export type { PhotoAsset, AlbumId };

export const getPhoto = (id: string) => byId.get(id);

/** Does this photo have a recorded edit that is approved for default display? */
export function showsEdit(p: PhotoAsset, original = false) {
  const e = photoDims[p.id]?.edit;
  return !!e && e.approved && !original;
}

export function photoSrc(p: PhotoAsset, opts: { thumb?: boolean; original?: boolean } = {}) {
  const d = photoDims[p.id];
  if (!d) return null;
  const base = showsEdit(p, opts.original) ? `${d.file}_edit` : d.file;
  return `${BASE}${base}${opts.thumb ? '_thumb' : ''}.webp`;
}

export function photoSize(p: PhotoAsset, original = false) {
  const d = photoDims[p.id];
  if (!d) return { w: 4, h: 3 };
  return showsEdit(p, original) && d.edit ? { w: d.edit.w, h: d.edit.h } : { w: d.w, h: d.h };
}

export function orientation(p: PhotoAsset): 'portrait' | 'landscape' | 'square' {
  const { w, h } = photoSize(p);
  const r = w / h;
  return r > 1.1 ? 'landscape' : r < 0.9 ? 'portrait' : 'square';
}

export const isAvailable = (p: PhotoAsset) => !!photoDims[p.id];
const privacyOk = (p: PhotoAsset) => config.showPrivateAlbums || !p.private;

/** Which photo each easter egg develops. */
export const SECRET_BY_EGG = Object.fromEntries(photoLibrary.filter((p) => p.secret).map((p) => [p.secret!, p.id])) as Record<'pufferfish' | 'terminal', string>;

/** Secrets stay "undeveloped" until their easter egg is found. */
export function isDeveloped(p: PhotoAsset, developed = useProgress.getState().developed) {
  return !p.secret || developed.includes(p.id);
}

/** Every photo Reva can currently see (secrets included, flagged as locked by isDeveloped). */
export function visiblePhotos() {
  return photoLibrary.filter((p) => isAvailable(p) && privacyOk(p));
}

/** Photos that can be viewed right now (developed, available, allowed). */
export function viewablePhotos(developed = useProgress.getState().developed) {
  return visiblePhotos().filter((p) => isDeveloped(p, developed));
}

export function visibleAlbums() {
  return albums.filter((a) => config.showPrivateAlbums || !a.private);
}

export function albumPhotos(id: AlbumId) {
  const vis = visiblePhotos();
  if (id === 'unsorted') return vis.filter((p) => p.eventAssociation === 'unassigned');
  return vis.filter((p) => p.albumIds.includes(id));
}

export function albumCover(id: AlbumId) {
  const a = albums.find((x) => x.id === id);
  const cover = a?.cover ? getPhoto(a.cover) : undefined;
  if (cover && isAvailable(cover) && privacyOk(cover) && isDeveloped(cover)) return cover;
  return albumPhotos(id).find((p) => isDeveloped(p));
}

const dot = (iso: string) => iso.split('-').reverse().join('.');

/** Human date line. Never presents a file date as a capture date. */
export function dateLabel(p: PhotoAsset): { text: string; kind: 'verified' | 'event' | 'file' | 'unknown' } {
  if (p.verifiedDate) return { text: dot(p.verifiedDate), kind: 'verified' };
  if (p.eventDate && p.eventAssociation === 'confirmed') return { text: dot(p.eventDate), kind: 'event' };
  if (p.fileDate) return { text: `≈ ${dot(p.fileDate)} · dated by file`, kind: 'file' };
  return { text: 'Undated', kind: 'unknown' };
}

/** The date used for timelines: verified or confirmed-event only. */
export function trustedDate(p: PhotoAsset) {
  if (p.verifiedDate) return p.verifiedDate;
  if (p.eventDate && p.eventAssociation === 'confirmed') return p.eventDate;
  return null;
}

export function albumNames(p: PhotoAsset) {
  const names = p.albumIds.map((a) => albums.find((x) => x.id === a)?.title).filter(Boolean) as string[];
  if (p.eventAssociation === 'unassigned') names.push('Unsorted / Undated');
  return names;
}

/** Deterministic "photo of the day": same photo all day, changes at midnight. */
export function photoOfTheDay(pool = viewablePhotos().filter((p) => p.kind === 'photo' && (p.people === 'reva' || p.people === 'both'))) {
  const d = new Date();
  const n = d.getFullYear() * 400 + d.getMonth() * 32 + d.getDate();
  return pool.length ? pool[(n * 7919) % pool.length] : undefined;
}

export function randomPhoto(exclude?: string) {
  const pool = viewablePhotos().filter((p) => p.id !== exclude);
  return pool[Math.floor(Math.random() * pool.length)];
}

/** "REMIND ME OF SOMETHING RANDOM": opens one random photo in the viewer. */
export function remindRandom() {
  play('paper');
  const p = randomPhoto();
  if (p) useUI.getState().openViewer([p.id], 0, { random: true });
}
