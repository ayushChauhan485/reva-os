import { motion } from 'motion/react';
import { Img } from '../../components/common';
import { Trophy } from '../../components/Trophy';
import { awards, specialRecognition } from '../../data/awards';
import { useProgress } from '../../store/progressStore';
import type { Scene } from './Awards';

export function HallOfFame({ go }: { go: (s: Scene) => void }) {
  const revealed = useProgress((s) => s.revealedAwards);
  const closingSeen = useProgress((s) => s.closingSeen);
  const won = awards.filter((a) => revealed.includes(a.id));
  const empty = awards.filter((a) => a.isUnlocked && !revealed.includes(a.id)).length;

  return (
    <div className="hall">
      <header className="lobby__head">
        <div className="lobby__kicker">THE HALL OF FAME</div>
        <h2>The trophy room.</h2>
        <p>{won.length ? 'Please do not touch the exhibits. Except you. You may touch the exhibits.' : 'Nothing here yet. Open an envelope to install the first trophy.'}</p>
      </header>

      <div className="shelf">
        {won.map((a, i) => (
          <motion.figure key={a.id} className="plinth" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} tabIndex={0}>
            <div className="plinth__trophy">
              <Trophy style={a.trophyStyle} size={92} />
            </div>
            <figcaption>
              <b>{a.title}</b>
              <span className="plinth__ed">Edition 21.0 · Winner: {a.winner}</span>
              <span className="plinth__desc">{a.description}</span>
              {a.image && (
                <span className="plinth__photo">
                  <Img id={a.image} openable />
                </span>
              )}
              <button className="ghost-gold" onClick={() => go({ name: 'award', id: a.id })}>
                Replay the reveal
              </button>
            </figcaption>
          </motion.figure>
        ))}
        {closingSeen && specialRecognition.dedication.length > 0 && (
          <figure className="plinth plinth--special" tabIndex={0}>
            <div className="plinth__trophy">
              <Trophy style="star" size={92} />
            </div>
            <figcaption>
              <b>{specialRecognition.title}</b>
              <span className="plinth__ed">Edition 21.0 · A category of one</span>
              <button className="ghost-gold" onClick={() => go({ name: 'closing' })}>
                Replay the closing
              </button>
            </figcaption>
          </figure>
        )}
        {Array.from({ length: empty }, (_, i) => (
          <div key={`e${i}`} className="plinth plinth--empty" aria-hidden="true">
            <div className="plinth__trophy">?</div>
            <figcaption>
              <span className="plinth__ed">Reserved</span>
            </figcaption>
          </div>
        ))}
      </div>
    </div>
  );
}
