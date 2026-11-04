import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { Confetti } from '../../components/Confetti';
import { pollCopy, polls } from '../../data/awards';
import { play } from '../../lib/sound';
import { useProgress } from '../../store/progressStore';

export function Voting() {
  const votes = useProgress((s) => s.votes);
  return (
    <div className="voting">
      <header className="lobby__head">
        <div className="lobby__kicker">THE PEOPLE’S CHOICE AWARDS</div>
        <h2>The people have a voice.</h2>
        <p>The people are you. Your vote will be counted, independently, by Ruru.</p>
      </header>
      <div className="polls">
        {polls.map((p) => (
          <Poll key={p.id} poll={p} saved={votes[p.id]} />
        ))}
      </div>
    </div>
  );
}

function Poll({ poll, saved }: { poll: (typeof polls)[number]; saved: number | undefined }) {
  const [choice, setChoice] = useState<number | null>(saved ?? null);
  const [phase, setPhase] = useState<'pick' | 'count' | 'result'>(saved !== undefined ? 'result' : 'pick');
  const [fire, setFire] = useState(0);

  const submit = () => {
    if (choice === null) return;
    play('click');
    useProgress.getState().vote(poll.id, choice);
    setPhase('count');
    play('drumroll');
    window.setTimeout(() => {
      setPhase('result');
      play('applause');
      setFire((f) => f + 1);
    }, 1900);
  };

  return (
    <section className="poll">
      <Confetti fire={fire} count={70} />
      <h3>{poll.question}</h3>
      <div className="poll__opts" role="radiogroup" aria-label={poll.question}>
        {poll.options.map((o, i) => (
          <button
            key={o}
            role="radio"
            aria-checked={choice === i}
            className={`poll__opt ${choice === i ? 'is-on' : ''}`}
            disabled={phase !== 'pick'}
            onClick={() => (play('click'), setChoice(i))}
          >
            <span className="poll__bar" style={{ width: phase === 'pick' ? 0 : phase === 'count' ? `${choice === i ? 62 : 12 + i * 4}%` : '100%' }} />
            <span className="poll__label">{phase === 'result' ? 'Reva' : o}</span>
            {phase === 'result' && <span className="poll__pct">100%</span>}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {phase === 'pick' && (
          <motion.button key="b" className="gold-btn" disabled={choice === null} onClick={submit} exit={{ opacity: 0 }}>
            Submit vote
          </motion.button>
        )}
        {phase === 'count' && (
          <motion.p key="c" className="poll__msg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {pollCopy.recorded} Counting…
          </motion.p>
        )}
        {phase === 'result' && (
          <motion.div key="r" className="poll__result" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            <p className="poll__verdict">{pollCopy.verdict}</p>
            <p className="poll__foot">
              You voted for: <i>{choice !== null ? poll.options[choice] : '—'}</i> · {pollCopy.footnote}
            </p>
            <button
              className="ghost-gold"
              onClick={() => {
                setPhase('pick');
                setChoice(null);
              }}
            >
              Demand a recount
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
