// The 27th Club (the_27th.exe).
// Only verified dates appear. Past 27ths without a memory stay "unrecorded";
// future ones stay locked. Nothing is invented for them.
import type { CalendarEvent } from './types';

export const calendarCopy = {
  title: 'The 27th Club',
  tagline: 'Some dates are already memories. Some are still waiting to happen.',
  featuredQuoteId: 'm-3005-date',
  /** Reva noticing the 27 (30.07.2026) */
  originIds: ['m-3007-repeat', 'm-3007-27'],
  unrecorded: 'Unrecorded. Not every 27th needs a folder.',
  locked: 'Still waiting to happen.',
};

export const calendarRange = { start: '2026-04', end: '2027-04' };

export const calendarEvents: CalendarEvent[] = [
  {
    date: '2026-04-27',
    title: 'First date',
    description: 'Sector 10 Park, Chandigarh. Founding meeting of the 27th Club.',
    memoryId: 'beginning',
    kind: 'meeting',
    factIds: ['first-date-date', 'first-date-place'],
  },
  {
    date: '2026-06-27',
    title: 'Lake day',
    description: 'Sukhna. The club’s second recorded meeting. (First written as the 26th, then corrected: “Saturday tha 27”.)',
    memoryId: 'lake-day',
    kind: 'meeting',
    factIds: ['lake-day'],
  },
  { date: '2026-04-25', title: 'Suspicious similarities', description: '“How are we so sameee”', memoryId: 'similarities', kind: 'memory', factIds: ['sameee'] },
  { date: '2026-04-29', title: 'First pufferfish', description: 'Good nightt, with a fish.', memoryId: 'pufferfish', kind: 'memory', factIds: ['first-puffer'] },
  { date: '2026-05-03', title: 'I love you', description: 'Said on the 3rd.', memoryId: 'three-words', kind: 'memory', factIds: ['first-ily'] },
  {
    date: '2026-05-06',
    title: 'I love you too + bowling',
    description: 'Said back on the 6th. Also bowling.',
    memoryId: 'three-words',
    photos: ['P14', 'P12', 'P13'],
    kind: 'memory',
    factIds: ['first-ily-too', 'bowling-day', 'photo-bowling'],
  },
  { date: '2026-05-30', title: 'A different definition', description: '“Every day spent with you is a date”', memoryId: 'definition', kind: 'memory', factIds: ['date-quote'] },
  { date: '2026-06-18', title: 'White lily', description: 'Pink inwards.', memoryId: 'white-lily', kind: 'memory', factIds: ['white-lily'] },
  { date: '2026-07-28', title: 'A flower story, told', description: 'Reva tells the petrol-pump flower story. (The flower itself is from an earlier, undated day.)', memoryId: 'petrol-pump', kind: 'memory', factIds: ['petrol-pump-flower'] },
  { date: '2026-09-19', title: 'Tiger lily & poppy', description: 'A counter-proposal.', memoryId: 'tiger-lily', kind: 'memory', factIds: ['tiger-lily'] },
  { date: '2026-10-15', title: 'REVA.EXE v21.0 released', description: 'Reva turns 21.', kind: 'milestone', factIds: ['birthday'] },
  { date: '2026-07-30', title: 'The club is named', description: 'Listing their dates, Reva notices the first-date date keeps repeating: 27.', kind: 'memory', factIds: ['twenty-seven-repeats'] },
];
