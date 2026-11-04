// The closing ceremony. Two closing lines, then the final award (Ruru's
// Special Recognition) with the stage dimmed and slowed, and only then
// "See you at the 22nd edition."
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Img } from '../../components/common';
import { Confetti } from '../../components/Confetti';
import { Trophy } from '../../components/Trophy';
import { ceremony, specialRecognition as sr } from '../../data/awards';
import { play } from '../../lib/sound';
import { useDesktop } from '../../store/desktopStore';
import { useProgress } from '../../store/progressStore';
import { prefersReducedMotion } from '../../store/settingsStore';
import { Envelope } from './Ceremony';

type Phase = 'lines' | 'envelope' | 'dedication' | 'finale';

const hasDedication = sr.dedication.length > 0;

export function Closing() {
  const [phase, setPhase] = useState<Phase>('lines');
  const [line, setLine] = useState(0);
  const [fire, setFire] = useState(0);
  const fast = prefersReducedMotion();
  const [opening, closing] = [ceremony.closing.lines.slice(0, 2), ceremony.closing.lines[2]];

  useEffect(() => {
    const step = fast ? 600 : 2400;
    const ts = [window.setTimeout(() => setLine(1), step), window.setTimeout(() => setLine(2), step * 2)];
    return () => ts.forEach(clearTimeout);
  }, [fast]);

  const finale = () => {
    setPhase('finale');
    setFire((f) => f + 1);
    play('fanfare');
    play('applause');
    useProgress.getState().patch({ closingSeen: true });
  };

  return (
    <div className={`closing ${phase === 'envelope' || phase === 'dedication' ? 'closing--intimate' : ''}`}>
      <Confetti fire={fire} count={220} />
      <AnimatePresence mode="wait">
        {phase === 'lines' && (
          <motion.div key="lines" className="closing__lines" exit={{ opacity: 0, transition: { duration: 0.8 } }}>
            {opening.map(
              (l, i) =>
                line >= i && (
                  <motion.p key={l} className={`closing__line closing__line--${i}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    {l}
                  </motion.p>
                ),
            )}
            {line >= 2 && (
              <motion.div className="closing__end" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
                {hasDedication ? (
                  <>
                    <p className="closing__line closing__line--2">And finally…</p>
                    <button className="gold-btn" onClick={() => (play('paper'), setPhase('envelope'))}>
                      One more envelope
                    </button>
                  </>
                ) : (
                  <button className="gold-btn" onClick={finale}>
                    Continue
                  </button>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {phase === 'envelope' && (
          <motion.div key="env" className="special" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.8 } }} transition={{ duration: 1.2 }}>
            <div className="ceremony__kicker">NOT IN THE PROGRAMME</div>
            <h2 className="ceremony__category">{sr.title}</h2>
            <Envelope
              open={false}
              title={sr.title}
              onOpen={() => {
                play('unlock');
                setPhase('dedication');
              }}
            />
            <p className="ceremony__tap">click to open</p>
          </motion.div>
        )}

        {phase === 'dedication' && <Dedication key="ded" fast={fast} onDone={finale} />}

        {phase === 'finale' && (
          <motion.div key="fin" className="closing__finale" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 110, damping: 13, delay: 0.2 }}>
              <Trophy style="star" size={110} />
            </motion.div>
            <p className="closing__line closing__line--1">{closing}</p>
            <button className="ghost-gold" onClick={() => useDesktop.getState().close('awards')}>
              Return to the desktop
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** The dedication arrives slowly, one paragraph at a time. */
function Dedication({ fast, onDone }: { fast: boolean; onDone: () => void }) {
  const per = fast ? 0.15 : 1.4;
  const start = fast ? 0.2 : 1.2;
  const after = start + sr.dedication.length * per;
  const [ready, setReady] = useState(false);
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), (after + (fast ? 0.3 : 2.4)) * 1000);
    // keep each new line in view as it arrives, so she never has to hunt for it
    const parts = ['.dedication__body p', '.dedication__winner', '.dedication__sig', '.dedication__next'];
    const scrolls: number[] = [];
    if (!fast) {
      const n = sr.dedication.length;
      const at = [...Array.from({ length: n }, (_, i) => start + i * per), after + 0.8, after + 2, after + 2.4];
      at.forEach((sec, i) =>
        scrolls.push(
          window.setTimeout(() => {
            const el = i < n ? root.current?.querySelectorAll(parts[0])[i] : root.current?.querySelector(parts[i - n + 1]);
            el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          }, sec * 1000),
        ),
      );
    }
    return () => {
      clearTimeout(t);
      scrolls.forEach(clearTimeout);
    };
  }, [after, fast, per, start]);

  return (
    <motion.article ref={root} className="dedication" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 1 } }} transition={{ duration: 1.4 }}>
      <motion.div className="dedication__photo" initial={{ opacity: 0, y: 10, rotate: -4 }} animate={{ opacity: 1, y: 0, rotate: -2 }} transition={{ duration: 1.4, delay: 0.3 }}>
        <Img id={sr.image} openable />
      </motion.div>
      <div className="dedication__kicker">{sr.title}</div>
      <p className="dedication__sub">{sr.subtitle}</p>
      <div className="dedication__body">
        {sr.dedication.map((p, i) => (
          <motion.p key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: start + i * per, duration: fast ? 0.2 : 1.2 }}>
            {p}
          </motion.p>
        ))}
      </div>
      <motion.div className="dedication__winner" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: after + (fast ? 0 : 0.8), duration: fast ? 0.2 : 1.6 }}>
        <Trophy style="star" size={64} shine={false} />
        <p>{sr.winnerLine}</p>
      </motion.div>
      <motion.div className="dedication__sig" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: after + (fast ? 0.1 : 2), duration: 1 }}>
        <span>{sr.signOff}</span>
        <b>{sr.signature}</b>
      </motion.div>
      <motion.div className="dedication__next" animate={{ opacity: ready ? 1 : 0 }} transition={{ duration: 0.8 }}>
        <button className="gold-btn" onClick={onDone} disabled={!ready} tabIndex={ready ? 0 : -1}>
          Close the ceremony
        </button>
      </motion.div>
    </motion.article>
  );
}
