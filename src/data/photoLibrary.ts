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

export type AlbumId = 'reva' | 'us' | 'beginnings' | 'bowling' | 'club27' | 'flowers' | 'being-reva' | 'convocation' | 'unsorted';

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
  /** date of the event this photo belongs to (ISO); shown as provisional unless eventAssociation is confirmed */
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
  /** when it joined the library ('v2.1' = imported 05.11.2026) */
  added: 'v1' | 'v2' | 'v2.1';
  people: 'reva' | 'ruru' | 'both' | 'none';
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
  { id: 'P19', filename: 'p19', title: 'Golden hour salute', description: 'A tree-lined road, late sun.', albumIds: ['reva'], tags: ['portrait', 'golden hour', 'outdoors'], dateStatus: 'unknown', eventAssociation: 'unassigned', isFavourite: true, kind: 'photo', added: 'v1', people: 'reva' },
  { id: 'P04', filename: 'p04', title: 'City lights', description: 'On a rooftop at night, mid-laugh.', albumIds: ['reva'], tags: ['portrait', 'night', 'laughing'], dateStatus: 'unknown', eventAssociation: 'unassigned', isFavourite: false, factIds: ['photo-p04-date'], kind: 'photo', added: 'v1', people: 'reva' },
  { id: 'P08', filename: 'p08', title: 'At the incubator', description: 'A big smile at a desk in the incubation cell.', albumIds: ['reva'], tags: ['portrait', 'campus', 'smile'], dateStatus: 'unknown', eventAssociation: 'unassigned', isFavourite: false, kind: 'photo', added: 'v1', people: 'reva' },
  { id: 'P09', filename: 'p09', title: 'At the incubator, take two', description: 'Same desk, an even bigger smile.', albumIds: ['reva'], tags: ['portrait', 'campus', 'smile'], dateStatus: 'unknown', eventAssociation: 'unassigned', isFavourite: false, kind: 'photo', added: 'v2', people: 'reva' },
  { id: 'P20', filename: 'p20', title: 'The archivist', description: 'Pulling an old record slip out of the steel almirahs. She always wanted to know what was kept in them.', albumIds: ['reva'], tags: ['portrait', 'campus', 'archive'], dateStatus: 'unknown', eventAssociation: 'unassigned', isFavourite: true, factIds: ['almirah'], kind: 'photo', added: 'v1', people: 'reva' },
  { id: 'P23', filename: 'p23', title: 'Olive jacket', description: 'Outside an old, weathered building.', albumIds: ['reva'], tags: ['portrait', 'outdoors'], dateStatus: 'unknown', eventAssociation: 'unassigned', isFavourite: false, kind: 'photo', added: 'v2', people: 'reva' },
  { id: 'P02', filename: 'p02', title: 'Chin on hand', description: 'At home, in warm lamp light.', albumIds: ['reva'], tags: ['portrait', 'home', 'soft'], dateStatus: 'unknown', eventAssociation: 'unassigned', isFavourite: false, kind: 'photo', added: 'v2', people: 'reva' },
  { id: 'P32', filename: 'p32', title: 'Black kurta', description: 'A direct look, at home.', albumIds: ['reva'], tags: ['portrait', 'home'], dateStatus: 'unknown', eventAssociation: 'unassigned', isFavourite: false, kind: 'photo', added: 'v2', people: 'reva' },
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

  // ── Imported 05.11.2026 (added by Ruru to the project folder) ────────────
  // Captions describe only what is visible. Nothing here is linked to a memory.
  { id: 'N03', filename: 'n03', title: 'Convocation, with flowers', description: 'In front of the 56th PEC Convocation tent; she’s holding a bouquet.', albumIds: ['convocation', 'us'], tags: ['convocation', 'pec', 'together', 'flowers'], eventDate: '2026-10-24', dateStatus: 'approximate', eventAssociation: 'provisional', isFavourite: false, factIds: ['photo-convocation'], kind: 'photo', private: true, added: 'v2.1', people: 'both' },
  { id: 'N04', filename: 'n04', title: 'Convocation, take two', description: 'Same spot, same bouquet, a different pose.', albumIds: ['convocation', 'us'], tags: ['convocation', 'pec', 'together'], eventDate: '2026-10-24', dateStatus: 'approximate', eventAssociation: 'provisional', isFavourite: false, factIds: ['photo-convocation'], kind: 'photo', private: true, added: 'v2.1', people: 'both' },
  { id: 'N05', filename: 'n05', title: 'Convocation, under the trees', description: 'On the red carpet outside the tent.', albumIds: ['convocation', 'us'], tags: ['convocation', 'pec', 'together'], eventDate: '2026-10-24', dateStatus: 'approximate', eventAssociation: 'provisional', isFavourite: false, factIds: ['photo-convocation'], kind: 'photo', private: true, added: 'v2.1', people: 'both' },
  { id: 'N06', filename: 'n06', title: 'Inside the tent', description: 'Under the red ceiling of the convocation tent.', albumIds: ['convocation', 'us'], tags: ['convocation', 'pec', 'together'], eventDate: '2026-10-24', dateStatus: 'approximate', eventAssociation: 'provisional', isFavourite: false, factIds: ['photo-convocation'], kind: 'photo', private: true, added: 'v2.1', people: 'both' },
  { id: 'N07', filename: 'n07', title: 'The whole banner', description: 'A wide shot in front of the 56th Convocation banner.', albumIds: ['convocation', 'us'], tags: ['convocation', 'pec', 'together'], eventDate: '2026-10-24', dateStatus: 'approximate', eventAssociation: 'provisional', isFavourite: false, factIds: ['photo-convocation'], kind: 'photo', private: true, added: 'v2.1', people: 'both' },
  { id: 'N08', filename: 'n08', title: 'Lights and noise', description: 'A hug in a crowd, under purple lights.', albumIds: ['us'], tags: ['together', 'night', 'crowd'], dateStatus: 'unknown', eventAssociation: 'unassigned', isFavourite: false, kind: 'photo', private: true, added: 'v2.1', people: 'both' },
  { id: 'N09', filename: 'n09', title: 'Outside, at dusk', description: 'Standing together outside a building as the light goes.', albumIds: ['us'], tags: ['together', 'dusk'], dateStatus: 'unknown', eventAssociation: 'unassigned', isFavourite: false, kind: 'photo', private: true, added: 'v2.1', people: 'both' },
  { id: 'N10', filename: 'n10', title: 'Outside, at dusk (again)', description: 'Same place, one frame later.', albumIds: ['us'], tags: ['together', 'dusk'], dateStatus: 'unknown', eventAssociation: 'unassigned', isFavourite: false, kind: 'photo', private: true, added: 'v2.1', people: 'both' },
  { id: 'N01', filename: 'n01', title: 'Close-up', description: 'A close selfie, hair everywhere.', albumIds: ['reva'], tags: ['selfie', 'portrait'], dateStatus: 'unknown', eventAssociation: 'unassigned', isFavourite: false, kind: 'photo', added: 'v2.1', people: 'reva' },
  { id: 'N12', filename: 'n12', title: 'Night walk', description: 'Standing on an empty road at night.', albumIds: ['reva'], tags: ['portrait', 'night', 'outdoors'], dateStatus: 'unknown', eventAssociation: 'unassigned', isFavourite: false, kind: 'photo', added: 'v2.1', people: 'reva' },
  { id: 'N11', filename: 'n11', title: 'Low angle, high attitude', description: 'A pout, from below.', albumIds: ['being-reva'], tags: ['funny', 'selfie', 'pout'], dateStatus: 'unknown', eventAssociation: 'unassigned', isFavourite: false, kind: 'photo', added: 'v2.1', people: 'reva' },
  { id: 'N02', filename: 'n02', title: 'Double exposure', description: 'A blurry, doubled selfie.', albumIds: ['being-reva'], tags: ['funny', 'selfie', 'blurry'], dateStatus: 'unknown', eventAssociation: 'unassigned', isFavourite: false, kind: 'photo', added: 'v2.1', people: 'reva' },
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
    blurb: 'No flower photographs in the library right now. White Memoir’s photo is still to come; the drawings live, labelled, in the Flower Department.',
  },
  { id: 'being-reva', no: '07', title: 'Reva Being Reva', blurb: 'Pouts, sunglasses, and general unimpressedness.', cover: 'P03' },
  {
    id: 'convocation',
    no: '08',
    title: '56th Convocation',
    blurb: 'Provisional: identified only by the banner in the photos (PEC, 24 October 2026). Not yet confirmed anywhere else.',
    cover: 'N03',
    private: true,
  },
  { id: 'unsorted', no: '09', title: 'Unsorted / Undated', blurb: 'Photographs whose date or event isn’t established. Kept honestly unassigned.', cover: 'P15', computed: true },
];

/** Placeholders for photos that don't exist yet. */
export const missingPhotos = [{ id: 'white-memoir', title: 'White Memoir', note: 'The white-rose bouquet for the 21st. Add its photo to scripts/asset-sources.json and register it here.' }];
