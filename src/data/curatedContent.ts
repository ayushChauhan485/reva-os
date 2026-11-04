// ─────────────────────────────────────────────────────────────────────────────
// CURATED CONTENT — the only chat excerpts on the site.
//
// Every `text` below is copied character-for-character from
// "WhatsApp Chat with Revaa.txt" (export of 2 Oct 2026), with the original
// date, time and sender. Spelling, emoji and typos are kept on purpose.
// The raw export is never copied into this project.
//
// Testimony comes from the reviewed transcripts of the friends' birthday
// videos (Birthday/Friends/_production/INVENTORY-AND-TRANSCRIPTS.md).
// Uncertain words were left out; "…" marks an omission.
// ─────────────────────────────────────────────────────────────────────────────
import type { ChatMessage, Sender, Testimony } from './types';
import puffer from './generated/pufferfishStats.json' with { type: 'json' };

/** How senders are labelled on screen. Attribution stays the same person. */
export const senderLabel: Record<Sender, string> = {
  Ayush: 'Ruru',
  Revaa: 'Reva',
};

export const messages: Record<string, ChatMessage> = {
  // 25 April — the suspicious similarities
  'm-2504-a': { id: 'm-2504-a', sender: 'Ayush', date: '25/04/2026', time: '01:16', text: 'How are we so sameee' },
  'm-2504-b': { id: 'm-2504-b', sender: 'Revaa', date: '25/04/2026', time: '01:19', text: 'I thought the same yesterday' },

  // 27 April — first date (kept inside a sealed note in the archive)
  'm-2704-safe': {
    id: 'm-2704-safe',
    sender: 'Revaa',
    date: '27/04/2026',
    time: '23:08',
    text: 'Idk i have always felt safe and comfortable around you even before ye sabse pehle bhi',
  },

  // 29 April — the first pufferfish
  'm-2904-puffer': { id: 'm-2904-puffer', sender: 'Revaa', date: '29/04/2026', time: '02:23', text: 'Good nightt ruru 🐡' },

  // 3–6 May — three little words
  'm-0305-ily': { id: 'm-0305-ily', sender: 'Ayush', date: '03/05/2026', time: '22:10', text: 'I love you riruu' },
  'm-0605-ilyt': { id: 'm-0605-ilyt', sender: 'Revaa', date: '06/05/2026', time: '21:43', text: 'I love you too' },
  'm-0605-2din': { id: 'm-0605-2din', sender: 'Revaa', date: '06/05/2026', time: '21:43', text: 'I wanted to say it 2 din pehle se' },

  // 30 May — a different definition of a date
  'm-3005-date': { id: 'm-3005-date', sender: 'Revaa', date: '30/05/2026', time: '01:14', text: 'Every day spent with you is a date' },

  // 18 June — white lily
  'm-1806-0': { id: 'm-1806-0', sender: 'Ayush', date: '18/06/2026', time: '12:55', text: 'looking like a lilyy today' },
  'm-1806-a': { id: 'm-1806-a', sender: 'Ayush', date: '18/06/2026', time: '12:56', text: 'a white lily' },
  'm-1806-b': { id: 'm-1806-b', sender: 'Ayush', date: '18/06/2026', time: '12:56', text: 'with pink inwardss' },
  'm-1806-c': { id: 'm-1806-c', sender: 'Ayush', date: '18/06/2026', time: '12:56', text: 'i should get you one righttt' },
  'm-1806-d': { id: 'm-1806-d', sender: 'Revaa', date: '18/06/2026', time: '13:36', text: 'Ye toh cute flower hai' },

  // 28 July — Reva retells an EARLIER moment: she picked Ruru a flower at a petrol pump.
  // The flower moment itself is undated; 28 July is when she told it.
  'm-2807-handpicked': { id: 'm-2807-handpicked', sender: 'Ayush', date: '28/07/2026', time: '00:46', text: 'Handpicked howw' },
  'm-2807-remember': { id: 'm-2807-remember', sender: 'Revaa', date: '28/07/2026', time: '00:46', text: 'Remember i got you a foower' },
  'm-2807-fix': { id: 'm-2807-fix', sender: 'Revaa', date: '28/07/2026', time: '00:46', text: 'Flower' },
  'm-2807-gas': { id: 'm-2807-gas', sender: 'Revaa', date: '28/07/2026', time: '00:46', text: 'I was at a gas station' },
  'm-2807-flower': {
    id: 'm-2807-flower',
    sender: 'Revaa',
    date: '28/07/2026',
    time: '00:47',
    text: 'I looked at that flower and it reminded me of you',
  },
  'm-2807-pump': { id: 'm-2807-pump', sender: 'Revaa', date: '28/07/2026', time: '00:47', text: 'Petrol pump pe thi' },
  'm-2807-pink': { id: 'm-2807-pink', sender: 'Revaa', date: '28/07/2026', time: '00:47', text: 'There were more but pink wala was the kne' },

  // 30 July — the two of them listing their dates; Reva corrects the lake to the 27th
  'm-3007-sat27': { id: 'm-3007-sat27', sender: 'Revaa', date: '30/07/2026', time: '15:23', text: 'Saturday tha 27' },
  'm-3007-repeat': { id: 'm-3007-repeat', sender: 'Revaa', date: '30/07/2026', time: '15:24', text: 'Yeahh first date wali repeat hori hai bhindu' },
  'm-3007-27': { id: 'm-3007-27', sender: 'Revaa', date: '30/07/2026', time: '15:24', text: '27' },

  // 19 September — tiger lily and poppy (context lines included so nothing is misread)
  'm-1909-tiger': {
    id: 'm-1909-tiger',
    sender: 'Ayush',
    date: '19/09/2026',
    time: '16:10',
    text: 'U are the most beautiful tiger Lily I have ever seen in my life',
  },
  'm-1909-oneday': { id: 'm-1909-oneday', sender: 'Ayush', date: '19/09/2026', time: '17:33', text: 'Andd andd u will one day remember this reference of tiger lilyy' },
  'm-1909-notexpect': { id: 'm-1909-notexpect', sender: 'Ayush', date: '19/09/2026', time: '17:34', text: 'Not in a way that u would expect thoo' },
  'm-1909-meaning': { id: 'm-1909-meaning', sender: 'Revaa', date: '19/09/2026', time: '17:49', text: 'Meaning samajh aagya' },
  'm-1909-par': { id: 'm-1909-par', sender: 'Revaa', date: '19/09/2026', time: '17:49', text: 'Par' },
  'm-1909-notfav': { id: 'm-1909-notfav', sender: 'Revaa', date: '19/09/2026', time: '17:49', text: 'Flower ni pasand aaya' },
  'm-1909-poppy': { id: 'm-1909-poppy', sender: 'Revaa', date: '19/09/2026', time: '17:50', text: 'I like poppy flower' },
  'm-1909-yuhi': { id: 'm-1909-yuhi', sender: 'Ayush', date: '19/09/2026', time: '17:50', text: 'Flower to yu hi hai' },
  'm-1909-notabout': { id: 'm-1909-notabout', sender: 'Ayush', date: '19/09/2026', time: '17:50', text: 'It was not about the flower thoo' },
  'm-1909-me': { id: 'm-1909-me', sender: 'Revaa', date: '19/09/2026', time: '17:50', text: 'It was about me😛' },
  'm-1909-notexactly': { id: 'm-1909-notexactly', sender: 'Ayush', date: '19/09/2026', time: '17:50', text: 'Not exactly tooo' },
};

export const testimony: Record<string, Testimony> = {
  't-story-mf1': {
    id: 't-story-mf1',
    witness: 'Mystery Friend 1',
    text: 'I love the way you tell all of your stories.',
    source: 'birthday video, Oct 2026',
  },
  't-story-anusha': {
    id: 't-story-anusha',
    witness: 'Anusha',
    text: '…tells crazy stories with so much interest and passion',
    source: 'birthday video, Oct 2026',
  },
  't-logic-aryaman': {
    id: 't-logic-aryaman',
    witness: 'Aryaman',
    text: '…the title of most logical PDC member. Of course, second to me. Second to me.',
    source: 'birthday video, Oct 2026',
  },
  't-logic-japneet': {
    id: 't-logic-japneet',
    witness: 'Japneet',
    text: "…you're very rational in certain arguments",
    source: 'birthday video, Oct 2026',
  },
  't-months-mf2': {
    id: 't-months-mf2',
    witness: 'Mystery Friend 2',
    text: '…but when we do, we just meet like we talk daily.',
    source: 'birthday video, Oct 2026',
  },
  't-months-kishna': {
    id: 't-months-kishna',
    witness: 'Kishna',
    text: '…mahinon baatein nahi hoti… we still talk every day.',
    source: 'voice note, Oct 2026',
  },
  't-care-japneet': {
    id: 't-care-japneet',
    witness: 'Japneet',
    text: '…you naturally fit in with everyone, and you genuinely cared about people.',
    source: 'birthday video, Oct 2026',
  },
  't-care-suman': {
    id: 't-care-suman',
    witness: 'Suman',
    text: 'people around you are genuinely so lucky to have you in their life. I know I am.',
    source: 'birthday video, Oct 2026',
  },
  't-care-anurag': {
    id: 't-care-anurag',
    witness: 'Anurag',
    text: "You've helped me a lot of times and I'm grateful for that.",
    source: 'birthday video, Oct 2026',
  },
};

/**
 * Recounted by `npm run count-pufferfish` (scripts/count-pufferfish.mjs) from the
 * chat export; `npm run verify-facts` fails if these drift from the export.
 */
export const pufferfishStats = {
  total: puffer.total,
  inGoodnights: puffer.inGoodnights,
  sentByRuru: (puffer.bySender as Record<string, number>).Ayush ?? 0,
  firstSeen: { date: puffer.first.date, time: puffer.first.time, messageId: 'm-2904-puffer' },
  measuredFrom: `chat export ending ${puffer.exportEnds.slice(0, 10).replace(/\//g, '.')}`,
};

/** Facts used across the OS (all verified). */
export const facts = {
  firstDate: { iso: '2026-04-27', place: 'Sector 10 Park, Chandigarh' },
  lakeDay: { iso: '2026-06-27', place: 'Sukhna Lake' },
  birthday: { iso: '2026-10-15', turning: 21 },
  bouquetMade: 'Sept 2026 (12–23 Sep, dated by video files)',
};

export function msg(id: string): ChatMessage {
  const m = messages[id];
  if (!m) throw new Error(`Unknown message id: ${id}`);
  return m;
}
