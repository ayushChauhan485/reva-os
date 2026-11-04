// The relationship archive (our_archive.exe).
// `intro` lines are Ruru's own captions. Real messages are referenced by id
// from curatedContent.ts so their wording can't drift.
import { GAP, type Memory } from './types.ts';

export const archiveIntro = {
  title: 'The Museum of Us',
  lines: ['A small archive.', 'Carefully filed.', 'Mostly by date, occasionally by feeling.'],
  heroCaption: 'Head of Archives. Has always wanted to know what’s inside old cabinets.',
};

export const memories: Memory[] = [
  {
    id: 'similarities',
    date: '2026-04-25',
    folderName: '25.04_SUSPICIOUS_SIMILARITIES',
    title: 'The Suspicious Similarities',
    intro: ['One of us noticed.', 'The other had noticed', 'a day earlier.'],
    messages: ['m-2504-a', 'm-2504-b'],
    factIds: ['sameee'],
    tags: ['early days', 'conversation'],
  },
  {
    id: 'beginning',
    date: '2026-04-27',
    folderName: '27.04_THE_BEGINNING',
    title: 'The Beginning',
    intro: ['Sector 10.', 'A first date.', 'And the beginning of something', 'that became a lot more special.'],
    place: 'Sector 10 Park, Chandigarh',
    factIds: ['first-date-date', 'first-date-place', 'safe-comfortable'],
    sealed: {
      label: 'later_that_night.txt',
      messageIds: ['m-2704-safe'],
      note: 'Filed quietly. Opened gently.',
    },
    tags: ['first date', '27th', 'park'],
  },
  {
    id: 'pufferfish',
    date: '2026-04-29',
    folderName: '29.04_FIRST_PUFFERFISH',
    title: 'The First Pufferfish',
    intro: ['02:23.', 'A goodnight.', 'And a small fish that never left.'],
    messages: ['m-2904-puffer'],
    factIds: ['first-puffer'],
    tags: ['goodnight', 'pufferfish'],
  },
  {
    id: 'three-words',
    date: '2026-05-03',
    folderName: '03–06.05_THREE_LITTLE_WORDS',
    title: 'Three Little Words',
    intro: ['Said on the 3rd.', 'Said back on the 6th,', 'after apparently waiting two days to.', 'There was also bowling.'],
    messages: ['m-0305-ily', 'm-0605-ilyt', 'm-0605-2din'],
    photos: ['P12', 'P14', 'P13'],
    factIds: ['first-ily', 'first-ily-too', 'bowling-day', 'photo-bowling'],
    tags: ['i love you', 'bowling'],
  },
  {
    id: 'definition',
    date: '2026-05-30',
    folderName: '30.05_A_DIFFERENT_DEFINITION',
    title: 'A Different Definition of a Date',
    intro: ['No reservation.', 'No plan.', 'Apparently it still counts.'],
    messages: ['m-3005-date'],
    factIds: ['date-quote'],
    tags: ['quote', 'dates'],
  },
  {
    id: 'white-lily',
    date: '2026-06-18',
    folderName: '18.06_WHITE_LILY',
    title: 'White Lily',
    intro: ['A comparison was made.', 'A flower was reviewed.', 'The review: cute.'],
    messages: ['m-1806-0', 'm-1806-a', 'm-1806-b', 'm-1806-c', GAP, 'm-1806-d'],
    factIds: ['white-lily'],
    tags: ['flowers', 'lily'],
  },
  {
    id: 'lake-day',
    date: '2026-06-27',
    folderName: '27.06_LAKE_DAY',
    title: 'Lake Day',
    intro: ['Another 27th.', 'Sukhna.', 'There’s no photograph of the lake in the archive.', 'The date is enough.'],
    place: 'Sukhna Lake',
    messages: ['m-3007-sat27'],
    factIds: ['lake-day'],
    tags: ['27th', 'lake'],
  },
  {
    id: 'petrol-pump',
    date: '2026-07-28',
    folderName: '28.07_THE_PETROL_PUMP_FLOWER',
    title: 'The Petrol-Pump Flower',
    intro: ['A story, told on 28 July.', 'Somewhere earlier: a petrol pump,', 'a pink flower,', 'and someone it reminded her of.'],
    messages: ['m-2807-handpicked', 'm-2807-remember', 'm-2807-fix', GAP, 'm-2807-gas', GAP, 'm-2807-flower', 'm-2807-pump', GAP, 'm-2807-pink'],
    factIds: ['petrol-pump-flower'],
    tags: ['flowers'],
  },
  {
    id: 'tiger-lily',
    date: '2026-09-19',
    folderName: '19.09_TIGER_LILY_AND_POPPY',
    title: 'Tiger Lily, and a Counter-Proposal',
    intro: ['A tiger lily was nominated.', 'The meaning landed. The flower did not.', 'A poppy was proposed instead.'],
    messages: ['m-1909-tiger', GAP, 'm-1909-oneday', 'm-1909-notexpect', GAP, 'm-1909-meaning', 'm-1909-par', 'm-1909-notfav', GAP, 'm-1909-poppy', 'm-1909-yuhi', 'm-1909-notabout', 'm-1909-me', 'm-1909-notexactly'],
    factIds: ['tiger-lily'],
    tags: ['flowers', 'poppy', 'tiger lily'],
  },
];

export const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

export function memoryById(id: string) {
  return memories.find((m) => m.id === id);
}

/** Display date "27.04.2026" from ISO */
export function dotDate(iso: string) {
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
}
