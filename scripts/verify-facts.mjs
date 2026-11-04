// npm run verify-facts — the factual-content gate. Fails (exit 1) on any problem.
//
//  1. every evidence line in src/data/verifiedFacts.ts exists verbatim in the export
//  2. the pufferfish stats shipped in the app equal a fresh recount of the export
//  3. every fact cited by displayed content (memories, calendar, photos) is "confirmed"
//  4. photo associations: memory/calendar photos are confirmed for that memory/date;
//     P15 never touches the lake day; confirmed associations cite confirmed facts;
//     file dates are never presented as verified dates
//  5. every photo in the registry exists in asset-sources.json + generated files,
//     media-index photos are in the approved allow-list, nothing excluded is used
//  6. every message id referenced anywhere exists in curatedContent.ts
//
//   npm run verify-facts -- "/path/to/WhatsApp Chat with Revaa.txt"
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, count, DEFAULT_CHAT } from './count-pufferfish.mjs';
import { facts } from '../src/data/verifiedFacts.ts';
import { messages, pufferfishStats } from '../src/data/curatedContent.ts';
import { memories } from '../src/data/memories.ts';
import { calendarEvents, calendarCopy } from '../src/data/calendar.ts';
import { photoLibrary, albums, photoDims } from '../src/data/photoLibrary.ts';
import { flowers } from '../src/data/flowers.ts';
import { dictionary } from '../src/data/quotes.ts';
import { awards, specialRecognition } from '../src/data/awards.ts';

const here = dirname(fileURLToPath(import.meta.url));
const errors = [];
const warn = [];
const fail = (m) => errors.push(m);
let checks = 0;
const ok = () => checks++;

// ── 1. evidence lines ────────────────────────────────────────────────────
const chatPath = process.argv[2] ?? DEFAULT_CHAT;
if (!existsSync(chatPath)) {
  console.error(`Chat export not found: ${chatPath}`);
  process.exit(2);
}
const raw = readFileSync(chatPath, 'utf8');
const lines = new Set(raw.split(/\r?\n/));
for (const f of facts) {
  for (const e of f.evidence ?? []) {
    const line = `${e.date}, ${e.time} - ${e.sender}: ${e.text}`;
    if (lines.has(line)) ok();
    else fail(`[fact ${f.id}] evidence not found verbatim: ${line}`);
  }
}

// ── 2. pufferfish recount ────────────────────────────────────────────────
const fresh = count(parse(raw));
const shipped = JSON.parse(readFileSync(resolve(here, '../src/data/generated/pufferfishStats.json'), 'utf8'));
for (const k of ['total', 'inGoodnights', 'messagesWithPuffer']) {
  if (fresh[k] === shipped[k]) ok();
  else fail(`pufferfish ${k}: shipped ${shipped[k]} but export recounts ${fresh[k]} (run npm run count-pufferfish)`);
}
if (pufferfishStats.total === fresh.total && pufferfishStats.sentByRuru === (fresh.bySender.Ayush ?? 0)) ok();
else fail('pufferfishStats in curatedContent.ts disagree with the recount');
const first = messages[pufferfishStats.firstSeen.messageId];
if (first && first.date === fresh.first.date && first.time === fresh.first.time && first.text === fresh.first.text) ok();
else fail(`first pufferfish message is not the first 🐡 in the export (${fresh.first.date} ${fresh.first.time})`);

// ── 3. displayed content cites confirmed facts only ──────────────────────
const factById = new Map(facts.map((f) => [f.id, f]));
const cite = (where, ids = []) => {
  if (!ids.length) fail(`${where} cites no facts`);
  for (const id of ids) {
    const f = factById.get(id);
    if (!f) fail(`${where} cites unknown fact "${id}"`);
    else if (f.verificationStatus !== 'confirmed') fail(`${where} displays fact "${id}" which is ${f.verificationStatus}`);
    else ok();
  }
};
memories.forEach((m) => cite(`memory ${m.id}`, m.factIds));
calendarEvents.forEach((e) => cite(`calendar ${e.date}`, e.factIds));
for (const p of photoLibrary) {
  if (p.eventAssociation === 'confirmed') cite(`photo ${p.id} (confirmed association)`, p.factIds);
}
// facts that are not confirmed must not be cited by anything displayed as an established memory
for (const f of facts.filter((x) => x.verificationStatus !== 'confirmed')) {
  const usedBy = [...memories.filter((m) => m.factIds.includes(f.id)), ...calendarEvents.filter((e) => e.factIds.includes(f.id))];
  if (usedBy.length) fail(`unconfirmed fact "${f.id}" is used by ${usedBy.length} displayed item(s)`);
  else ok();
}

// ── 4. photo associations ────────────────────────────────────────────────
const photo = new Map(photoLibrary.map((p) => [p.id, p]));
for (const m of memories) {
  for (const id of m.photos ?? []) {
    const p = photo.get(id);
    if (!p) fail(`memory ${m.id} uses unknown photo ${id}`);
    else if (p.eventAssociation !== 'confirmed') fail(`memory ${m.id} shows ${id}, whose association is ${p.eventAssociation}`);
    else if (p.relatedMemoryId !== m.id) fail(`memory ${m.id} shows ${id}, but that photo belongs to ${p.relatedMemoryId ?? 'no memory'}`);
    else ok();
  }
}
for (const e of calendarEvents) {
  for (const id of e.photos ?? []) {
    const p = photo.get(id);
    if (!p) fail(`calendar ${e.date} uses unknown photo ${id}`);
    else if (p.eventAssociation !== 'confirmed' || (p.eventDate ?? p.verifiedDate) !== e.date) fail(`calendar ${e.date} shows ${id}, which is not confirmed for that date`);
    else ok();
  }
}
const lake = memories.find((m) => m.id === 'lake-day');
const p15 = photo.get('P15');
if (p15 && p15.eventAssociation === 'unassigned' && !p15.relatedMemoryId && !p15.eventDate && !p15.verifiedDate) ok();
else fail('P15 must stay unassigned (no event, memory or date)');
if (lake && !(lake.photos ?? []).includes('P15')) ok();
else fail('P15 is attached to the lake-day memory');
if (!(calendarEvents.find((e) => e.date === '2026-06-27')?.photos ?? []).length) ok();
else fail('27 June calendar entry has a photograph; none is verified');
if (!/lake|sukhna/i.test(`${p15?.title} ${p15?.description} ${p15?.tags.join(' ')}`)) ok();
else fail('P15 is captioned or tagged as the lake');
for (const p of photoLibrary) {
  if (p.relatedMemoryId && p.eventAssociation !== 'confirmed') fail(`photo ${p.id} links to memory ${p.relatedMemoryId} without a confirmed association`);
  if (p.dateStatus === 'verified' && !p.verifiedDate && !p.eventDate) fail(`photo ${p.id} is "verified" but has no date`);
  if (p.dateStatus === 'approximate' && (p.verifiedDate || p.eventDate)) fail(`photo ${p.id} mixes an approximate file date with a verified date`);
  if (p.fileDate && p.dateStatus === 'verified') fail(`photo ${p.id}: a file date can't make a date "verified"`);
  ok();
}
for (const a of albums.filter((x) => ['bowling', 'club27', 'beginnings'].includes(x.id))) {
  for (const p of photoLibrary.filter((x) => x.albumIds.includes(a.id))) {
    if (p.eventAssociation === 'confirmed') ok();
    else fail(`album "${a.title}" is date-based but contains ${p.id}, which is ${p.eventAssociation}`);
  }
}
// albums ⊂ registry, covers exist
for (const a of albums) {
  if (a.cover && !photo.has(a.cover)) fail(`album ${a.id} cover ${a.cover} is not in the registry`);
  else ok();
}
// image references in other apps
const refs = [
  ...flowers.flatMap((f) => [f.photo, f.handmadePhoto, ...(f.timeline ?? [])].filter(Boolean).map((id) => [`flower ${f.id}`, id])),
  ...dictionary.filter((d) => d.photo).map((d) => [`dictionary ${d.id}`, d.photo]),
  ...awards.flatMap((a) => [a.image, ...(a.gallery ?? [])].filter(Boolean).map((id) => [`award ${a.id}`, id])),
  ['special recognition', specialRecognition.image],
];
for (const [where, id] of refs) {
  if (photo.has(id)) ok();
  else fail(`${where} references photo ${id}, which is not in the registry`);
}
// flower photos: handmade photos must be tagged handmade (never passed off as real flowers)
for (const f of flowers) {
  for (const id of [f.handmadePhoto, ...(f.timeline ?? [])].filter(Boolean)) {
    if (photo.get(id)?.tags.includes('handmade')) ok();
    else fail(`flower ${f.id}: ${id} is shown as the handmade version but isn't tagged handmade`);
  }
}
if (!flowers.find((f) => f.id === 'white-memoir')?.photo) ok();
else if (!photo.get(flowers.find((f) => f.id === 'white-memoir').photo)?.tags.includes('white memoir')) fail('White Memoir photo must be tagged "white memoir" (and be the real bouquet)');

// ── 5. assets ────────────────────────────────────────────────────────────
const sources = JSON.parse(readFileSync(resolve(here, 'asset-sources.json'), 'utf8'));
const allowCsv = readFileSync(resolve(here, sources.sourceRoot, 'film-safe/media-allowlist.csv'), 'utf8');
const allowed = new Set(allowCsv.split(/\r?\n/).slice(1).map((l) => l.split(',')[0]).filter(Boolean));
for (const p of photoLibrary) {
  if (!sources.photos[p.id]) fail(`photo ${p.id} has no entry in scripts/asset-sources.json`);
  else if (!photoDims[p.id]) fail(`photo ${p.id} has not been generated (npm run assets)`);
  else ok();
  if (sources.excluded[p.id]) fail(`photo ${p.id} is excluded (${sources.excluded[p.id].reason}) but is in the registry`);
  if (/^P\d+$/.test(p.id) || p.id === 'BQ-P01') {
    if (allowed.has(p.id)) ok();
    else fail(`photo ${p.id} is not in film-safe/media-allowlist.csv`);
  }
}
for (const id of Object.keys(sources.photos)) {
  if (!photo.has(id)) warn.push(`asset-sources.json has ${id} but the registry doesn't use it`);
}

// ── 6. message references ────────────────────────────────────────────────
const GAP = '…';
const msgRefs = [
  ...memories.flatMap((m) => [...(m.messages ?? []), ...(m.sealed?.messageIds ?? [])].map((id) => [`memory ${m.id}`, id])),
  ...flowers.flatMap((f) => (f.messages ?? []).map((id) => [`flower ${f.id}`, id])),
  ...dictionary.flatMap((d) => [d.quote.kind === 'chat' ? d.quote.id : null, ...(d.context ?? []), ...(d.after ?? [])].filter(Boolean).map((id) => [`dictionary ${d.id}`, id])),
  ...awards.flatMap((a) => (a.evidence ?? []).filter((e) => e.kind === 'chat').map((e) => [`award ${a.id}`, e.ref])),
  ...[calendarCopy.featuredQuoteId, ...calendarCopy.originIds].map((id) => ['calendar', id]),
];
for (const [where, id] of msgRefs) {
  if (id === GAP) continue;
  if (messages[id]) ok();
  else fail(`${where} references unknown message ${id}`);
}
// chronological order inside each memory thread
const stamp = (m) => m.date.split('/').reverse().join('') + m.time.replace(':', '');
for (const m of memories) {
  const xs = (m.messages ?? []).filter((id) => id !== GAP).map((id) => messages[id]).filter(Boolean);
  for (let i = 1; i < xs.length; i++) {
    if (stamp(xs[i]) < stamp(xs[i - 1])) fail(`memory ${m.id}: messages out of chronological order (${xs[i - 1].id} → ${xs[i].id})`);
    else ok();
  }
}

// ── report ───────────────────────────────────────────────────────────────
warn.forEach((w) => console.warn('  ! ' + w));
if (errors.length) {
  errors.forEach((e) => console.error('✗ ' + e));
  console.error(`\n${errors.length} problem(s); ${checks} checks passed.`);
  process.exit(1);
}
console.log(`✓ verify-facts: ${checks} checks passed (${facts.length} facts, ${photoLibrary.length} photos, ${memories.length} memories, ${calendarEvents.length} calendar entries).`);
