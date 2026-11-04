// ruru.exe commands. Each returns prewritten lines; no network, no AI.
import { apps, type AppId } from './apps';
import { facts, msg, pufferfishStats, senderLabel } from './curatedContent';
import { dotDate, memories } from './memories';
import { flowers } from './flowers';

export type Line = { text: string; tone?: 'dim' | 'ok' | 'warn' | 'err' | 'accent' | 'quote' };

export interface CommandResult {
  lines: Line[];
  /** Typed out slowly, line by line */
  slow?: boolean;
  action?:
    | { type: 'open'; app: AppId; memoryId?: string }
    | { type: 'clear' }
    | { type: 'pufferfish' }
    | { type: 'photo' }
    | { type: 'develop' }
    | { type: 'close' };
}

const l = (text: string, tone?: Line['tone']): Line => ({ text, tone });

function daysSince(iso: string) {
  const start = new Date(`${iso}T00:00:00`).getTime();
  return Math.floor((Date.now() - start) / 86_400_000);
}

const PUFFER_ART = [
  '        \\ | | /',
  '     -- .-""-. --',
  '    -  /  o   \\>  ',
  '    - |   ___  |=<',
  '     - \\  \\_/ / >',
  '     -- `----` --',
  '        / | | \\',
];

export const commands: Record<string, { help: string; run: (arg: string) => CommandResult }> = {
  help: {
    help: 'list commands',
    run: () => ({
      lines: [
        l('Available commands:', 'accent'),
        ...Object.entries(commands)
          .filter(([k]) => k !== 'help' && !hidden.has(k))
          .map(([k, c]) => l(`  ${('/' + k).padEnd(16)} ${c.help}`)),
        l(''),
        l('Tip: ↑/↓ for history, Tab to autocomplete.', 'dim'),
      ],
    }),
  },
  'about-ruru': {
    help: 'who runs this terminal',
    run: () => ({
      lines: [
        l('USER PROFILE: ruru', 'accent'),
        l(`  name ............ Ruru 🐡 (per goodnight messages since ${pufferfishStats.firstSeen.date.replace(/\//g, '.')})`),
        l('  role ............ jury of one, sole engineer of this OS'),
        l(`  side quest ...... pipe-cleaner lilies, ${facts.bouquetMade}`),
        l(`  pufferfish sent . ${pufferfishStats.sentByRuru}`),
        l(`  pufferfish recv . ${pufferfishStats.total}`),
        l('  bias ............ extreme, declared', 'warn'),
      ],
    }),
  },
  'first-date': {
    help: 'look up the first date',
    run: () => ({
      slow: true,
      lines: [
        l('Searching archive...', 'dim'),
        l('Date found:', 'accent'),
        l(dotDate(facts.firstDate.iso)),
        l(''),
        l('Location:', 'accent'),
        l(`${facts.firstDate.place}.`),
        l(''),
        l('Status:', 'accent'),
        l('Definitely worth remembering.', 'ok'),
      ],
      action: undefined,
    }),
  },
  flowers: {
    help: 'list the flower catalogue',
    run: () => ({
      lines: [
        l('FLOWER DEPARTMENT · catalogue', 'accent'),
        ...flowers.map((f) => l(`  ${(f.date ?? '').padEnd(12)} ${f.name}`)),
        l(''),
        l('Type /open flowers to visit.', 'dim'),
      ],
    }),
  },
  goodnight: {
    help: 'the nightly transmission',
    run: () => {
      const m = msg(pufferfishStats.firstSeen.messageId);
      return {
        slow: true,
        lines: [
          l('Replaying first recorded goodnight-with-fish...', 'dim'),
          l(`[${m.date.replace(/\//g, '.')} ${m.time}] ${senderLabel[m.sender]}: ${m.text}`, 'quote'),
          l(''),
          l(`Goodnights carrying a pufferfish: ${pufferfishStats.inGoodnights}`),
          l(`Measured from: ${pufferfishStats.measuredFrom}`, 'dim'),
          l('Good night, Reva.', 'ok'),
        ],
      };
    },
  },
  'random-memory': {
    help: 'pull a random file from the archive',
    run: () => {
      const m = memories[Math.floor(Math.random() * memories.length)];
      return {
        lines: [l('Pulling a random record...', 'dim'), l(`${dotDate(m.date)}  ${m.title}`, 'accent'), ...m.intro.map((t) => l('  ' + t)), l(''), l('Opening the archive...', 'dim')],
        action: { type: 'open', app: 'archive', memoryId: m.id },
      };
    },
  },
  'why-reva': {
    help: 'request an explanation',
    run: () => ({
      slow: true,
      lines: [l('Searching for an explanation...', 'dim'), l(''), l('Error 404:', 'err'), l('No single explanation found.'), l(''), l('Too many reasons detected.', 'warn')],
    }),
  },
  pufferfish: {
    help: 'summon the fish',
    run: () => ({
      lines: [
        ...PUFFER_ART.map((t) => l(t, 'accent')),
        l(''),
        l(`Pufferfish on record: ${pufferfishStats.total}. Sent by Reva: ${pufferfishStats.total}.`),
        l('Releasing one onto the desktop...', 'dim'),
      ],
      action: { type: 'pufferfish' },
    }),
  },
  lake: {
    help: 'the second meeting of the 27th Club',
    run: () => ({
      lines: [l('Date found:', 'accent'), l(dotDate(facts.lakeDay.iso)), l('Location:', 'accent'), l(`${facts.lakeDay.place}.`), l('Club status: second recorded 27th.', 'ok')],
    }),
  },
  stats: {
    help: 'system statistics',
    run: () => ({
      lines: [
        l('REVA OS · system statistics', 'accent'),
        l(`  version ............ 21.0`),
        l(`  days since 27.04 ... ${daysSince(facts.firstDate.iso)}`),
        l(`  pufferfish ......... ${pufferfishStats.total}`),
        l(`  archived memories .. ${memories.length}`),
        l(`  users .............. 1 (very specific)`),
      ],
    }),
  },
  open: {
    help: 'open an app, e.g. /open awards',
    run: (arg) => {
      const id = resolveApp(arg);
      if (!id) return { lines: [l(`open: no such app "${arg}". Try: ${openable.join(', ')}`, 'err')] };
      return { lines: [l(`Launching ${apps[id].file}...`, 'dim')], action: { type: 'open', app: id } };
    },
  },
  photo: {
    help: 'pull a random photograph',
    run: () => ({ lines: [l('Fetching a frame from the library...', 'dim')], action: { type: 'photo' } }),
  },
  develop: {
    help: 'hidden',
    run: () => ({
      slow: true,
      lines: [l('Opening the darkroom...', 'dim'), l('Developer: ready. Fixer: ready.', 'dim'), l('One photograph is coming up in photos.exe.', 'ok')],
      action: { type: 'develop' },
    }),
  },
  play: {
    help: 'something is hiding in lost+found',
    run: () => ({ lines: [l('Mounting lost+found...', 'dim')], action: { type: 'open', app: 'lostfound' } }),
  },
  whoami: { help: 'identify current user', run: () => ({ lines: [l('reva — the only user this system was built for.')] }) },
  clear: { help: 'clear the screen', run: () => ({ lines: [], action: { type: 'clear' } }) },
  exit: { help: 'close the terminal', run: () => ({ lines: [l('Bye. Ruru.exe keeps running in the background.', 'dim')], action: { type: 'close' } }) },
  sudo: { help: 'hidden', run: () => ({ lines: [l('Permission denied: only Reva has root on this system.', 'err')] }) },
  'i-love-you': { help: 'hidden', run: () => ({ lines: [l('Message delivered. Response cached since 06.05.2026.', 'ok')] }) },
};

const hidden = new Set(['sudo', 'i-love-you', 'develop']);

const openable = ['archive', 'photos', 'flowers', 'dictionary', 'calendar', 'awards', 'classified', 'settings'];

function resolveApp(arg: string): AppId | null {
  const a = arg.trim().toLowerCase().replace(/\.exe$/, '');
  const alias: Record<string, AppId> = {
    archive: 'archive', our_archive: 'archive',
    photos: 'photos', photo: 'photos', library: 'photos',
    flowers: 'flowers', flower: 'flowers',
    dictionary: 'dictionary', reva_isms: 'dictionary',
    calendar: 'calendar', the_27th: 'calendar', '27th': 'calendar',
    awards: 'awards', reva_awards: 'awards',
    classified: 'classified', secret: 'classified',
    settings: 'settings',
    'lost+found': 'lostfound', lostfound: 'lostfound',
  };
  return alias[a] ?? null;
}

export const suggestions = ['help', '/why-reva', '/first-date', '/goodnight', '/pufferfish', '/photo', '/random-memory', '/flowers', '/about-ruru'];

export function runCommand(input: string): CommandResult {
  const raw = input.trim();
  if (!raw) return { lines: [] };
  const [head, ...rest] = raw.replace(/^\//, '').split(/\s+/);
  const key = head.toLowerCase();
  const cmd = commands[key];
  if (!cmd) {
    const near = Object.keys(commands).find((k) => !hidden.has(k) && (k.startsWith(key.slice(0, 3)) || key.startsWith(k)));
    return {
      lines: [l(`command not found: ${head}`, 'err'), l(near ? `Did you mean /${near}? Type help for everything.` : 'Type help to see what Ruru.exe understands.', 'dim')],
    };
  }
  return cmd.run(rest.join(' '));
}

export function completions(prefix: string): string[] {
  const p = prefix.replace(/^\//, '').toLowerCase();
  return Object.keys(commands).filter((k) => !hidden.has(k) && k.startsWith(p));
}
