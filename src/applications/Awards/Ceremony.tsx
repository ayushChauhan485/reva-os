import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { ChatBubble, Img, TestimonyCard } from '../../components/common';
import { Confetti } from '../../components/Confetti';
import { Trophy } from '../../components/Trophy';
import { acceptance, awards, ceremony } from '../../data/awards';
import type { AwardEvidence, RevaAward } from '../../data/types';
import { play } from '../../lib/sound';
import { prefersReducedMotion } from '../../store/settingsStore';
import { useProgress } from '../../store/progressStore';
import { useUI } from '../../store/uiStore';
import type { Scene } from './Awards';

type Step = 'nominate' | 'category' | 'citation' | 'envelope' | 'opening' | 'goesTo' | 'winner' | 'accepted' | 'speech';

export function Ceremony({ id, go }: { id: string; go: (s: Scene) => void }) {
  const award = awards.find((a) => a.id === id)!;
  const [step, setStep] = useState<Step>('nominate');
  const [fire, setFire] = useState(0);
  const [speech, setSpeech] = useState<string | null>(null);
  const timers = useRef<number[]>([]);
  const fast = prefersReducedMotion();

  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, fast ? Math.min(ms, 300) : ms));
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    if (step === 'nominate') later(() => setStep('category'), 1900);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const openEnvelope = () => {
    if (step !== 'envelope') return;
    play('paper');
    play('drumroll');
    setStep('opening');
    later(() => setStep('goesTo'), 1300);
    later(() => {
      setStep('winner');
      play('applause');
      setFire((f) => f + 1);
      if (useProgress.getState().revealAward(award.id)) {
        useUI.getState().notify({ title: 'Hall of Fame: new trophy installed.', body: award.title, icon: 'trophy' }, { force: true });
      }
    }, 3100);
  };

  const main = awards.filter((a) => a.isUnlocked);
  const nextAward = main.find((a) => a.id !== award.id && !useProgress.getState().revealedAwards.includes(a.id));

  return (
    <div className="ceremony">
      <Confetti fire={fire} />
      <AnimatePresence mode="wait">
        {step === 'nominate' && (
          <motion.div key="n" className="ceremony__card ceremony__card--announce" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -10 }} onClick={() => setStep('category')}>
            <div className="ceremony__kicker">AN ANNOUNCEMENT</div>
            <p className="ceremony__announce">{ceremony.nomination}</p>
          </motion.div>
        )}

        {step === 'category' && (
          <motion.div key="c" className="ceremony__card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="ceremony__kicker">{award.isUnlocked ? 'THE CATEGORY IS' : 'A HIDDEN CATEGORY'}</div>
            <motion.h2 className="ceremony__category" initial={{ opacity: 0, letterSpacing: '0.2em' }} animate={{ opacity: 1, letterSpacing: '0.01em' }} transition={{ duration: 0.9 }}>
              {award.title}
            </motion.h2>
            <p className="ceremony__subtitle">{award.subtitle}</p>
            <button className="gold-btn" onClick={() => (play('click'), setStep('citation'))}>
              Read the citation
            </button>
          </motion.div>
        )}

        {step === 'citation' && (
          <motion.div key="ci" className="ceremony__card ceremony__card--citation" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="ceremony__kicker">CITATION · {award.title.toUpperCase()}</div>
            <p className="ceremony__desc">{award.description}</p>
            <div className={`citation ${award.image || award.gallery ? 'citation--photo' : ''}`}>
              {award.image && !award.gallery && (
                <div className="citation__photo">
                  <Img id={award.image} openable />
                </div>
              )}
              {award.gallery && (
                <div className="citation__gallery" aria-label="Photographs">
                  {award.gallery.map((id) => (
                    <Img key={id} id={id} openable group={award.gallery} />
                  ))}
                </div>
              )}
              <div className="citation__evidence">
                {award.evidence?.length ? <div className="ceremony__label">EVIDENCE SUBMITTED</div> : null}
                {award.evidence?.map((e, i) => (
                  <Evidence key={i} e={e} />
                ))}
                {award.juryNotes?.map((n) => (
                  <p key={n} className="jury-note">
                    <span>JURY NOTE</span> {n}
                  </p>
                ))}
              </div>
            </div>
            <button className="gold-btn" onClick={() => (play('click'), setStep('envelope'))}>
              Bring out the envelope
            </button>
          </motion.div>
        )}

        {(step === 'envelope' || step === 'opening') && (
          <motion.div key="e" className="ceremony__envelope-wrap" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 1.05 }}>
            <div className="ceremony__kicker">{step === 'envelope' ? 'THE ENVELOPE, PLEASE' : 'OPENING…'}</div>
            <Envelope open={step === 'opening'} onOpen={openEnvelope} title={award.title} />
            {step === 'envelope' && <p className="ceremony__tap">click the envelope to open it</p>}
          </motion.div>
        )}

        {step === 'goesTo' && (
          <motion.div key="g" className="ceremony__card ceremony__card--announce" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.p className="ceremony__goes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              {ceremony.goesTo}
            </motion.p>
          </motion.div>
        )}

        {(step === 'winner' || step === 'accepted' || step === 'speech') && (
          <motion.div key="w" className="winner" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div className="winner__trophy" initial={{ y: 80, opacity: 0, scale: 0.6 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 0.25 }}>
              <Trophy style={award.trophyStyle} size={130} />
            </motion.div>
            <motion.h2 className="winner__name" initial={{ scale: 2.4, opacity: 0, filter: 'blur(8px)' }} animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }} transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}>
              {award.winner.toUpperCase()}.
            </motion.h2>
            <div className="winner__for">{award.title}</div>

            {step === 'winner' && (
              <motion.button
                className="gold-btn gold-btn--big"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                onClick={() => {
                  play('fanfare');
                  setFire((f) => f + 1);
                  setStep('accepted');
                  later(() => setStep('speech'), 1400);
                }}
              >
                ACCEPT YOUR AWARD
              </motion.button>
            )}

            {step === 'accepted' && <p className="winner__accepted">The audience (one person) is on their feet.</p>}

            {step === 'speech' && (
              <motion.div className="speech" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                {!speech ? (
                  <>
                    <p className="speech__prompt">{acceptance.prompt}</p>
                    <div className="speech__opts">
                      {acceptance.options.map((o) => (
                        <button key={o.id} className="speech__opt" onClick={() => (play('applause'), setSpeech(o.id))}>
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <p className="speech__response">{acceptance.options.find((o) => o.id === speech)!.response}</p>
                    <div className="speech__next">
                      {nextAward && award.isUnlocked ? (
                        <button className="gold-btn" onClick={() => go({ name: 'award', id: nextAward.id })}>
                          Next category →
                        </button>
                      ) : (
                        <button className="gold-btn" onClick={() => go({ name: 'lobby' })}>
                          Back to the programme
                        </button>
                      )}
                      <button className="ghost-gold" onClick={() => go({ name: 'hall' })}>
                        See it in the Hall of Fame
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Evidence({ e }: { e: AwardEvidence }) {
  if (e.kind === 'chat' && e.ref) return <ChatBubble id={e.ref} compact />;
  if (e.kind === 'testimony' && e.ref) return <TestimonyCard id={e.ref} />;
  return <div className="stat-line">▸ {e.text}</div>;
}

export function Envelope({ open, onOpen, title }: { open: boolean; onOpen: () => void; title: string }) {
  return (
    <button className={`envelope ${open ? 'is-open' : ''}`} onClick={onOpen} aria-label={open ? 'Envelope opening' : 'Open the envelope'} disabled={open}>
      <span className="envelope__back" />
      <motion.span className="envelope__card" animate={open ? { y: -70 } : { y: 0 }} transition={{ delay: 0.35, duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}>
        <span className="mono">WINNER</span>
        <b>· · ·</b>
      </motion.span>
      <span className="envelope__front">
        <span className="envelope__label">{title}</span>
      </span>
      <motion.span className="envelope__flap" animate={open ? { rotateX: 180 } : { rotateX: 0 }} transition={{ duration: 0.45 }} />
      <motion.span className="envelope__seal" animate={open ? { scale: 0, opacity: 0 } : { scale: 1 }} transition={{ duration: 0.2 }}>
        R
      </motion.span>
    </button>
  );
}

export type { RevaAward };
