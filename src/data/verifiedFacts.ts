// ─────────────────────────────────────────────────────────────────────────────
// SOURCE OF TRUTH for every personal fact REVA.EXE states.
//
// This file is audit data: `npm run verify-facts` reads it, the UI does not, so
// evidence-only quotes here are NOT shipped in the website bundle.
//
// `evidence` lines are checked verbatim against the chat export. Content files
// (memories, calendar, photo library) cite facts by id; verify-facts fails if
// displayed content cites anything that is not "confirmed".
// ─────────────────────────────────────────────────────────────────────────────

export type FactStatus = 'confirmed' | 'provisional' | 'unconfirmed';

export interface ChatEvidence {
  date: string; // DD/MM/YYYY as in the export
  time: string;
  sender: 'Ayush' | 'Revaa';
  text: string; // exact
}

export interface VerifiedFact {
  id: string;
  claim: string;
  value: string;
  source: string;
  sourceDate?: string;
  sourceTime?: string;
  verificationStatus: FactStatus;
  /** Kind of date, so capture dates, event dates and file dates never get mixed up. */
  dateKind?: 'event' | 'capture' | 'file' | 'message' | 'none';
  evidence?: ChatEvidence[];
  notes?: string;
}

export const facts: VerifiedFact[] = [
  // ── Relationship timeline ──────────────────────────────────────────────
  {
    id: 'first-date-date',
    claim: 'The first date was on 27 April 2026',
    value: '2026-04-27',
    source: 'Chat 30/07/2026 (Reva lists "Then 27th april" after Ruru writes "Then first date"); Ruru (V1 + V2 briefs)',
    sourceDate: '30/07/2026',
    sourceTime: '15:20',
    verificationStatus: 'confirmed',
    dateKind: 'event',
    evidence: [
      { date: '30/07/2026', time: '15:20', sender: 'Ayush', text: 'Then first date' },
      { date: '30/07/2026', time: '15:20', sender: 'Revaa', text: 'Then 27th april' },
    ],
    notes: '27 April 2026 was a Monday. A 12 May message about a "Sunday first date" is about another couple, not them.',
  },
  {
    id: 'first-date-place',
    claim: 'The first date was at a park in Sector 10, Chandigarh',
    value: 'Sector 10 Park, Chandigarh',
    source: 'Ruru (V1 + V2 briefs, first-hand); chat 27/04 16:15 "10 chalte hai firr"; chat 10/09 16:35 "The park where we were the first date"',
    verificationStatus: 'confirmed',
    dateKind: 'none',
    evidence: [
      { date: '27/04/2026', time: '16:15', sender: 'Ayush', text: '10 chalte hai firr' },
      { date: '10/09/2026', time: '16:35', sender: 'Ayush', text: 'The park where we were the first date' },
    ],
    notes: 'The chat says "10" and "the park"; the words "Sector 10 Park" are Ruru\'s own first-hand description.',
  },
  {
    id: 'safe-comfortable',
    claim: 'On the night of the first date Reva wrote that she had always felt safe and comfortable around him',
    value: '27/04/2026 23:08',
    source: 'Chat',
    sourceDate: '27/04/2026',
    sourceTime: '23:08',
    verificationStatus: 'confirmed',
    dateKind: 'message',
    evidence: [{ date: '27/04/2026', time: '23:08', sender: 'Revaa', text: 'Idk i have always felt safe and comfortable around you even before ye sabse pehle bhi' }],
  },
  {
    id: 'sameee',
    claim: '25 April: "How are we so sameee" / "I thought the same yesterday"',
    value: '25/04/2026 01:16 and 01:19',
    source: 'Chat',
    verificationStatus: 'confirmed',
    dateKind: 'message',
    evidence: [
      { date: '25/04/2026', time: '01:16', sender: 'Ayush', text: 'How are we so sameee' },
      { date: '25/04/2026', time: '01:19', sender: 'Revaa', text: 'I thought the same yesterday' },
    ],
  },
  {
    id: 'first-puffer',
    claim: 'First recorded 🐡: "Good nightt ruru 🐡"',
    value: '29/04/2026 02:23, sent by Reva',
    source: 'Chat; recount script',
    verificationStatus: 'confirmed',
    dateKind: 'message',
    evidence: [{ date: '29/04/2026', time: '02:23', sender: 'Revaa', text: 'Good nightt ruru 🐡 <This message was edited>' }],
    notes: 'The export marks this message as edited. No origin story for the emoji is stated anywhere, so none is told.',
  },
  {
    id: 'puffer-stats',
    claim: 'Pufferfish statistics',
    value: 'See src/data/generated/pufferfishStats.json (146 total, 133 in goodnights, all from Reva, 0 from Ruru)',
    source: 'scripts/count-pufferfish.mjs over the export ending 02/10/2026 19:16',
    verificationStatus: 'confirmed',
    dateKind: 'none',
    notes: '"Goodnight" = message matching the GOODNIGHT pattern in the script (includes typos such as "Good nihjt"). Re-run on a newer export to update.',
  },
  {
    id: 'first-ily',
    claim: 'First "I love you" (Ruru)',
    value: '03/05/2026 22:10',
    source: 'Chat',
    verificationStatus: 'confirmed',
    dateKind: 'message',
    evidence: [{ date: '03/05/2026', time: '22:10', sender: 'Ayush', text: 'I love you riruu' }],
  },
  {
    id: 'first-ily-too',
    claim: 'First "I love you too" (Reva), and she had wanted to say it two days earlier',
    value: '06/05/2026 21:43',
    source: 'Chat',
    verificationStatus: 'confirmed',
    dateKind: 'message',
    evidence: [
      { date: '06/05/2026', time: '21:43', sender: 'Revaa', text: 'I love you too' },
      { date: '06/05/2026', time: '21:43', sender: 'Revaa', text: 'I wanted to say it 2 din pehle se' },
    ],
  },
  {
    id: 'bowling-day',
    claim: '6 May 2026 was the bowling day',
    value: '2026-05-06',
    source: 'Chat 06/05 10:09–20:01',
    verificationStatus: 'confirmed',
    dateKind: 'event',
    evidence: [
      { date: '06/05/2026', time: '20:01', sender: 'Ayush', text: 'Jeet gyeee hummm 💪💪' },
      { date: '06/05/2026', time: '20:01', sender: 'Ayush', text: 'Bowling meii' },
    ],
  },
  {
    id: 'date-quote',
    claim: '"Every day spent with you is a date"',
    value: '30/05/2026 01:14, Reva',
    source: 'Chat',
    verificationStatus: 'confirmed',
    dateKind: 'message',
    evidence: [{ date: '30/05/2026', time: '01:14', sender: 'Revaa', text: 'Every day spent with you is a date' }],
  },
  {
    id: 'white-lily',
    claim: '18 June: Ruru compared Reva to a white lily with pink inwards; she called it a cute flower',
    value: '18/06/2026 12:55–13:36',
    source: 'Chat',
    verificationStatus: 'confirmed',
    dateKind: 'message',
    evidence: [
      { date: '18/06/2026', time: '12:55', sender: 'Ayush', text: 'looking like a lilyy today' },
      { date: '18/06/2026', time: '12:56', sender: 'Ayush', text: 'a white lily' },
      { date: '18/06/2026', time: '12:56', sender: 'Ayush', text: 'with pink inwardss' },
      { date: '18/06/2026', time: '12:56', sender: 'Ayush', text: 'i should get you one righttt' },
      { date: '18/06/2026', time: '13:36', sender: 'Revaa', text: 'Ye toh cute flower hai' },
    ],
  },
  {
    id: 'lake-day',
    claim: 'The lake outing was at Sukhna on 27 June 2026 (a Saturday)',
    value: '2026-06-27, Sukhna Lake',
    source: 'Chat 27/06 (Sukhna plans, live locations shared 08:23); chat 30/07 15:23 Reva corrects "26" to "Saturday tha 27"',
    verificationStatus: 'confirmed',
    dateKind: 'event',
    evidence: [
      { date: '27/06/2026', time: '00:52', sender: 'Revaa', text: 'Fir sukhna aajenge' },
      { date: '30/07/2026', time: '15:21', sender: 'Revaa', text: '26 june lake' },
      { date: '30/07/2026', time: '15:23', sender: 'Revaa', text: 'Saturday tha 27' },
    ],
    notes: 'Reva first wrote 26 June, then corrected herself to the 27th. No photograph of the lake exists in the approved collection (the Wishes review also found none).',
  },
  {
    id: 'twenty-seven-repeats',
    claim: 'Reva noticed their first-date date keeps repeating: 27',
    value: '30/07/2026 15:24',
    source: 'Chat',
    verificationStatus: 'confirmed',
    dateKind: 'message',
    evidence: [
      { date: '30/07/2026', time: '15:24', sender: 'Revaa', text: 'Yeahh first date wali repeat hori hai bhindu' },
      { date: '30/07/2026', time: '15:24', sender: 'Revaa', text: '27' },
    ],
  },
  {
    id: 'petrol-pump-flower',
    claim: 'Reva once picked Ruru a pink flower at a petrol pump because it reminded her of him; she told this on 28 July',
    value: 'Told 28/07/2026 00:46–00:47; the flower moment itself is undated',
    source: 'Chat',
    verificationStatus: 'confirmed',
    dateKind: 'message',
    evidence: [
      { date: '28/07/2026', time: '00:46', sender: 'Revaa', text: 'Remember i got you a foower' },
      { date: '28/07/2026', time: '00:46', sender: 'Revaa', text: 'I was at a gas station' },
      { date: '28/07/2026', time: '00:47', sender: 'Revaa', text: 'I looked at that flower and it reminded me of you' },
      { date: '28/07/2026', time: '00:47', sender: 'Revaa', text: 'Petrol pump pe thi' },
      { date: '28/07/2026', time: '00:47', sender: 'Revaa', text: 'There were more but pink wala was the kne' },
    ],
    notes: 'V1 wrongly treated 28 July as the date of the flower and claimed it was "never photographed". Both corrected.',
  },
  {
    id: 'tiger-lily',
    claim: '19 September: the tiger-lily reference, then the poppy exchange',
    value: '19/09/2026 16:10–17:50',
    source: 'Chat',
    verificationStatus: 'confirmed',
    dateKind: 'message',
    evidence: [
      { date: '19/09/2026', time: '16:10', sender: 'Ayush', text: 'U are the most beautiful tiger Lily I have ever seen in my life' },
      { date: '19/09/2026', time: '17:33', sender: 'Ayush', text: 'Andd andd u will one day remember this reference of tiger lilyy' },
      { date: '19/09/2026', time: '17:34', sender: 'Ayush', text: 'Not in a way that u would expect thoo' },
      { date: '19/09/2026', time: '17:49', sender: 'Revaa', text: 'Flower ni pasand aaya' },
      { date: '19/09/2026', time: '17:50', sender: 'Revaa', text: 'I like poppy flower' },
      { date: '19/09/2026', time: '17:50', sender: 'Revaa', text: 'It was about me😛' },
    ],
  },
  {
    id: 'handmade-bouquet',
    claim: 'Ruru made pipe-cleaner lilies and poppies between 12 and 23 September 2026',
    value: '12–23 Sep 2026',
    source: 'Dates of the making-of videos (WhatsApp file names BQ-V01…BQ-V15); media-index.csv',
    verificationStatus: 'confirmed',
    dateKind: 'file',
    notes: 'File dates are when each clip was saved/sent, so each step is dated "by file". Poppies first appear in the 21 Sep clip.',
  },
  {
    id: 'bouquet-photographed',
    claim: 'The finished handmade bouquet was photographed on 6 October 2026, 18:36',
    value: '2026-10-06 18:36',
    source: 'Camera file names IMG20261006183621/31/39/52.heic',
    verificationStatus: 'confirmed',
    dateKind: 'capture',
  },
  {
    id: 'white-memoir',
    claim: 'White Memoir is the white-rose and white-flower bouquet for her 21st',
    value: 'White Memoir',
    source: 'Ruru (V1 + V2 briefs)',
    verificationStatus: 'confirmed',
    dateKind: 'none',
    notes: 'No photograph of it exists in the project. Its exact date is not stated, so none is shown.',
  },
  {
    id: 'birthday',
    claim: 'Reva\'s 21st birthday is 15 October 2026',
    value: '2026-10-15',
    source: 'Party invitation Birthday/REVA.png ("October 15th 2026"); chat 14/09 "31 days to ur shaadi still" (shaadi = birthday); chat 21/08 shared birthday with Abdul Kalam (15 Oct)',
    verificationStatus: 'confirmed',
    dateKind: 'event',
    evidence: [
      { date: '14/09/2026', time: '23:32', sender: 'Ayush', text: '31 days to ur shaadi still' },
      { date: '21/08/2026', time: '00:34', sender: 'Revaa', text: 'Abdul kalam and i share the same birthday' },
    ],
  },
  {
    id: 'almirah',
    claim: 'Reva always wanted to see what was kept in the almirahs beside Prod (context of P20)',
    value: '14/06/2026 02:15',
    source: 'media-index.csv P20 notes; chat 14/06',
    verificationStatus: 'confirmed',
    dateKind: 'none',
    notes: 'Supports the caption "Has always wanted to know what\'s inside old cabinets." The photo itself is undated.',
  },

  // ── Friends' testimony (reviewed transcripts) ──────────────────────────
  {
    id: 'testimony',
    claim: 'Award evidence quotes from friends',
    value: 'Mystery Friend 1, Anusha, Aryaman, Japneet, Mystery Friend 2, Kishna, Suman, Anurag',
    source: 'Birthday/Friends/_production/INVENTORY-AND-TRANSCRIPTS.md and EDITORIAL-CLAIMS-v2.md',
    verificationStatus: 'confirmed',
    dateKind: 'none',
    notes: 'Uncertain words are left out. Kishna\'s line now uses only words both reviewed transcripts agree on.',
  },

  // ── Photograph associations ────────────────────────────────────────────
  {
    id: 'photo-bowling',
    claim: 'P12, P13 and P14 were taken on the bowling day, 6 May 2026',
    value: '2026-05-06',
    source: 'Camera stamp "06/05" (year wrong: camera clock), dress chosen that morning in chat, bowling lanes in P14; media-index STRONGLY SUPPORTED; confirmed by Ruru in the V2 brief',
    verificationStatus: 'confirmed',
    dateKind: 'capture',
  },
  {
    id: 'photo-p15',
    claim: 'P15 (pickleball court) was taken on the morning of 27 June',
    value: 'Unassigned',
    source: 'media-index.csv: "PLAUSIBLE" only (she mentioned a court near Sukhna that morning)',
    verificationStatus: 'provisional',
    dateKind: 'none',
    notes: 'P15 shows a pickleball court, not the lake. It is NOT shown as a lake or 27 June photo anywhere.',
  },
  {
    id: 'photo-p04-date',
    claim: 'P04 (rooftop at night) was taken on 6 May',
    value: 'Unassigned',
    source: 'media-index.csv: "PLAUSIBLE" from the dress only',
    verificationStatus: 'provisional',
    dateKind: 'none',
    notes: 'Not shown as a 6 May photo.',
  },
  {
    id: 'photo-first-date',
    claim: 'A photograph of the first date exists in the approved collection',
    value: 'None',
    source: 'media-index.csv; Wishes/CREATIVE_DIRECTION_v1.md ("27 Apr exists only as two of her own selfie videos")',
    verificationStatus: 'unconfirmed',
    dateKind: 'none',
    notes: 'The first-date memory is shown without a photograph.',
  },
  {
    id: 'official-27-july',
    claim: 'They became official on 27 July 2026',
    value: 'Not shown',
    source: 'Only stated in Wishes/CREATIVE_DIRECTION_v1.md; not found in the chat',
    verificationStatus: 'unconfirmed',
    dateKind: 'event',
    notes: 'Left out of the 27th Club until you confirm it.',
  },
  {
    id: 'flower-wala-2605',
    claim: '26 May "flower wala" day',
    value: 'Not shown',
    source: 'Chat 30/07 15:21',
    verificationStatus: 'unconfirmed',
    dateKind: 'event',
    notes: 'Meaning unresolved (your instruction). Not used.',
  },
];

export const factById = (id: string) => facts.find((f) => f.id === id);
