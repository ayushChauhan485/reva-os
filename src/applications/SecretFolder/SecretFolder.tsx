// classified.exe — a playful lock, then the letter.
// The lock is a game, not security: the answer and the letter ship in the page.
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { Img } from '../../components/common';
import { handwritingHeader } from '../../lib/photos';
import { letter, letterPlaceholder, puzzle } from '../../data/letter';
import { play } from '../../lib/sound';
import { useDesktop } from '../../store/desktopStore';
import { useProgress } from '../../store/progressStore';

function normalise(s: string) {
  const digits = s.replace(/[^0-9]/g, ' ').trim().split(/\s+/);
  if (digits.length === 3) {
    const [d, m, y] = digits;
    return `${d.padStart(2, '0')}.${m.padStart(2, '0')}.${y.length === 2 ? '20' + y : y}`;
  }
  const only = s.replace(/\D/g, '');
  if (only.length === 8) return `${only.slice(0, 2)}.${only.slice(2, 4)}.${only.slice(4)}`;
  const words = s.toLowerCase();
  if (/27(th)?\s*(apr|april)\s*(2026)?/.test(words) || /(apr|april)\s*27(th)?/.test(words)) return puzzle.answer;
  return s.trim();
}

export default function SecretFolder() {
  const unlocked = useProgress((s) => s.secretUnlocked);
  const [stage, setStage] = useState<'locked' | 'opening' | 'letter'>(unlocked ? 'letter' : 'locked');
  return (
    <div className="secret">
      <AnimatePresence mode="wait">
        {stage === 'letter' ? (
          <motion.div key="letter" className="secret__letter-wrap scroll" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>
            <Letter />
          </motion.div>
        ) : stage === 'opening' ? (
          <motion.div key="opening" className="secret__opening" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.8 } }}>
            <p className="mono">{puzzle.unlocked}</p>
          </motion.div>
        ) : (
          <motion.div key="lock" exit={{ opacity: 0, scale: 0.98 }}>
            <Lock
              onUnlock={() => {
                play('unlock');
                useProgress.getState().patch({ secretUnlocked: true });
                setStage('opening');
                window.setTimeout(() => setStage('letter'), 2000);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Lock({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState('');
  const [tries, setTries] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);
  const [shake, setShake] = useState(0);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    if (normalise(value) === puzzle.answer) return onUnlock();
    play('error');
    setTries((t) => t + 1);
    setShake((s) => s + 1);
    setMsg(puzzle.wrong[tries % puzzle.wrong.length]);
    // the form remounts to replay the shake, so start the next attempt clean
    setValue('');
  };

  const hintsShown = Math.min(puzzle.hints.length, Math.max(0, tries - 1));

  return (
    <div className="lock">
      <div className="lock__file">
        <div className="lock__stamp">CLASSIFIED</div>
        <div className="mono lock__meta">FILE NO. 27-04 · CLEARANCE: ONE PERSON</div>
      </div>
      <p className="lock__intro">{puzzle.intro}</p>
      <h2 className="lock__q">{puzzle.question}</h2>
      <motion.form onSubmit={submit} className="lock__form" key={shake} animate={shake ? { x: [0, -8, 8, -5, 5, 0] } : {}} transition={{ duration: 0.35 }}>
        <label className="sr-only" htmlFor="lock-input">
          Answer, as {puzzle.format}
        </label>
        <input
          id="lock-input"
          className="field lock__input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={puzzle.format}
          inputMode="numeric"
          autoComplete="off"
          autoFocus
        />
        <button className="btn btn--primary" type="submit">
          Unlock
        </button>
      </motion.form>
      <div className="lock__msgs" aria-live="polite">
        {msg && <p className="lock__wrong">{msg}</p>}
        {puzzle.hints.slice(0, hintsShown).map((h) => (
          <p key={h} className="lock__hint">
            {h}
          </p>
        ))}
      </div>
      <p className="lock__fine">This lock is decorative. Like most of Ruru’s security.</p>
    </div>
  );
}

function Letter() {
  const empty = letter.paragraphs.length === 0;
  return (
    <article className="letter">
      {letter.useHandwrittenHeader && <img className="letter__hand" src={handwritingHeader} alt="Happy 21st, Riruu. (handwritten)" />}
      {letter.photo && (
        <div className="letter__photo">
          <Img id={letter.photo} full openable />
        </div>
      )}
      {letter.greeting && <p className="letter__greeting">{letter.greeting}</p>}
      {empty ? (
        <div className="placeholder-box letter__placeholder">
          {letterPlaceholder.map((l) => (
            <p key={l}>{l}</p>
          ))}
        </div>
      ) : (
        letter.paragraphs.map((p, i) => (
          <motion.p key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.35, duration: 0.8 }}>
            {p}
          </motion.p>
        ))
      )}
      <p className="letter__sig">{letter.signature}</p>
      <div className="letter__close">
        <button className="btn" onClick={() => useDesktop.getState().close('classified')}>
          Close and return to the desktop
        </button>
      </div>
    </article>
  );
}
