import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Img } from '../../components/common';
import { Confetti } from '../../components/Confetti';
import { Trophy } from '../../components/Trophy';
import { ceremony, specialRecognition } from '../../data/awards';
import { play } from '../../lib/sound';
import { useDesktop } from '../../store/desktopStore';
import { useProgress } from '../../store/progressStore';
import { prefersReducedMotion } from '../../store/settingsStore';
import { Envelope } from './Ceremony';

type Phase = 0 | 1 | 2 | 3 | 'special' | 'special-open';

export function Closing() {
  const [phase, setPhase] = useState<Phase>(0);
  const [fire, setFire] = useState(0);
  const hasDedication = specialRecognition.dedication.trim().length > 0;
  const showSpecial = hasDedication || import.meta.env.DEV;

  useEffect(() => {
    const step = prefersReducedMotion() ? 600 : 2200;
    const ts = [
      window.setTimeout(() => setPhase(1), step),
      window.setTimeout(() => setPhase(2), step * 2),
      window.setTimeout(() => {
        setPhase(3);
        setFire((f) => f + 1);
        play('fanfare');
        play('applause');
        useProgress.getState().patch({ closingSeen: true });
      }, step * 3),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  const lines = ceremony.closing.lines;

  return (
    <div className="closing">
      <Confetti fire={fire} count={220} />
      <AnimatePresence mode="wait">
        {typeof phase === 'number' ? (
          <motion.div key="lines" className="closing__lines" exit={{ opacity: 0 }}>
            {lines.map(
              (l, i) =>
                phase >= i && (
                  <motion.p key={l} className={`closing__line closing__line--${i}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    {l}
                  </motion.p>
                ),
            )}
            {phase === 3 && (
              <motion.div className="closing__end" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 110, damping: 13 }}>
                <Trophy style="star" size={110} />
                <div className="closing__btns">
                  {showSpecial && (
                    <button className="gold-btn" onClick={() => (play('paper'), setPhase('special'))}>
                      One more envelope…
                    </button>
                  )}
                  <button className="ghost-gold" onClick={() => useDesktop.getState().close('awards')}>
                    Return to the desktop
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div key="special" className="special" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="ceremony__kicker">NOT IN THE PROGRAMME</div>
            <h2 className="ceremony__category">{specialRecognition.title}</h2>
            <p className="ceremony__subtitle">{specialRecognition.subtitle}</p>
            {phase === 'special' ? (
              <>
                <Envelope
                  open={false}
                  title={specialRecognition.title}
                  onOpen={() => {
                    play('unlock');
                    setPhase('special-open');
                  }}
                />
                <p className="ceremony__tap">click to open</p>
              </>
            ) : (
              <motion.div className="special__card" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
                <div className="special__photo">
                  <Img id={specialRecognition.image} openable />
                </div>
                <div className="special__text">
                  {hasDedication ? (
                    specialRecognition.dedication.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)
                  ) : (
                    <div className="placeholder-box">
                      [DEV ONLY — hidden in the production build until filled] {specialRecognition.placeholderNote}
                    </div>
                  )}
                  <p className="special__sig">— Ruru 🐡</p>
                </div>
                <button className="ghost-gold" onClick={() => useDesktop.getState().close('awards')}>
                  Return to the desktop
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
