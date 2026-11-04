import { useEffect, useRef, useState } from 'react';
import { completions, runCommand, suggestions, type Line } from '../../data/terminalCommands';
import { play } from '../../lib/sound';
import { useDesktop } from '../../store/desktopStore';
import { prefersReducedMotion } from '../../store/settingsStore';
import { useUI } from '../../store/uiStore';

const BANNER: Line[] = [
  { text: 'RURU TERMINAL · build 21.0', tone: 'accent' },
  { text: 'A small secret space. Prewritten. No AI, no internet, just Ruru.', tone: 'dim' },
  { text: 'Type help, or tap a suggestion below.', tone: 'dim' },
  { text: '' },
];

type Row = Line & { id: number; input?: boolean };
let rid = 1;

export default function Terminal() {
  const [rows, setRows] = useState<Row[]>(() => BANNER.map((l) => ({ ...l, id: rid++ })));
  const [value, setValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [rows]);

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  const push = (ls: Line[]) => setRows((r) => [...r, ...ls.map((l) => ({ ...l, id: rid++ }))]);

  const exec = (raw: string) => {
    const input = raw.trim();
    setRows((r) => [...r, { id: rid++, text: `reva@ruru:~$ ${input}`, input: true }]);
    setValue('');
    setHIdx(null);
    if (!input) return;
    setHistory((h) => [...h.filter((x) => x !== input), input]);
    const res = runCommand(input);
    if (res.action?.type === 'clear') {
      setRows([]);
      return;
    }
    if (res.lines[0]?.tone === 'err') play('error');
    const finish = () => {
      push([{ text: '' }]);
      const a = res.action;
      if (!a) return;
      if (a.type === 'open') window.setTimeout(() => useDesktop.getState().open(a.app, { memoryId: a.memoryId }), 450);
      if (a.type === 'pufferfish') window.setTimeout(() => useUI.getState().summonPufferfish(), 300);
      if (a.type === 'close') window.setTimeout(() => useDesktop.getState().close('terminal'), 700);
    };
    if (res.slow && !prefersReducedMotion()) {
      setBusy(true);
      res.lines.forEach((l, i) =>
        window.setTimeout(() => {
          push([l]);
          play('type');
          if (i === res.lines.length - 1) {
            setBusy(false);
            finish();
          }
        }, 200 * (i + 1)),
      );
    } else {
      push(res.lines);
      finish();
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !busy) {
      exec(value);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!history.length) return;
      const i = hIdx === null ? history.length - 1 : Math.max(0, hIdx - 1);
      setHIdx(i);
      setValue(history[i]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (hIdx === null) return;
      const i = hIdx + 1;
      if (i >= history.length) {
        setHIdx(null);
        setValue('');
      } else {
        setHIdx(i);
        setValue(history[i]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const c = completions(value);
      if (c.length === 1) setValue(`/${c[0]}`);
      else if (c.length > 1) push([{ text: c.map((x) => '/' + x).join('   '), tone: 'dim' }]);
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setRows([]);
    } else if (e.key.length === 1) {
      play('type');
    }
  };

  const hint = value ? completions(value).slice(0, 4) : [];

  return (
    <div className="term" onClick={() => window.getSelection()?.isCollapsed && inputRef.current?.focus({ preventScroll: true })}>
      <div className="term__out scroll" role="log" aria-live="polite">
        {rows.map((r) => (
          <div key={r.id} className={`term__line ${r.tone ? `t-${r.tone}` : ''} ${r.input ? 't-input' : ''}`}>
            {r.text || ' '}
          </div>
        ))}
        <div className="term__prompt">
          <span className="t-ok">reva@ruru</span>
          <span className="t-dim">:~$</span>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKey}
            aria-label="Terminal command"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="send"
          />
          {!value && <span className="cursor-block term__cursor" aria-hidden="true" />}
        </div>
        {hint.length > 0 && (
          <div className="term__hint t-dim">
            {hint.map((h) => '/' + h).join('   ')} <span>· Tab</span>
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div className="term__chips" aria-label="Suggested commands">
        {suggestions.map((s) => (
          <button key={s} className="term__chip" onClick={(e) => (e.stopPropagation(), !busy && exec(s))}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
