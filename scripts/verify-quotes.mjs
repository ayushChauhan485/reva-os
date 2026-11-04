// Checks every curated message against the original WhatsApp export:
// same date, time, sender and exact text. Reads the export locally; nothing
// is copied into the project.
//   npm run verify-quotes -- "/path/to/WhatsApp Chat with Revaa.txt"
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { messages } from '../src/data/curatedContent.ts';

const here = dirname(fileURLToPath(import.meta.url));
const chatPath = process.argv[2] ?? resolve(here, '../../../Birthday/WhatsApp Chat with Revaa.txt');
if (!existsSync(chatPath)) {
  console.error(`Chat export not found: ${chatPath}\nPass the path as an argument.`);
  process.exit(2);
}

const lines = readFileSync(chatPath, 'utf8').split(/\r?\n/);
let bad = 0;
for (const m of Object.values(messages)) {
  const want = `${m.date}, ${m.time} - ${m.sender}: ${m.text}`;
  // WhatsApp appends " <This message was edited>" to edited messages
  const ok = lines.some((l) => l === want || l === `${want} <This message was edited>`);
  if (!ok) {
    bad++;
    console.error(`✗ ${m.id}: not found verbatim\n    ${want}`);
  }
}
const n = Object.keys(messages).length;
if (bad) {
  console.error(`\n${bad} of ${n} messages failed verification.`);
  process.exit(1);
}
console.log(`✓ All ${n} curated messages match the export exactly (date, time, sender, text).`);
