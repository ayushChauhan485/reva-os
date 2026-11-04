import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { HiddenPuffer } from '../../components/common';
import { awards, ceremony } from '../../data/awards';
import { play } from '../../lib/sound';
import { useProgress } from '../../store/progressStore';
import { Ceremony } from './Ceremony';
import { Closing } from './Closing';
import { HallOfFame } from './HallOfFame';
import { Voting } from './Voting';

export type Scene = { name: 'marquee' } | { name: 'lobby' } | { name: 'award'; id: string } | { name: 'vote' } | { name: 'hall' } | { name: 'closing' };

export default function Awards() {
  const [scene, setScene] = useState<Scene>({ name: 'marquee' });
  const [started] = useState(() => Date.now());

  return (
    <div className="awards">
      <Spotlights />
      <div className="awards__curtain awards__curtain--l" aria-hidden="true" />
      <div className="awards__curtain awards__curtain--r" aria-hidden="true" />
      <div className="awards__valance" aria-hidden="true" />
      <HiddenPuffer spot="awards" style={{ position: 'absolute', left: 6, bottom: 8, zIndex: 6, opacity: 0.6 }} />

      {scene.name !== 'marquee' && (
        <div className="awards__topbar">
          {scene.name !== 'lobby' ? (
            <button className="awards__back" onClick={() => setScene({ name: 'lobby' })}>
              <ArrowLeft size={14} /> Programme
            </button>
          ) : (
            <span className="awards__brand">REVA AWARDS · 21.0</span>
          )}
          <CeremonyClock since={started} />
        </div>
      )}

      <div className="awards__stage scroll">
        <AnimatePresence mode="wait">
          <motion.div
            key={scene.name + ('id' in scene ? scene.id : '')}
            className="awards__scene"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {scene.name === 'marquee' && <Marquee since={started} onEnter={() => (play('fanfare'), setScene({ name: 'lobby' }))} />}
            {scene.name === 'lobby' && <Lobby go={setScene} />}
            {scene.name === 'award' && <Ceremony id={scene.id} go={setScene} />}
            {scene.name === 'vote' && <Voting />}
            {scene.name === 'hall' && <HallOfFame go={setScene} />}
            {scene.name === 'closing' && <Closing />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Spotlights() {
  return (
    <div className="spots" aria-hidden="true">
      <i className="spot spot--a" />
      <i className="spot spot--b" />
    </div>
  );
}

function CeremonyClock({ since }: { since: number }) {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setT(Date.now() - since), 1000);
    return () => clearInterval(id);
  }, [since]);
  const s = Math.floor(t / 1000);
  const fmt = `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  return (
    <span className="awards__clock" aria-label="Ceremony running time">
      <i /> LIVE · {fmt}
    </span>
  );
}

function Marquee({ onEnter, since }: { onEnter: () => void; since: number }) {
  return (
    <div className="marquee">
      <div className="marquee__sign">
        <div className="marquee__bulbs" aria-hidden="true">
          {Array.from({ length: 22 }, (_, i) => (
            <i key={i} style={{ animationDelay: `${(i % 4) * 0.25}s` }} />
          ))}
        </div>
        <div className="marquee__kicker">RURU PRODUCTIONS PRESENTS</div>
        <h1 className="marquee__title">
          <motion.span initial={{ opacity: 0, y: 14, letterSpacing: '0.3em' }} animate={{ opacity: 1, y: 0, letterSpacing: '0.02em' }} transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}>
            THE 21<sup>ST</sup> ANNUAL
          </motion.span>
          <motion.span className="marquee__big" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35, duration: 0.9 }}>
            Reva Awards
          </motion.span>
        </h1>
        <p className="marquee__sub">{ceremony.subtitle}</p>
        <div className="marquee__bulbs" aria-hidden="true">
          {Array.from({ length: 22 }, (_, i) => (
            <i key={i} style={{ animationDelay: `${((i + 2) % 4) * 0.25}s` }} />
          ))}
        </div>
      </div>

      <dl className="marquee__details">
        {ceremony.details.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>

      <motion.button className="marquee__enter" onClick={onEnter} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
        {ceremony.enter} →
      </motion.button>
      <div className="marquee__carpet" aria-hidden="true" />
      <div className="marquee__foot mono">
        doors opened <CeremonyClock since={since} />
      </div>
    </div>
  );
}

function Lobby({ go }: { go: (s: Scene) => void }) {
  const revealed = useProgress((s) => s.revealedAwards);
  const gameComplete = useProgress((s) => s.gameComplete);
  const list = awards.filter((a) => a.isUnlocked || (a.id === 'lost-and-found' && gameComplete));
  const main = awards.filter((a) => a.isUnlocked);
  const doneMain = main.filter((a) => revealed.includes(a.id)).length;
  const canClose = doneMain === main.length;

  return (
    <div className="lobby">
      <header className="lobby__head">
        <div className="lobby__kicker">TONIGHT’S PROGRAMME</div>
        <h2>Choose an envelope.</h2>
        <p>
          {doneMain === 0 ? 'Every envelope is still sealed. The jury is pretending to be impartial.' : `${doneMain} of ${main.length} envelopes opened.`}
        </p>
      </header>

      <div className="envelopes">
        {list.map((a, i) => {
          const done = revealed.includes(a.id);
          const hidden = !a.isUnlocked;
          return (
            <motion.button
              key={a.id}
              className={`envelope-card ${done ? 'is-done' : ''} ${hidden ? 'is-hidden' : ''}`}
              onClick={() => (play('paper'), go({ name: 'award', id: a.id }))}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * i }}
            >
              <span className="envelope-card__no">{hidden ? 'SECRET' : `CATEGORY ${String(i + 1).padStart(2, '0')}`}</span>
              <span className="envelope-card__title">{a.title}</span>
              <span className="envelope-card__seal">{done ? '🏆' : hidden ? '?' : 'R'}</span>
              <span className="envelope-card__state">{done ? 'awarded · replay' : 'sealed'}</span>
            </motion.button>
          );
        })}
      </div>

      <div className="lobby__more">
        <button className="lobby__tile" onClick={() => go({ name: 'vote' })}>
          <b>The People’s Choice Awards</b>
          <span>Cast your vote. Results may be predictable.</span>
        </button>
        <button className="lobby__tile" onClick={() => go({ name: 'hall' })}>
          <b>Hall of Fame</b>
          <span>{revealed.length ? `${revealed.length} trophies installed` : 'Currently empty. Suspiciously so.'}</span>
        </button>
        <button className="lobby__tile lobby__tile--closing" disabled={!canClose} onClick={() => (play('fanfare'), go({ name: 'closing' }))}>
          <b>
            {!canClose && <Lock size={13} />} Attend the closing ceremony
          </b>
          <span>{canClose ? 'The final envelope is waiting.' : `Opens after all ${main.length} categories (${doneMain}/${main.length}).`}</span>
        </button>
      </div>
    </div>
  );
}
