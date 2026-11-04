// ─────────────────────────────────────────────────────────────────────────────
// THE PHOTO LIBRARY — the single registry every app uses.
//
// One canonical id per photograph (the media-index id). Web files are produced
// by `npm run assets` from scripts/asset-sources.json; originals are untouched.
//
// Rules this file follows (checked by `npm run verify-facts`):
//  • eventAssociation "confirmed" only with a confirmed fact in verifiedFacts.ts
//  • a photo is linked to a memory (relatedMemoryId) only if confirmed
//  • dates: verifiedDate = capture date we can prove; eventDate = the event it
//    belongs to; fileDate = when the file was saved/sent (NOT a capture date)
// ─────────────────────────────────────────────────────────────────────────────
import dims from './generated/assetDimensions.json' with { type: 'json' };

export type AlbumId = 'reva' | 'us' | 'beginnings' | 'bowling' | 'club27' | 'flowers' | 'being-reva' | 'unsorted';

export interface PhotoAsset {
  id: string;
  /** web file base name in public/assets/photos (no source filenames are exposed) */
  filename: string;
  title: string;
  description?: string;
  albumIds: AlbumId[];
  tags: string[];
  /** capture date we can prove (ISO) */
  verifiedDate?: string;
  /** date of the confirmed event this photo belongs to (ISO) */
  eventDate?: string;
  /** date the file was saved/sent; shown as "dated by file" */
  fileDate?: string;
  dateStatus: 'verified' | 'approximate' | 'unknown';
  eventAssociation: 'confirmed' | 'provisional' | 'unassigned';
  /** Ruru's starting favourites (Reva's own favourites are saved separately) */
  isFavourite: boolean;
  relatedMemoryId?: string;
  /** verifiedFacts ids backing any date or association */
  factIds?: string[];
  kind: 'photo' | 'video-still';
  /** photos of the two of them: hidden when config.showPrivateAlbums is false */
  private?: boolean;
  /** locked behind an easter egg until "developed" */
  secret?: 'pufferfish' | 'terminal';
  /** first appeared in V2 */
  added: 'v1' | 'v2';
  people: 'reva' | 'ruru' | 'both' | 'none';
  /** where the subject sits, for cover crops (CSS object-position) */
  focus?: string;
}

/** Derived from the generated file: width/height and any recorded edit. */
export interface PhotoDims {
  file: string;
  w: number;
  h: number;
  edit?: { w: number; h: number; removes: string; approved: boolean };
}

export const photoDims = dims as Record<string, PhotoDims>;

export const photoLibrary: PhotoAsset[] = [
  // ── 6 May 2026, the bowling day ─────────────────────────────────────────
  {
    id: 'P12',
    filename: 'p12',
    title: 'Bowling day',
    description: 'Laughing, in the white and blue floral dress.',
    albumIds: ['bowling', 'beginnings', 'reva'],
    tags: ['bowling', '6 may', 'portrait', 'laughing'],
    eventDate: '2026-05-06',
    dateStatus: 'verified',
    eventAssociation: 'confirmed',
    isFavourite: true,
    relatedMemoryId: 'three-words',
    factIds: ['photo-bowling', 'bowling-day'],
    kind: 'photo',
    added: 'v1',
    people: 'reva',
    focus: '50% 30%',
  },
  {
    id: 'P14',
    filename: 'p14',
    title: 'At the lanes',
    description: 'A hug at the bowling venue.',
    albumIds: ['bowling', 'beginnings', 'us'],
    tags: ['bowling', '6 may', 'together'],
    eventDate: '2026-05-06',
    dateStatus: 'verified',
    eventAssociation: 'confirmed',
    isFavourite: true,
    relatedMemoryId: 'three-words',
    factIds: ['photo-bowling', 'bowling-day'],
    kind: 'photo',
    private: true,
    added: 'v1',
    people: 'both',
  },
  {
    id: 'P13',
    filename: 'p13',
    title: 'Bowling day, the couch',
    description: 'A chin, firmly squeezed.',
    albumIds: ['bowling', 'beginnings', 'us'],
    tags: ['bowling', '6 may', 'together', 'funny'],
    eventDate: '2026-05-06',
    dateStatus: 'verified',
    eventAssociation: 'confirmed',
    isFavourite: false,
    relatedMemoryId: 'three-words',
    factIds: ['photo-bowling', 'bowling-day'],
    kind: 'photo',
    private: true,
    added: 'v1',
    people: 'both',
  },

  // ── Reva: undated portraits ────────────────────────────────────────────
  { id: 'P19', filename: 'p19', title: 'Golden hour salute', description: 'A tree-lined road, late sun.', albumIds: ['reva'], tags: ['portrait', 'golden hour', 'outdoors'], dateStatus: 'unknown', eventAssociation: 'unassigned', isFavourite: true, kind: 'photo', added: 'v1', people: 'reva', focus: '50% 40%' },
  { id: 'P04', filename: 'p04', title: 'City lights', description: 'On a rooftop at night, mid-laugh.', albumIds: ['reva'], tags: ['portrait', 'night', 'laughing'], dateStatus: 'unknown', eventAssociation: 'unassigned', isFavourite: false, factIds: ['photo-p04-date'], kind: 'photo', added: 'v1', people: 'reva', focus: '50% 65%' },
  { id: 'P08', filename: 'p08', title: 'At the incubator', description: 'A big smile at a desk in the incubation cell.', albumIds: ['reva'], tags: ['portrait', 'campus', 'smile'], dateStatus: 'unknown', eventAssociation: 'unassigned', isFavourite: false, kind: 'photo', added: 'v1', people: 'reva' },
  { id: 'P09', filename: 'p09', title: 'At the incubator, take two', description: 'Same desk, an even bigger smile.', albumIds: ['reva'], tags: ['portrait', 'campus', 'smile'], dateStatus: 'unknown', eventAssociation: 'unassigned', isFavourite: false, kind: 'photo', added: 'v2', people: 'reva' },
  { id: 'P20', filename: 'p20', title: 'The archivist', description: 'Pulling an old record slip out of the steel almirahs. She always wanted to know what was kept in them.', albumIds: ['reva'], tags: ['portrait', 'campus', 'archive'], dateStatus: 'unknown', eventAssociation: 'unassigned', isFavourite: true, factIds: ['almirah'], kind: 'photo', added: 'v1', people: 'reva', focus: '62% 40%' },
  { id: 'P23', filename: 'p23', title: 'Olive jacket', description: 'Outside an old, weathered building.', albumIds: ['reva'], tags: ['portrait', 'outdoors'], dateStatus: 'unknown', eventAssociation: 'unassigned', isFavourite: false, kind: 'photo', added: 'v2', people: 'reva', focus: '50% 60%' },
  { id: 'P02', filename: 'p02', title: 'Chin on hand', description: 'At home, in warm lamp light.', albumIds: ['reva'], tags: ['portrait', 'home', 'soft'], dateStatus: 'unknown', eventAssociation: 'unassigned', isFavourite: false, kind: 'photo', added: 'v2', people: 'reva', focus: '62% 45%' },
  { id: 'P32', filename: 'p32', title: 'Black kurta', description: 'A direct look, at home.', albumIds: ['reva'], tags: ['portrait', 'home'], dateStatus: 'unknown', eventAssociation: 'unassigned', isFavourite: false, kind: 'photo', added: 'v2', people: 'reva', focus: '60% 40%' },
  { id: 'P16', filename: 'p16', title: 'After dark', description: 'A terrace at night, looking away.', albumIds: ['reva'], tags: ['portrait', 'night'], dateStatus: 'unknown', eventAssociation: 'unassigned', isFavourite: false, kind: 'photo', added: 'v2', people: 'reva' },
  { id: 'P01', filename: 'p01', title: 'Mirror, mirror', description: 'A mirror selfie in a blue dress.', albumIds: ['reva', 'being-reva'], tags: ['selfie', 'mirror', 'blue'], dateStatus: 'unknown', eventAssociation: 'unassigned', isFavourite: false, kind: 'photo', added: 'v2', people: 'reva' },

  // ── Reva being Reva ───────────────────────────────────────────────────
  { id: 'P03', filename: 'p03', title: 'Sunglasses, pout', description: 'Maximum attitude, minimum distance from the lens.', albumIds: ['being-reva', 'reva'], tags: ['funny', 'selfie', 'pout'], dateStatus: 'unknown', eventAssociation: 'unassigned', isFavourite: true, kind: 'photo', added: 'v1', people: 'reva' },
  { id: 'P17', filename: 'p17', title: 'Sleepy pout', description: 'Unimpressed, possibly by the camera.', albumIds: ['being-reva'], tags: ['funny', 'selfie', 'pout'], dateStatus: 'unknown', eventAssociation: 'unassigned', isFavourite: false, kind: 'photo', added: 'v2', people: 'reva' },
  { id: 'P26', filename: 'p26', title: 'Glasses on', description: 'The glasses. The pout. The verdict.', albumIds: ['being-reva'], tags: ['funny', 'selfie', 'glasses', 'pout'], dateStatus: 'unknown', eventAssociation: 'unassigned', isFavourite: false, kind: 'photo', secret: 'pufferfish', added: 'v2', people: 'reva' },
  { id: 'P31', filename: 'p31', title: 'Car selfie', description: 'Blue top, evil-eye bracelet, a pout on standby.', albumIds: ['being-reva', 'reva'], tags: ['funny', 'selfie', 'pout'], dateStatus: 'unknown', eventAssociation: 'unassigned', isFavourite: false, kind: 'photo', secret: 'terminal', added: 'v2', people: 'reva' },

  // ── The two of us (undated) ───────────────────────────────────────────
  { id: 'P07', filename: 'p07', title: 'Squished', description: 'A two-person selfie, mostly cheeks.', albumIds: ['us', 'being-reva'], tags: ['together', 'funny', 'selfie'], dateStatus: 'unknown', eventAssociation: 'unassigned', isFavourite: false, kind: 'photo', private: true, added: 'v2', people: 'both' },
  { id: 'P11', filename: 'p11', title: 'Desk, cheek to cheek', description: 'At the incubator desk.', albumIds: ['us'], tags: ['together', 'campus'], dateStatus: 'unknown', eventAssociation: 'unassigned', isFavourite: false, kind: 'photo', private: true, added: 'v2', people: 'both' },

  // ── Unassigned on purpose ─────────────────────────────────────────────
  {
    id: 'P15',
    filename: 'p15',
    title: 'On the court',
    description: 'A pickleball court, a paddle, a well-earned sit-down. Date and place not established.',
    albumIds: ['reva'],
    tags: ['pickleball', 'sport', 'unassigned'],
    dateStatus: 'unknown',
    eventAssociation: 'unassigned',
    isFavourite: false,
    factIds: ['photo-p15'],
    kind: 'photo',
    added: 'v1',
    people: 'reva',
  },

  // ── The Handmade One (pipe-cleaner flowers by Ruru) ───────────────────
  { id: 'BQ-F0912', filename: 'bq-f0912', title: 'The first petals', description: 'Pink pipe cleaners being twisted into petals. Still from a making-of video.', albumIds: ['flowers'], tags: ['handmade', 'making-of', 'lily'], fileDate: '2026-09-12', dateStatus: 'approximate', eventAssociation: 'confirmed', isFavourite: false, factIds: ['handmade-bouquet'], kind: 'video-still', added: 'v2', people: 'ruru' },
  { id: 'BQ-F0914a', filename: 'bq-f0914a', title: 'The first lily', description: 'The first finished pipe-cleaner lily, held to the camera.', albumIds: ['flowers'], tags: ['handmade', 'making-of', 'lily'], fileDate: '2026-09-14', dateStatus: 'approximate', eventAssociation: 'confirmed', isFavourite: false, factIds: ['handmade-bouquet'], kind: 'video-still', added: 'v2', people: 'ruru' },
  { id: 'BQ-F0914b', filename: 'bq-f0914b', title: 'Lily in hand', description: 'A pink-and-white lily, the same evening.', albumIds: ['flowers'], tags: ['handmade', 'making-of', 'lily'], fileDate: '2026-09-14', dateStatus: 'approximate', eventAssociation: 'confirmed', isFavourite: false, factIds: ['handmade-bouquet'], kind: 'video-still', added: 'v2', people: 'ruru' },
  { id: 'BQ-P01', filename: 'bq-p01', title: 'Three lilies', description: 'Three finished lilies, pink with pink centres.', albumIds: ['flowers'], tags: ['handmade', 'lily'], fileDate: '2026-09-17', dateStatus: 'approximate', eventAssociation: 'confirmed', isFavourite: false, factIds: ['handmade-bouquet'], kind: 'photo', added: 'v2', people: 'ruru' },
  { id: 'BQ-F0919', filename: 'bq-f0919', title: 'A bunch on stems', description: 'Lilies with green stems and leaves.', albumIds: ['flowers'], tags: ['handmade', 'making-of', 'lily'], fileDate: '2026-09-19', dateStatus: 'approximate', eventAssociation: 'confirmed', isFavourite: false, factIds: ['handmade-bouquet'], kind: 'video-still', added: 'v2', people: 'ruru' },
  { id: 'BQ-F0921', filename: 'bq-f0921', title: 'Poppies arrive', description: 'The first red poppies, two days after "I like poppy flower".', albumIds: ['flowers'], tags: ['handmade', 'making-of', 'poppy'], fileDate: '2026-09-21', dateStatus: 'approximate', eventAssociation: 'confirmed', isFavourite: true, factIds: ['handmade-bouquet', 'tiger-lily'], kind: 'video-still', added: 'v2', people: 'ruru' },
  { id: 'BQ-F0922', filename: 'bq-f0922', title: 'Complete', description: 'Lilies and poppies together, held up.', albumIds: ['flowers'], tags: ['handmade', 'making-of', 'lily', 'poppy'], fileDate: '2026-09-22', dateStatus: 'approximate', eventAssociation: 'confirmed', isFavourite: false, factIds: ['handmade-bouquet'], kind: 'video-still', added: 'v2', people: 'ruru' },
  { id: 'BQ-F0923', filename: 'bq-f0923', title: 'In the vase', description: 'The finished bouquet in a glass vase.', albumIds: ['flowers'], tags: ['handmade', 'making-of', 'vase'], fileDate: '2026-09-23', dateStatus: 'approximate', eventAssociation: 'confirmed', isFavourite: false, factIds: ['handmade-bouquet'], kind: 'video-still', added: 'v2', people: 'ruru' },
  { id: 'BQ-HD2', filename: 'bq-hd2', title: 'The Handmade One', description: 'The finished bouquet: pink-and-white lilies and red poppies, all pipe cleaner.', albumIds: ['flowers'], tags: ['handmade', 'bouquet', 'lily', 'poppy'], verifiedDate: '2026-10-06', dateStatus: 'verified', eventAssociation: 'confirmed', isFavourite: true, factIds: ['bouquet-photographed'], kind: 'photo', added: 'v1', people: 'none' },
  { id: 'BQ-HD3', filename: 'bq-hd3', title: 'The Handmade One, close', description: 'Pink inwards, as specified on 18 June.', albumIds: ['flowers'], tags: ['handmade', 'bouquet', 'lily', 'white lily'], verifiedDate: '2026-10-06', dateStatus: 'verified', eventAssociation: 'confirmed', isFavourite: false, factIds: ['bouquet-photographed'], kind: 'photo', added: 'v1', people: 'none' },
  { id: 'BQ-HD1', filename: 'bq-hd1', title: 'The tallest lily', description: 'The bouquet from the side.', albumIds: ['flowers'], tags: ['handmade', 'bouquet', 'lily'], verifiedDate: '2026-10-06', dateStatus: 'verified', eventAssociation: 'confirmed', isFavourite: false, factIds: ['bouquet-photographed'], kind: 'photo', added: 'v2', people: 'none' },
  { id: 'BQ-HD4', filename: 'bq-hd4', title: 'Poppies and lilies', description: 'The bouquet, low angle.', albumIds: ['flowers'], tags: ['handmade', 'bouquet', 'poppy'], verifiedDate: '2026-10-06', dateStatus: 'verified', eventAssociation: 'confirmed', isFavourite: false, factIds: ['bouquet-photographed'], kind: 'photo', added: 'v2', people: 'none' },
];

export interface Album {
  id: AlbumId;
  no: string;
  title: string;
  blurb: string;
  cover?: string;
  private?: boolean;
  /** verified memories with no photograph, shown as date cards */
  memoryCards?: string[];
  /** sections inside the Flower Archive */
  sections?: { title: string; note: string; tag: string }[];
  /** computed albums fill themselves */
  computed?: boolean;
}

export const albums: Album[] = [
  { id: 'reva', no: '01', title: 'Reva', blurb: 'Solo portraits.', cover: 'P19' },
  { id: 'us', no: '02', title: 'The Two of Us', blurb: 'Photographs together. Private album.', cover: 'P14', private: true },
  {
    id: 'beginnings',
    no: '03',
    title: 'Little Beginnings',
    blurb: 'April and early May. Photographs only where the date is confirmed.',
    cover: 'P12',
    memoryCards: ['similarities', 'beginning', 'pufferfish'],
  },
  { id: 'bowling', no: '04', title: 'Bowling Night', blurb: '6 May 2026. Also the night of “I love you too”.', cover: 'P14' },
  {
    id: 'club27',
    no: '05',
    title: 'The 27th Club',
    blurb: 'Confirmed 27ths. No photograph of either meeting has been found yet.',
    memoryCards: ['beginning', 'lake-day'],
  },
  {
    id: 'flowers',
    no: '06',
    title: 'The Flower Archive',
    blurb: 'Real photographs of the handmade flowers. Illustrations live in the Flower Department and are labelled.',
    cover: 'BQ-HD2',
    sections: [
      { title: 'The Handmade One · making-of', note: 'Stills from Ruru’s videos, dated by file.', tag: 'making-of' },
      { title: 'The Handmade One · finished', note: 'Photographed 06.10.2026 (camera timestamp).', tag: 'bouquet' },
    ],
  },
  { id: 'being-reva', no: '07', title: 'Reva Being Reva', blurb: 'Pouts, sunglasses, and general unimpressedness.', cover: 'P03' },
  { id: 'unsorted', no: '08', title: 'Unsorted / Undated', blurb: 'Photographs whose date or event isn’t established. Kept honestly unassigned.', cover: 'P15', computed: true },
];

/** Placeholders for photos that don't exist yet. */
export const missingPhotos = [{ id: 'white-memoir', title: 'White Memoir', note: 'The white-rose bouquet for the 21st. Add its photo to scripts/asset-sources.json and register it here.' }];
