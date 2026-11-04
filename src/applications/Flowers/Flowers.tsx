import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { ChatBubble, Img } from '../../components/common';
import { dateLabel, getPhoto } from '../../lib/photos';
import { flowers } from '../../data/flowers';
import type { Flower } from '../../data/types';
import { play } from '../../lib/sound';
import { BouquetStudio } from './BouquetStudio';
import { FlowerArt } from './FlowerArt';

type Tab = 'catalogue' | 'studio';

export default function Flowers() {
  const [tab, setTab] = useState<Tab>('catalogue');
  const [open, setOpen] = useState<Flower | null>(null);

  return (
    <div className="flowers">
      <header className="flowers__head">
        <div>
          <div className="tag">est. 18.06.2026 · botanical division of Reva OS</div>
          <h2>The Flower Department</h2>
        </div>
        <div className="flowers__tabs" role="tablist">
          <button role="tab" aria-selected={tab === 'catalogue'} className="chip" aria-pressed={tab === 'catalogue'} onClick={() => (setTab('catalogue'), setOpen(null))}>
            Catalogue
          </button>
          <button role="tab" aria-selected={tab === 'studio'} className="chip" aria-pressed={tab === 'studio'} onClick={() => setTab('studio')}>
            Bouquet studio
          </button>
        </div>
      </header>

      <div className="flowers__body scroll">
        {tab === 'studio' ? (
          <BouquetStudio />
        ) : (
          <AnimatePresence mode="wait">
            {open ? (
              <motion.div key={open.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <Plate flower={open} onBack={() => setOpen(null)} />
              </motion.div>
            ) : (
              <motion.div key="grid" className="specimens" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {flowers.map((f, i) => (
                  <button
                    key={f.id}
                    className="specimen"
                    onClick={() => {
                      play('paper');
                      setOpen(f);
                    }}
                  >
                    <span className="specimen__no">No. {String(i + 1).padStart(2, '0')}</span>
                    <span className="specimen__art">
                      {f.photo ? <Img id={f.photo} className="specimen__photo" /> : <FlowerArt art={f.art} size={130} />}
                      <span className={`specimen__kind ${f.photo ? 'is-photo' : ''}`}>{f.photo ? 'photograph' : f.photoPlaceholder ? 'illustration · photo pending' : 'illustration'}</span>
                    </span>
                    <span className="specimen__name">{f.name}</span>
                    <span className="specimen__latin">{f.latin}</span>
                    <span className="specimen__date mono">{f.date}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

function Plate({ flower, onBack }: { flower: Flower; onBack: () => void }) {
  return (
    <article className="plate">
      <button className="btn btn--sm btn--ghost" onClick={onBack}>
        <ArrowLeft size={14} /> All specimens
      </button>
      <div className="plate__grid">
        <figure className="plate__figure">
          {flower.photo ? <Img id={flower.photo} full openable group={[flower.photo, ...(flower.timeline ?? [])]} className="plate__photo" /> : <FlowerArt art={flower.art} size={240} />}
          {flower.photoPlaceholder && <div className="placeholder-box" style={{ marginTop: 10 }}>{flower.photoPlaceholder}</div>}
          <figcaption className="mono">
            {flower.photo ? `photograph · ${dateLabel(getPhoto(flower.photo)!).text}` : 'illustration, not a photograph'} · plate {flower.id}
          </figcaption>
          {flower.handmadePhoto && getPhoto(flower.handmadePhoto) && (
            <div className="plate__handmade">
              <Img id={flower.handmadePhoto} openable />
              <span className="mono">
                the handmade version · pipe cleaner, not a real flower · {dateLabel(getPhoto(flower.handmadePhoto)!).text}
              </span>
            </div>
          )}
        </figure>
        <div className="plate__text">
          <div className="tag">{flower.date}</div>
          <h3>{flower.name}</h3>
          {flower.latin && <div className="plate__latin">{flower.latin}</div>}
          <dl>
            <dt>Symbolism</dt>
            <dd>{flower.symbolism}</dd>
            <dt>In our records</dt>
            <dd className="plate__story">{flower.story}</dd>
          </dl>
          {flower.messages && (
            <div className="plate__msgs">
              <div className="tag">original messages</div>
              {flower.messages.map((id) => (
                <ChatBubble key={id} id={id} compact />
              ))}
            </div>
          )}
          {flower.timeline && (
            <div className="plate__timeline">
              <div className="tag">how it was made · dated by Ruru’s video files</div>
              <ol>
                {flower.timeline.map((id) => {
                  const p = getPhoto(id);
                  if (!p) return null;
                  return (
                    <li key={id}>
                      <Img id={id} openable group={flower.timeline} />
                      <span className="mono">{dateLabel(p).text.replace(' · dated by file', '')}</span>
                      <b>{p.title}</b>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
