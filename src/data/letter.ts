// ✍️ THE FINAL LETTER (classified.exe)
// Written by Ruru (05.11.2026). Each string in `paragraphs` becomes one paragraph.
// While `paragraphs` is empty, the letter shows a clearly marked placeholder
// and `npm run check-content` lists it as unfinished.
import type { PhotoId } from './types';

export const letter = {
  /** Ruru's real handwriting ("Happy 21st, Riruu.") above the letter. Off, because the letter ends with the same line. */
  useHandwrittenHeader: false,
  greeting: 'To Riruu,',
  paragraphs: [
    "I don't really know where to begin, which is quite funny considering how much I remember about us.",
    "I still think about 27th April sometimes. Our first date at Sector 10. I don't think either of us knew just how many little memories would come out of that one day. And then there was 3rd May, 6th May, all the conversations in between, and somehow, without really planning it, we became such a big part of each other's everyday lives.",
    "I remember telling you that I really liked talking to you, even though I didn't have words half the time 😭. I think that's still one of my favourite things about us. We can talk about absolutely anything, get distracted by the most random things, laugh at something that probably wouldn't make sense to anyone else, and somehow make an ordinary day feel a little less ordinary.",
    "I love that you notice little things. The way you tell stories, the way your mind works, how you can be so logical and still have the most unexpected reactions. I love your flower opinions, your random observations, and the fact that a conversation with you can go in approximately seventeen different directions.",
    "And I hope you know that I notice the little things too. I remember things you've said, places we've been, dates that matter, and the tiny moments that probably seemed completely ordinary at the time. Not because I am trying to keep a record of everything, but because I genuinely like having these memories with you.",
    'You once said, "Every day spent with you is a date." I think about that quite often. It\'s such a simple thing to say, but it captures something I really like about us. It doesn\'t always need to be a plan or a special occasion. Sometimes it\'s just us talking, spending time together, or doing absolutely nothing in particular.',
    "I'm really glad it's you, Riruu. I'm glad I get to know you in all these different little ways, and that we get to keep making memories that are ours.",
    "I hope 21 brings you so many things to be excited about. I hope you get to do everything you've been wanting to do, tell all the stories you haven't told yet, see all the places you want to see, and find a hundred more reasons to be happy.",
    'And selfishly, I hope I get to be around for a lot of it.',
    'Happy 21st, Riruu. Thank you for being you, and for making this little corner of my life so special.',
    "Here's to the 27ths, the flowers, the random conversations, the terrible jokes, and all the memories we haven't made yet.",
  ] as string[],
  signOff: 'Love,',
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
