// Renders docs/contact-sheet.jpg: every photo in the inventory (used and
// excluded), labelled, from the ORIGINAL files. Private; never shipped.
// Run: npm run contact-sheet
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, existsSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const cfg = JSON.parse(readFileSync(join(here, 'asset-sources.json'), 'utf8'));
const srcRoot = resolve(here, cfg.sourceRoot);
const tmp = mkdtempSync(join(tmpdir(), 'reva-sheet-'));

const W = 280;
const H = 290;
const COLS = 8;
const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);

const entries = [
  ...Object.entries(cfg.photos).map(([id, p]) => ({ id, ...p, used: true })),
  ...Object.entries(cfg.excluded).map(([id, p]) => ({ id, ...p, used: false })),
];

const comp = [];
for (const [i, e] of entries.entries()) {
  let file = join(srcRoot, e.video ?? e.src);
  if (!existsSync(file)) continue;
  if (file.endsWith('.heic')) {
    const jpg = join(tmp, `${e.id}.jpg`);
    execFileSync('sips', ['-s', 'format', 'jpeg', file, '--out', jpg], { stdio: 'ignore' });
    file = jpg;
  }
  if (e.video) {
    const jpg = join(tmp, `${e.id}.jpg`);
    execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-ss', String(e.at), '-i', file, '-frames:v', '1', jpg]);
    file = jpg;
  }
  const img = await sharp(file).rotate(e.rotate ?? undefined).resize(W - 12, H - 40, { fit: 'contain', background: '#ffffff' }).toBuffer();
  const x = (i % COLS) * W;
  const y = Math.floor(i / COLS) * H;
  const colour = e.used ? '#2f7d4f' : '#c0392b';
  const label = `${e.id} · ${e.used ? 'USED' : 'EXCLUDED'}${e.derivative ? ' · +edit' : ''}${e.rotate ? ' · rotated' : ''}`;
  const svg = Buffer.from(
    `<svg width="${W}" height="30"><rect width="${W}" height="30" fill="${colour}"/><text x="8" y="20" font-family="Menlo, monospace" font-size="13" fill="#fff">${esc(label)}</text></svg>`,
  );
  comp.push({ input: svg, left: x, top: y }, { input: img, left: x + 6, top: y + 34 });
}

const rows = Math.ceil(entries.length / COLS);
mkdirSync(join(root, 'docs'), { recursive: true });
await sharp({ create: { width: COLS * W, height: rows * H, channels: 3, background: '#e9e4da' } })
  .composite(comp)
  .jpeg({ quality: 80 })
  .toFile(join(root, 'docs/contact-sheet.jpg'));
console.log(`✓ docs/contact-sheet.jpg (${entries.length} photos)`);
