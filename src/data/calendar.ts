// The 27th Club (the_27th.exe).
// Only verified dates appear. Past 27ths without a memory stay "unrecorded";
// future ones stay locked. Nothing is invented for them.
import type { CalendarEvent } from './types';

export const calendarCopy = {
  title: 'The 27th Club',
  tagline: 'Some dates are already memories. Some are still waiting to happen.',
  featuredQuoteId: 'm-3005-date',
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
  },
  {
    date: '2026-06-27',
    title: 'Lake day',
    description: 'Sukhna. The club’s second recorded meeting.',
    memoryId: 'lake-day',
    photo: 'lakeDay',
    kind: 'meeting',
  },
  { date: '2026-04-25', title: 'Suspicious similarities', description: '“How are we so sameee”', memoryId: 'similarities', kind: 'memory' },
  { date: '2026-04-29', title: 'First pufferfish', description: 'Good nightt, with a fish.', memoryId: 'pufferfish', kind: 'memory' },
  { date: '2026-05-03', title: 'I love you', description: 'Said on the 3rd.', memoryId: 'three-words', kind: 'memory' },
  {
    date: '2026-05-06',
    title: 'I love you too + bowling',
    description: 'Said back on the 6th. Also bowling.',
    memoryId: 'three-words',
    photo: 'bowlingLanes',
    kind: 'memory',
  },
  { date: '2026-05-30', title: 'A different definition', description: '“Every day spent with you is a date”', memoryId: 'definition', kind: 'memory' },
  { date: '2026-06-18', title: 'White lily', description: 'Pink inwards.', memoryId: 'white-lily', kind: 'memory' },
  { date: '2026-07-28', title: 'Petrol-pump flower', description: 'Species unknown.', memoryId: 'petrol-pump', kind: 'memory' },
  { date: '2026-09-19', title: 'Tiger lily & poppy', description: 'A counter-proposal.', memoryId: 'tiger-lily', kind: 'memory' },
  { date: '2026-10-15', title: 'REVA.EXE v21.0 released', description: 'Reva turns 21.', kind: 'milestone' },
];
