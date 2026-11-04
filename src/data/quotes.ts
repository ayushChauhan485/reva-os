// The Reva Dictionary (reva_isms.exe).
// Quotes are references into curatedContent.ts. `definition` is always an
// editor's note by Ruru and is labelled that way on screen.
import type { DictionaryCategory, DictionaryEntry } from './types';

export const categories: { id: DictionaryCategory; label: string }[] = [
  { id: 'reva-being-reva', label: 'Reva being Reva' },
  { id: 'one-liners', label: 'Iconic one-liners' },
  { id: 'framed', label: 'Deserves to be framed' },
  { id: 'logic', label: 'Logic Department' },
  { id: 'funny', label: 'Unexpectedly funny' },
  { id: 'only-ruru', label: 'Only Ruru understands' },
  { id: 'witness', label: 'Witness statements' },
];

export const dictionary: DictionaryEntry[] = [
  {
    id: 'yesterday',
    headword: 'yesterday',
    partOfSpeech: 'adv.',
    category: 'reva-being-reva',
    quote: { kind: 'chat', id: 'm-2504-b' },
    context: ['m-2504-a'],
    definition: 'The art of having already thought of it, a full day before you did.',
  },
  {
    id: 'good-nightt',
    headword: 'good nightt',
    partOfSpeech: 'n., nightly',
    category: 'only-ruru',
    quote: { kind: 'chat', id: 'm-2904-puffer' },
    definition: 'A transmission sent at the end of the day, usually carrying one pufferfish. First recorded 29.04.2026, 02:23. Spelling: with two t’s, always.',
  },
  {
    id: 'two-din',
    headword: '2 din pehle se',
    partOfSpeech: 'phr.',
    category: 'framed',
    quote: { kind: 'chat', id: 'm-0605-2din' },
    context: ['m-0605-ilyt'],
    definition: 'Unit of time. Confirms that the feeling arrived before the announcement did.',
    // same day: 6 May 2026, the bowling day
    photo: 'P12',
  },
  {
    id: 'date',
    headword: 'date',
    partOfSpeech: 'n.',
    category: 'one-liners',
    quote: { kind: 'chat', id: 'm-3005-date' },
    definition: 'Redefined on 30.05.2026. Previous definitions have been withdrawn.',
  },
  {
    id: 'cute',
    headword: 'cute',
    partOfSpeech: 'adj.',
    category: 'reva-being-reva',
    quote: { kind: 'chat', id: 'm-1806-d' },
    context: ['m-1806-a', 'm-1806-b'],
    definition: 'Official review of the white lily, delivered forty minutes after the comparison. Rating: cute. No further notes.',
  },
  {
    id: 'reminded',
    headword: 'reminded',
    partOfSpeech: 'v.',
    category: 'framed',
    quote: { kind: 'chat', id: 'm-2807-flower' },
    after: ['m-2807-pump'],
    definition: 'What happens when an unidentified flower at a petrol pump does its job.',
  },
  {
    id: 'poppy',
    headword: 'poppy',
    partOfSpeech: 'n.',
    category: 'logic',
    quote: { kind: 'chat', id: 'm-1909-poppy' },
    context: ['m-1909-notfav'],
    definition: 'A counter-proposal, filed moments after being compared to a tiger lily. The Logic Department found it sound.',
  },
  {
    id: 'about-me',
    headword: 'about',
    partOfSpeech: 'prep.',
    category: 'funny',
    quote: { kind: 'chat', id: 'm-1909-me' },
    context: ['m-1909-yuhi', 'm-1909-notabout'],
    after: ['m-1909-notexactly'],
    definition: 'See: correct conclusions, reached immediately. Ruling partially upheld on appeal.',
  },
  {
    id: 'stories',
    headword: 'story',
    partOfSpeech: 'n.',
    category: 'witness',
    quote: { kind: 'testimony', id: 't-story-mf1' },
    definition: 'Something Reva tells with such commitment that witnesses bring it up on their own.',
  },
  {
    id: 'logical',
    headword: 'logical',
    partOfSpeech: 'adj.',
    category: 'witness',
    quote: { kind: 'testimony', id: 't-logic-aryaman' },
    definition: 'Ranked #2 by Aryaman. Ranking compiled by Aryaman.',
  },
  {
    id: 'rational',
    headword: 'rational',
    partOfSpeech: 'adj.',
    category: 'witness',
    quote: { kind: 'testimony', id: 't-logic-japneet' },
    definition: 'Independently confirmed by a second witness, with no self-ranking attached.',
  },
];
