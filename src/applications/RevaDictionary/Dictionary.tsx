import { AnimatePresence, motion } from 'motion/react';
import { Dices, Search } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { ChatBubble, HiddenPuffer, Img } from '../../components/common';
import { dateLabel, getPhoto, randomPhoto } from '../../lib/photos';
import { msg, senderLabel, testimony } from '../../data/curatedContent';
import { categories, dictionary } from '../../data/quotes';
import type { DictionaryCategory, DictionaryEntry } from '../../data/types';
import { play } from '../../lib/sound';
import { useProgress } from '../../store/progressStore';

function quoteText(e: DictionaryEntry) {
  return e.quote.kind === 'chat' ? msg(e.quote.id).text : testimony[e.quote.id].text;
}

export default function Dictionary() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<DictionaryCategory | 'all'>('all');
  const [flash, setFlash] = useState<string | null>(null);
  const [withPhoto, setWithPhoto] = useState(false);
  const [randomPic, setRandomPic] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return dictionary.filter(
      (e) => (cat === 'all' || e.category === cat) && (!s || [e.headword, e.definition, quoteText(e), ...(e.context ?? []).map((id) => msg(id).text)].join(' ').toLowerCase().includes(s)),
    );
  }, [q, cat]);

  const random = () => {
    play('paper');
    setQ('');
    setCat('all');
    const e = dictionary[Math.floor(Math.random() * dictionary.length)];
    setFlash(e.id);
    setRandomPic(withPhoto ? (randomPhoto()?.id ?? null) : null);
    window.setTimeout(() => {
      document.getElementById(`dict-${e.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
    window.setTimeout(() => setFlash(null), 2200);
  };

  return (
    <div className="dict">
      <header className="dict__head">
        <div className="dict__title">
          <div className="tag">unofficial · unabridged · 21st edition</div>
          <h2>
            The Reva Dictionary
          </h2>
          <p className="editor-note">Quotes are original messages, exactly as sent. Definitions are the editor’s, and the editor is biased.</p>
        </div>
        <div className="dict__tools">
          <label className="archive__search">
            <Search size={14} aria-hidden="true" />
            <span className="sr-only">Search the dictionary</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Look up a word…" />
          </label>
          <button className="btn btn--sm" onClick={random}>
            <Dices size={14} /> Random
          </button>
          <label className="chip" style={{ cursor: 'pointer' }}>
            <input type="checkbox" checked={withPhoto} onChange={(e) => setWithPhoto(e.target.checked)} /> + a photo
          </label>
        </div>
        <div className="dict__cats" role="group" aria-label="Categories">
          <button className="chip" aria-pressed={cat === 'all'} onClick={() => setCat('all')}>
            All
          </button>
          {categories.map((c) => (
            <button key={c.id} className="chip" aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>
              {c.label}
            </button>
          ))}
        </div>
      </header>

      <div className="dict__list scroll" ref={listRef}>
        {randomPic && getPhoto(randomPic) && (
          <div className="dict__randompic">
            <Img id={randomPic} openable />
            <span className="mono">a random photograph to go with it · {getPhoto(randomPic)!.title} · {dateLabel(getPhoto(randomPic)!).text}</span>
            <button className="btn btn--sm btn--ghost" onClick={() => setRandomPic(null)}>
              hide
            </button>
          </div>
        )}
        {list.length === 0 && <p className="archive__empty">No entry for “{q}”. Some things about Reva remain undefined.</p>}
        {list.map((e) => (
          <Entry key={e.id} entry={e} flash={flash === e.id} />
        ))}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0 8px' }}>
          <HiddenPuffer spot="dictionary" style={{ opacity: 0.5 }} />
        </div>
      </div>
    </div>
  );
}

function Entry({ entry, flash }: { entry: DictionaryEntry; flash: boolean }) {
  const count = useProgress((s) => s.soReva[entry.id] ?? 0);
  const [burst, setBurst] = useState(0);
  const cat = categories.find((c) => c.id === entry.category)!;
  const t = entry.quote.kind === 'testimony' ? testimony[entry.quote.id] : null;
  const m = entry.quote.kind === 'chat' ? msg(entry.quote.id) : null;

  return (
    <article id={`dict-${entry.id}`} className={`entry ${flash ? 'entry--flash' : ''}`}>
      <div className="entry__word">
        <h3>{entry.headword}</h3>
        <span className="entry__pos">{entry.partOfSpeech}</span>
        <span className="entry__cat">{cat.label}</span>
      </div>

      <div className="entry__body">
        {entry.context?.map((id) => (
          <ChatBubble key={id} id={id} compact />
        ))}
        {m && (
          <figure className="entry__quote">
            <blockquote>“{m.text}”</blockquote>
            <figcaption>
              {senderLabel[m.sender]} · {m.date.replace(/\//g, '.')} · {m.time} · <span>original message</span>
            </figcaption>
          </figure>
        )}
        {t && (
          <figure className="entry__quote entry__quote--witness">
            <blockquote>“{t.text}”</blockquote>
            <figcaption>
              {t.witness} · {t.source} · <span>witness statement</span>
            </figcaption>
          </figure>
        )}
        {entry.after?.map((id) => (
          <ChatBubble key={id} id={id} compact />
        ))}
        <p className="editor-note">{entry.definition}</p>
        {entry.photo && getPhoto(entry.photo) && (
          <div className="entry__photo">
            <Img id={entry.photo} openable />
            <span className="mono">from the same day · {dateLabel(getPhoto(entry.photo)!).text}</span>
          </div>
        )}
      </div>

      <div className="entry__react">
        <button
          className="btn btn--sm entry__so"
          onClick={() => {
            play('pop');
            useProgress.getState().bump(entry.id);
            setBurst((b) => b + 1);
          }}
        >
          this is SO Reva
        </button>
        <span className="mono entry__count" aria-live="polite">
          ×{count}
        </span>
        <AnimatePresence>
          {burst > 0 && (
            <motion.span key={burst} className="entry__burst" initial={{ opacity: 1, y: 0, scale: 0.8 }} animate={{ opacity: 0, y: -26, scale: 1.2 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
              +1
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </article>
  );
}
