// ✍️ THE FINAL LETTER (classified.exe)
// This is yours to write. Each string in `paragraphs` becomes one paragraph.
// While `paragraphs` is empty, the letter shows a clearly marked placeholder
// and `npm run check-content` lists it as unfinished.
import type { PhotoId } from './types';

export const letter = {
  /** Shown above the letter in Ruru's real handwriting (image). */
  useHandwrittenHeader: true,
  /** Optional greeting under the handwriting, e.g. 'Riruu,' */
  greeting: '',
  paragraphs: [] as string[],
  signature: 'Ruru 🐡',
  /** Optional photo shown with the letter. */
  photo: undefined as PhotoId | undefined,
};

export const letterPlaceholder = [
  'This is where Ruru’s letter goes.',
  'Write it in src/data/letter.ts — one string per paragraph.',
];

/** The playful lock. It is NOT security: anyone can read the page source. */
export const puzzle = {
  intro: 'A small question before you enter.',
  question: 'When did this little story begin?',
  format: 'DD.MM.YYYY',
  answer: '27.04.2026',
  hints: [
    'Hint: it was a 27th.',
    'Hint: Sector 10. A park.',
    'Hint: the founding meeting of a certain club.',
  ],
  wrong: ['Not quite. The archive disagrees.', 'Close-ish? The calendar app might know.', 'Access denied. Gently.'],
  unlocked: 'Access granted. Welcome back to the beginning.',
};
