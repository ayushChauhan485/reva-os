// Lists personal content that is still a placeholder. Runs before every build
// as a reminder; it warns, it never blocks the build.
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { letter } from '../src/data/letter.ts';
import { specialRecognition } from '../src/data/awards.ts';
import { flowers } from '../src/data/flowers.ts';

const here = dirname(fileURLToPath(import.meta.url));
const todo = [];

if (!letter.paragraphs.length) todo.push('Final letter (classified.exe): src/data/letter.ts → paragraphs');
if (!specialRecognition.dedication.trim())
  todo.push('Ruru’s Special Recognition dedication: src/data/awards.ts → specialRecognition.dedication (award stays hidden until filled)');
for (const f of flowers) if (f.photoPlaceholder) todo.push(`Flower photo for “${f.name}”: ${f.photoPlaceholder}`);
if (!existsSync(resolve(here, '../public/assets/photos/p20.webp'))) todo.push('Photos not generated: run npm run assets');

if (todo.length) {
  console.warn('\n⚠ REVA.EXE content still waiting for Ruru:');
  todo.forEach((t) => console.warn('  • ' + t));
  console.warn('');
} else {
  console.log('✓ No placeholders left.');
}
