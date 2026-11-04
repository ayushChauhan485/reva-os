// Shared content types. Everything personal lives in src/data/*, never in components.

/** Raw sender names exactly as they appear in the WhatsApp export. */
export type Sender = 'Ayush' | 'Revaa';

/** A single, verbatim chat message. `text` must match the export character for character. */
export interface ChatMessage {
  id: string;
  sender: Sender;
  /** DD/MM/YYYY, as in the export */
  date: string;
  /** HH:MM, 24h, as in the export */
  time: string;
  text: string;
}

/** A line from a friend's birthday video. Wording follows the reviewed transcript. */
export interface Testimony {
  id: string;
  witness: string;
  text: string;
  source: string;
}

export type AssetKey =
  | 'archiveHero'
  | 'bowlingMain'
  | 'bowlingAlternative'
  | 'bowlingLanes'
  | 'lakeDay'
  | 'portraitGoldenHour'
  | 'portraitRooftop'
  | 'portraitIncubator'
  | 'portraitSunglasses'
  | 'bouquetHandmade';

export interface Photo {
  key: AssetKey;
  src: string;
  thumb: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
  date?: string;
}

export interface Memory {
  id: string;
  /** ISO date, e.g. 2026-04-27 */
  date: string;
  /** Shown on the folder, e.g. 27.04_THE_BEGINNING */
  folderName: string;
  title: string;
  /** Editorial intro written by Ruru. Short lines, shown one per row. */
  intro: string[];
  messages?: string[]; // ChatMessage ids, shown in order
  /** A quieter note that has to be opened deliberately (27.04). */
  sealed?: { label: string; messageIds: string[]; note?: string };
  photos?: AssetKey[];
  place?: string;
  tags: string[];
}

export interface Flower {
  id: string;
  name: string;
  latin?: string;
  symbolism: string;
  /** Personal reference, written by Ruru. */
  story: string;
  messages?: string[];
  date?: string;
  photo?: AssetKey;
  /** Filled when a real photo is still to be supplied. */
  photoPlaceholder?: string;
  art: 'white-lily' | 'tiger-lily' | 'poppy' | 'white-memoir' | 'wildflower' | 'handmade';
}

export interface DictionaryEntry {
  id: string;
  headword: string;
  partOfSpeech: string;
  category: DictionaryCategory;
  /** The original message (ChatMessage id) or a testimony id. */
  quote: { kind: 'chat'; id: string } | { kind: 'testimony'; id: string };
  /** Messages shown before the quote for context. */
  context?: string[];
  /** Messages shown after the quote for context. */
  after?: string[];
  /** Ruru's editorial definition. Always shown as an editor's note. */
  definition: string;
  photo?: AssetKey;
}

export type DictionaryCategory =
  | 'reva-being-reva'
  | 'one-liners'
  | 'framed'
  | 'logic'
  | 'funny'
  | 'only-ruru'
  | 'witness';

export interface CalendarEvent {
  /** ISO date */
  date: string;
  title: string;
  description: string;
  memoryId?: string;
  photo?: AssetKey;
  kind: 'meeting' | 'memory' | 'milestone';
}

export type TrophyStyle =
  | 'quill'
  | 'scales'
  | 'loop'
  | 'hands'
  | 'puffer'
  | 'poppy'
  | 'calendar'
  | 'star'
  | 'magnifier';

export interface AwardEvidence {
  kind: 'chat' | 'testimony' | 'stat';
  /** chat/testimony id, or free text for stats (stats must be measured facts) */
  ref?: string;
  text?: string;
}

export interface RevaAward {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  winner: string;
  evidence?: AwardEvidence[];
  /** Ruru's editorial jokes. Never presented as anyone else's words. */
  juryNotes?: string[];
  evidenceDate?: string;
  image?: AssetKey;
  trophyStyle: TrophyStyle;
  /** false = hidden until an easter egg unlocks it */
  isUnlocked: boolean;
  specialReveal?: boolean;
  /** Placeholder flag: needs content from Ruru */
  needsContent?: boolean;
}
