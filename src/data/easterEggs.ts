// Notifications, pufferfish lines, screensaver captions and boot copy.
// All editorial. Facts used here are verified in curatedContent.ts.
import type { AppId } from './apps';
import { pufferfishStats as pf } from './curatedContent.ts';

export interface SystemNote {
  title: string;
  body?: string;
  app?: AppId;
}

export const bootLines = [
  'REVA.EXE',
  '',
  'Initializing birthday protocol...',
  'Loading personality modules...',
  'Retrieving memories...',
  'Checking for excessive cuteness...',
  '',
  'Warning: user is dangerously iconic.',
  '',
  'SYSTEM VERSION: 21.0',
  '',
  'WELCOME, REVA.',
];

export const randomNotes: SystemNote[] = [
  { title: 'New memory discovered.', body: 'Something in the archive is asking to be opened.', app: 'archive' },
  { title: 'Reva has been detected being Reva.', body: 'No action required.' },
  { title: 'Ruru.exe is running in the background.', body: 'It usually is.', app: 'terminal' },
  { title: 'Warning: too much main character energy detected.', body: 'System stable. Barely.' },
  { title: 'Flower Department has a new entry.', body: 'Species: under review.', app: 'flowers' },
  { title: 'The Reva Academy is ready to announce its decisions.', body: 'Envelopes are sealed. Seats are warm.', app: 'awards' },
  { title: 'Pufferfish census complete.', body: `${pf.total} counted. All of them yours.` },
  { title: 'Photo of the day has changed.', body: 'Something from the library is on the desktop.', app: 'photos' },
  { title: 'The Wall of Reva has been rearranged.', body: 'Nobody touched it. Probably.', app: 'photos' },
  { title: 'Calendar reminder.', body: 'There is always another 27th coming.', app: 'calendar' },
];

export const pufferLines = [
  '🐡 blub.',
  '🐡 Just checking in. Carry on.',
  `🐡 First seen: ${pf.firstSeen.date.replace(/\//g, '.')}, ${pf.firstSeen.time}.`,
  `🐡 ${pf.total} of us. All sent by you.`,
  pf.sentByRuru === 0 ? '🐡 Ruru has sent zero of us. Make of that what you will.' : `🐡 Ruru has sent ${pf.sentByRuru} of us.`,
  '🐡 *puffs up importantly*',
  '🐡 The terminal knows more. Try /pufferfish.',
];

export const screensaverLines = [
  'REVA.EXE is resting.',
  'Every day spent with you is a date.',
  `${pf.total} pufferfish and counting.`,
  'Some dates are still waiting to happen.',
  'Touch anything to come back.',
];

/** Hidden pufferfish tucked inside apps. Find all five. */
export const hiddenPufferfish = ['archive', 'flowers', 'dictionary', 'calendar', 'awards'] as const;
export type HiddenSpot = (typeof hiddenPufferfish)[number];
