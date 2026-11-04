import { useEffect, useRef, useState } from 'react';
import { bootLines } from '../data/easterEggs';
import { play, unlockAudio } from '../lib/sound';
import { prefersReducedMotion } from '../store/settingsStore';
import { RevaLogo } from './AppIcon';

const TOTAL_MS = 5200;

export function BootScreen({ onDone }: { onDone: () => void }) {
  const [started, setStarted] = useState(false);
  const [shown, setShown] = useState(0);
  const [progress, setProgress] = useState(0);
  const finished = useRef(false);
  const startBtn = useRef<HTMLButtonElement>(null);

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    onDone();
  };

  const start = () => {
    if (started) return;
    unlockAudio();
    play('startup');
    setStarted(true);
  };

  useEffect(() => {
    startBtn.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') finish();
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!started) return;
    const fast = prefersReducedMotion();
    const per = (fast ? 1800 : TOTAL_MS) / bootLines.length;
    const timers: number[] = [];
    bootLines.forEach((_, i) => {
      timers.push(
        window.setTimeout(() => {
          setShown(i + 1);
          setProgress(Math.round(((i + 1) / bootLines.length) * 100));
          if (bootLines[i]) play('type');
        }, per * (i + 1)),
      );
    });
    timers.push(window.setTimeout(finish, (fast ? 1800 : TOTAL_MS) + 900));
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  return (
    <div className="boot" role="dialog" aria-label="Reva OS is starting">
      <div className="boot__inner">
        <div className="boot__logo">
          <span className="boot__logo-mark" style={{ color: '#f3eddf' }}>
            <RevaLogo size={46} />
          </span>
          <div>
            <div className="boot__logo-name">REVA OS</div>
            <div className="boot__logo-ver">VERSION 21.0 · BUILT BY RURU</div>
          </div>
        </div>

        {!started ? (
          <>
            <button ref={startBtn} className="boot__start" onClick={start}>
              ▶ START REVA.EXE
            </button>
            <p className="boot__hint">Sound on, if you can. You can mute it any time.</p>
          </>
        ) : (
          <>
            <div className="boot__lines" aria-live="polite">
              {bootLines.slice(0, shown).map((line, i) => (
                <div
                  key={i}
                  className={
                    i === 0
                      ? 'boot__line--title'
                      : line.startsWith('Warning')
                        ? 'boot__line--warn'
                        : line.startsWith('WELCOME')
                          ? 'boot__line--welcome'
                          : undefined
                  }
                >
                  {line || ' '}
                </div>
              ))}
              {shown < bootLines.length && <span className="cursor-block" />}
            </div>
            <div className="boot__bar" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
              <div style={{ width: `${progress}%` }} />
            </div>
          </>
        )}
      </div>
      <button className="boot__skip" onClick={() => (started ? finish() : (start(), finish()))}>
        Skip →
      </button>
    </div>
  );
}
