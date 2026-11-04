// Recounts 🐡 in the WhatsApp export and writes src/data/generated/pufferfishStats.json.
// Reproducible: same export in, same numbers out. The export itself is only read.
//   npm run count-pufferfish -- "/path/to/WhatsApp Chat with Revaa.txt"
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
export const DEFAULT_CHAT = resolve(here, '../../../Birthday/WhatsApp Chat with Revaa.txt');

/** Same definition used everywhere: a message "is a goodnight" if it matches this. */
// "good n" + i catches typos like "Good nihjt"; "good news" etc. don't match.
export const GOODNIGHT = /\bg(?:oo+|u)d+\s*-?\s*ni|\bg+n+\b|\bni+g+h+t+y*\b|\bshubh\s*ratri/i;
const PUFFER = /🐡/gu;

/** Splits the export into messages; lines without a timestamp continue the previous message. */
export function parse(text) {
  const head = /^(\d{2}\/\d{2}\/\d{4}), (\d{2}:\d{2}) - ([^:]+): (.*)$/;
  const out = [];
  for (const line of text.split(/\r?\n/)) {
    const m = head.exec(line);
    if (m) out.push({ date: m[1], time: m[2], sender: m[3], text: m[4] });
    else if (out.length && !/^\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2} - /.test(line)) out[out.length - 1].text += '\n' + line;
  }
  return out;
}

export function count(messages) {
  let total = 0;
  let inGoodnights = 0;
  const bySender = {};
  let first = null;
  let messagesWithPuffer = 0;
  for (const m of messages) {
    const n = (m.text.match(PUFFER) ?? []).length;
    if (!n) continue;
    total += n;
    messagesWithPuffer++;
    bySender[m.sender] = (bySender[m.sender] ?? 0) + n;
    if (GOODNIGHT.test(m.text)) inGoodnights += n;
    if (!first) first = { date: m.date, time: m.time, sender: m.sender, text: m.text.replace(' <This message was edited>', '') };
  }
  const last = messages[messages.length - 1];
  return {
    total,
    messagesWithPuffer,
    inGoodnights,
    bySender,
    first,
    exportEnds: last ? `${last.date} ${last.time}` : null,
    definitions: {
      total: 'every 🐡 character in every message',
      inGoodnights: `🐡 characters inside messages matching ${GOODNIGHT}`,
    },
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const chat = process.argv[2] ?? DEFAULT_CHAT;
  if (!existsSync(chat)) {
    console.error(`Chat export not found: ${chat}`);
    process.exit(2);
  }
  const stats = count(parse(readFileSync(chat, 'utf8')));
  const out = resolve(here, '../src/data/generated/pufferfishStats.json');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(stats, null, 2) + '\n');
  console.log(JSON.stringify(stats, null, 2));
}
