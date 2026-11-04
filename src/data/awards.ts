// THE 21ST ANNUAL REVA AWARDS (reva_awards.exe)
// Add, remove, rename or reorder categories here. Evidence references real
// messages/testimony by id. `juryNotes` are Ruru's jokes and are shown as such.
import type { RevaAward } from './types';
import { pufferfishStats } from './curatedContent.ts';

export const ceremony = {
  title: 'THE 21ST ANNUAL REVA AWARDS',
  subtitle: 'Celebrating excellence in being Reva since the beginning.',
  details: [
    ['Presented by', 'Ruru Productions'],
    ['Jury', 'One extremely biased individual'],
    ['Eligibility', 'Reva, obviously'],
    ['Venue', 'Somewhere in the Ruru universe'],
    ['Edition', '21.0'],
  ] as [string, string][],
  enter: 'ENTER THE CEREMONY',
  nomination: 'THE ACADEMY HAS A DECISION TO MAKE.',
  goesTo: 'AND THE AWARD GOES TO…',
  closing: {
    lines: [
      'THAT CONCLUDES THE 21ST ANNUAL REVA AWARDS.',
      'Thank you for being an exceptionally difficult person to categorise.',
      'See you at the 22nd edition.',
    ],
  },
};

export const awards: RevaAward[] = [
  {
    id: 'storyteller',
    title: 'The Storyteller of the Year',
    subtitle: 'For the person whose stories deserve their own television series.',
    description: 'Some people tell stories. Reva creates entire cinematic universes.',
    winner: 'Reva',
    evidence: [
      { kind: 'testimony', ref: 't-story-mf1' },
      { kind: 'testimony', ref: 't-story-anusha' },
    ],
    juryNotes: ['Two witnesses. Recorded separately. No coordination detected.'],
    image: 'P08',
    trophyStyle: 'quill',
    isUnlocked: true,
  },
  {
    id: 'logic',
    title: 'Chairperson of the Logic Department',
    subtitle: 'For outstanding achievement in rational argument and making the case.',
    description: 'The jury has reviewed the evidence. The arguments remain under investigation.',
    winner: 'Reva',
    evidence: [
      { kind: 'testimony', ref: 't-logic-japneet' },
      { kind: 'testimony', ref: 't-logic-aryaman' },
    ],
    juryNotes: [
      'Official rankings, as submitted: 1. Aryaman (according to Aryaman). 2. Reva.',
      'Results not independently verified. The Academy has overruled the ranking anyway.',
    ],
    image: 'P03',
    trophyStyle: 'scales',
    isUnlocked: true,
  },
  {
    id: 'no-loading',
    title: 'Friendship Without Loading Time',
    subtitle: 'For friendships that resume instantly, no matter how long the pause.',
    description: 'Months can pass. The connection does not need to reconnect.',
    winner: 'Reva',
    evidence: [
      { kind: 'testimony', ref: 't-months-mf2' },
      { kind: 'testimony', ref: 't-months-kishna' },
    ],
    juryNotes: ['Pattern detected: two witnesses, same finding. Buffering: none.'],
    image: 'P19',
    trophyStyle: 'loop',
    isUnlocked: true,
  },
  {
    id: 'cares',
    title: 'The People’s Choice: Actually Cares About People',
    subtitle: 'Voted by the people. The people were unusually specific.',
    description: 'Several people, recording separately, arrived at the same answer.',
    winner: 'Reva',
    evidence: [
      { kind: 'testimony', ref: 't-care-japneet' },
      { kind: 'testimony', ref: 't-care-suman' },
      { kind: 'testimony', ref: 't-care-anurag' },
    ],
    juryNotes: ['This one is not a joke. The Academy will resume being ridiculous shortly.'],
    image: 'P04',
    gallery: ['P04', 'P08', 'P19', 'P20'],
    trophyStyle: 'hands',
    isUnlocked: true,
  },
  {
    id: 'pufferfish',
    title: 'Pufferfish Lifetime Achievement',
    subtitle: 'For sustained excellence in the field of goodnight fish.',
    description: 'A career measured in pufferfish. The Academy has run the numbers.',
    winner: 'Reva',
    evidence: [
      { kind: 'chat', ref: 'm-2904-puffer' },
      { kind: 'stat', text: `${pufferfishStats.total} pufferfish sent in total` },
      { kind: 'stat', text: `${pufferfishStats.inGoodnights} of them inside goodnight messages` },
      { kind: 'stat', text: `Pufferfish sent by Ruru in the same period: ${pufferfishStats.sentByRuru}` },
    ],
    juryNotes: [`Recounted from the ${pufferfishStats.measuredFrom}. Career ongoing.`],
    trophyStyle: 'puffer',
    gallery: ['P03', 'P17', 'P01', 'P02'],
    evidenceDate: '29.04.2026',
    isUnlocked: true,
  },
  {
    id: 'plot-twist',
    title: 'Best Flower Plot Twist',
    subtitle: 'For the most unexpected turn in a flower conversation.',
    description: 'A tiger lily was nominated. The nominee filed a counter-proposal. Then a twist.',
    winner: 'Reva',
    evidence: [
      { kind: 'chat', ref: 'm-1909-tiger' },
      { kind: 'chat', ref: 'm-1909-notfav' },
      { kind: 'chat', ref: 'm-1909-poppy' },
      { kind: 'chat', ref: 'm-1909-yuhi' },
      { kind: 'chat', ref: 'm-1909-notabout' },
      { kind: 'chat', ref: 'm-1909-me' },
      { kind: 'chat', ref: 'm-1909-notexactly' },
    ],
    juryNotes: ['Ruling: partially upheld on appeal.'],
    trophyStyle: 'poppy',
    evidenceDate: '19.09.2026',
    isUnlocked: true,
  },
  {
    id: 'definition',
    title: 'Best Definition of a Date',
    subtitle: 'For rewriting the dictionary in one line.',
    description: 'Dictionaries have been informed. Several are reconsidering their careers.',
    winner: 'Reva',
    evidence: [{ kind: 'chat', ref: 'm-3005-date' }],
    juryNotes: ['Submitted at 01:14, which the Academy considers peak one-liner hours.'],
    image: 'P09',
    trophyStyle: 'calendar',
    evidenceDate: '30.05.2026',
    isUnlocked: true,
  },
  {
    id: 'lost-and-found',
    title: 'Outstanding Achievement in Finding Things',
    subtitle: 'A hidden category. Only awarded to people who go looking.',
    description: 'Searched a room for a pufferfish, a flower, a calendar, a photograph and a message. Found all of them.',
    winner: 'Reva',
    juryNotes: ['This category does not appear in the official programme. Neither does the room.'],
    trophyStyle: 'magnifier',
    isUnlocked: false,
  },
];

/** The final award of the ceremony, revealed after the closing lines. Written by Ruru (05.11.2026). */
export const specialRecognition = {
  id: 'ruru-special',
  title: 'Ruru’s Special Recognition Award',
  subtitle: 'A special dedication to Reva.',
  trophyStyle: 'star' as const,
  /** the photograph shown with the dedication (any photo id) */
  image: 'P19',
  /** one string per paragraph; leave empty to hide the award */
  dedication: [
    "And finally, there's one award I don't think I could put into a category.",
    "Not because there aren't enough things to recognise, but because I wouldn't know where to start.",
    "For the stories you tell, the way you think, the way you somehow manage to be both incredibly logical and completely unpredictable. For the little things you notice, the way you care, and all the different versions of you that I've slowly got to know.",
    'For the person who made 27th April a date worth remembering, 6th May even more special, and the 27th of every month something to look forward to.',
    'For making flowers mean a little more than they used to. For all the conversations that went on longer than expected. For the memories that I can still picture in my head without having to look them up in an archive.',
    'And most importantly, for being someone I am genuinely, ridiculously happy to have in my life.',
    "This award doesn't really have a runner-up, a voting round, or a jury.",
    "It's just from me.",
  ] as string[],
  winnerLine: 'And the winner is... you, Riruu. Always you.',
  signOff: 'With love,',
  signature: 'Ruru 🐡',
  placeholderNote: 'Add the dedication in src/data/awards.ts → specialRecognition.dedication.',
};

/** Silly acceptance-speech options. Responses are the Academy's, never Reva's. */
export const acceptance = {
  prompt: 'Would you like to thank the academy, your supporters, or simply yourself?',
  options: [
    { id: 'academy', label: 'Thank the academy', response: 'The academy accepts. The academy is one person. He is visibly emotional.' },
    {
      id: 'supporters',
      label: 'Thank my supporters',
      response: 'Your supporters have been notified. That includes one pufferfish, who would like it on record.',
    },
    { id: 'myself', label: 'Simply myself', response: 'Bold. Accurate. The academy wishes it had thought of that.' },
  ],
};

/** The People's Choice Awards. Every result is Reva. That is the joke. */
export const polls = [
  {
    id: 'quality',
    question: 'Most iconic quality',
    options: ['Storytelling', 'Logic (ranked #2 by Aryaman)', 'Actually caring about people', 'Pufferfish output'],
  },
  {
    id: 'trait',
    question: 'Best personality trait',
    options: ['Already thought of it yesterday', 'Counter-proposals', 'No loading time', 'Two t’s in “nightt”'],
  },
  {
    id: 'moment',
    question: 'Most memorable moment',
    options: ['Sector 10, 27.04', 'Bowling, 06.05', 'Lake day, 27.06', 'The petrol-pump flower'],
  },
  {
    id: 'legend',
    question: 'Most likely to become a legendary story',
    options: ['“It was about me😛”', 'The poppy counter-proposal', 'The 146 pufferfish', 'Any story Reva tells'],
  },
];

export const pollCopy = {
  recorded: 'Your vote has been recorded.',
  verdict: 'After an extensive independent investigation, Reva has won.',
  footnote: 'Jury independence: questionable.',
};
