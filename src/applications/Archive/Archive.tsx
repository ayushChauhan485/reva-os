import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ChevronRight, Dices, Search, Star } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ChatBubble, HiddenPuffer, Img } from '../../components/common';
import { photo } from '../../data/assets';
import { msg } from '../../data/curatedContent';
import { archiveIntro, dotDate, memories, memoryById, months } from '../../data/memories';
import type { Memory } from '../../data/types';
import { useIsTouch } from '../../lib/hooks';
import { play } from '../../lib/sound';
import { useDesktop } from '../../store/desktopStore';
import { useProgress } from '../../store/progressStore';
import { useUI } from '../../store/uiStore';
import { photos } from '../../data/assets';

/** A location in the archive: [] = root, ['2026'], ['2026','MAY'], or a memory. */
type Loc = { path: string[]; memory?: string; view?: 'favourites' };

const ROOT: Loc = { path: [] };

function monthOf(m: Memory) {
  return months[Number(m.date.slice(5, 7)) - 1];
}

export default function Archive() {
  const [stack, setStack] = useState<Loc[]>([ROOT]);
  const [query, setQuery] = useState('');
  const loc = stack[stack.length - 1];
  const intent = useDesktop((s) => s.intent);
  const lastMemory = useProgress((s) => s.lastMemory);
  const favourites = useProgress((s) => s.favourites);

  const go = (l: Loc) => {
    play('click');
    setQuery('');
    setStack((s) => [...s, l]);
  };
  const openMemory = (id: string) => {
    const m = memoryById(id);
    if (!m) return;
    useProgress.getState().patch({ lastMemory: id });
    go({ path: ['2026', monthOf(m)], memory: id });
  };
  const back = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));

  useEffect(() => {
    if (intent?.app === 'archive' && intent.memoryId) openMemory(intent.memoryId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intent?.nonce]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return memories.filter((m) => {
      const hay = [m.title, m.folderName, dotDate(m.date), m.place ?? '', ...m.tags, ...m.intro, ...(m.messages ?? []).map((id) => msg(id).text)]
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [query]);

  const crumbs = ['OUR_ARCHIVE', ...loc.path, ...(loc.memory ? [memoryById(loc.memory)!.folderName] : []), ...(loc.view === 'favourites' ? ['★ FAVOURITES'] : [])];

  return (
    <div className="archive">
      <div className="archive__toolbar">
        <button className="btn btn--sm btn--ghost" onClick={back} disabled={stack.length < 2} aria-label="Back">
          <ArrowLeft size={15} />
        </button>
        <nav className="archive__crumbs" aria-label="Path">
          {crumbs.map((c, i) => (
            <span key={i} style={{ display: 'contents' }}>
              {i > 0 && <ChevronRight size={12} aria-hidden="true" />}
              <button
                className="archive__crumb"
                disabled={i === crumbs.length - 1}
                onClick={() => go(i === 0 ? ROOT : { path: loc.path.slice(0, i) })}
              >
                {c}
              </button>
            </span>
          ))}
        </nav>
        <label className="archive__search">
          <Search size={14} aria-hidden="true" />
          <span className="sr-only">Search memories</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search memories…" />
        </label>
        <button
          className="btn btn--sm"
          onClick={() => {
            const pool = memories.filter((m) => m.id !== loc.memory);
            openMemory(pool[Math.floor(Math.random() * pool.length)].id);
          }}
          title="Random memory"
        >
          <Dices size={15} /> <span className="hide-sm">Random</span>
        </button>
      </div>

      <div className="archive__main">
        <aside className="archive__side" aria-label="Places">
          <div className="tag">Places</div>
          <button className={`archive__place ${!loc.memory && loc.path.length === 0 && !loc.view ? 'is-on' : ''}`} onClick={() => go(ROOT)}>
            🗄 OUR_ARCHIVE
          </button>
          <button className={`archive__place ${loc.path[0] === '2026' && !loc.memory ? 'is-on' : ''}`} onClick={() => go({ path: ['2026'] })}>
            📁 2026
          </button>
          <button className={`archive__place ${loc.view === 'favourites' ? 'is-on' : ''}`} onClick={() => go({ path: [], view: 'favourites' })}>
            ★ Favourites <span className="archive__count">{favourites.length}</span>
          </button>
          {lastMemory && memoryById(lastMemory) && (
            <>
              <div className="tag" style={{ marginTop: 16 }}>
                Last opened
              </div>
              <button className="archive__place" onClick={() => openMemory(lastMemory)}>
                🕘 {dotDate(memoryById(lastMemory)!.date)}
              </button>
            </>
          )}
        </aside>

        <div className="archive__pane scroll">
          <AnimatePresence mode="wait">
            <motion.div
              key={results ? 'search' : `${crumbs.join('/')}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16 }}
            >
              {results ? (
                <SearchResults results={results} query={query} onOpen={openMemory} />
              ) : loc.memory ? (
                <MemoryView memory={memoryById(loc.memory)!} />
              ) : loc.view === 'favourites' ? (
                <FolderGrid
                  items={memories.filter((m) => favourites.includes(m.id)).map((m) => ({ kind: 'memory' as const, memory: m }))}
                  empty="No favourites yet. Open a memory and press ★."
                  onOpen={(it) => it.kind === 'memory' && openMemory(it.memory.id)}
                />
              ) : loc.path.length === 0 ? (
                <RootView onOpen={() => go({ path: ['2026'] })} />
              ) : loc.path.length === 1 ? (
                <FolderGrid
                  items={months
                    .filter((mo) => memories.some((m) => monthOf(m) === mo))
                    .map((mo) => ({ kind: 'folder' as const, name: mo, count: memories.filter((m) => monthOf(m) === mo).length }))}
                  onOpen={(it) => it.kind === 'folder' && go({ path: ['2026', it.name] })}
                />
              ) : (
                <FolderGrid
                  items={memories.filter((m) => monthOf(m) === loc.path[1]).map((m) => ({ kind: 'memory' as const, memory: m }))}
                  onOpen={(it) => it.kind === 'memory' && openMemory(it.memory.id)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <footer className="archive__status">
        <span>{memories.length} memories · 1 archivist</span>
        <span>double-click to open</span>
      </footer>
    </div>
  );
}

function RootView({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="archive__root">
      <figure className="archive__hero">
        <Img asset="archiveHero" full openable />
        <figcaption>{archiveIntro.heroCaption}</figcaption>
      </figure>
      <div className="archive__intro">
        <div className="tag">OUR_ARCHIVE / README</div>
        <h2>{archiveIntro.title}</h2>
        {archiveIntro.lines.map((l) => (
          <p key={l}>{l}</p>
        ))}
        <button className="btn btn--primary" onClick={onOpen} style={{ marginTop: 18 }}>
          Open 2026/ →
        </button>
        <p className="editor-note" style={{ marginTop: 22 }}>
          {memories.length} records from 25.04 to 19.09. Some photographs, mostly words.
        </p>
        <HiddenPuffer spot="archive" style={{ marginTop: 26, opacity: 0.55 }} />
      </div>
    </div>
  );
}

type Item = { kind: 'folder'; name: string; count: number } | { kind: 'memory'; memory: Memory };

function FolderGrid({ items, onOpen, empty }: { items: Item[]; onOpen: (it: Item) => void; empty?: string }) {
  const touch = useIsTouch();
  const [sel, setSel] = useState<number | null>(null);
  if (!items.length) return <p className="archive__empty">{empty ?? 'Empty folder.'}</p>;
  return (
    <div className="fgrid" role="listbox" aria-label="Folder contents">
      {items.map((it, i) => {
        const name = it.kind === 'folder' ? it.name : it.memory.folderName;
        const thumb = it.kind === 'memory' && it.memory.photos?.[0] ? photo(it.memory.photos[0]) : null;
        return (
          <button
            key={name}
            role="option"
            aria-selected={sel === i}
            className="fgrid__item"
            onClick={() => (touch ? onOpen(it) : setSel(i))}
            onDoubleClick={() => onOpen(it)}
            onKeyDown={(e) => e.key === 'Enter' && onOpen(it)}
          >
            <FolderGlyph tint={it.kind === 'memory' && it.memory.date.endsWith('-27') ? 'rose' : 'butter'} />
            <span className="fgrid__name">{name}</span>
            {it.kind === 'folder' && <span className="fgrid__meta">{it.count} items</span>}
            {it.kind === 'memory' && (
              <span className="preview" role="tooltip">
                {thumb && <img src={thumb.thumb} alt="" />}
                <b>{it.memory.title}</b>
                <span>{it.memory.intro[0]}</span>
                <i>{dotDate(it.memory.date)}</i>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function FolderGlyph({ tint }: { tint: 'butter' | 'rose' }) {
  const fill = tint === 'rose' ? '#D6B9D0' : '#D9D49A';
  const back = tint === 'rose' ? '#B98FB0' : '#C9A24B';
  return (
    <svg viewBox="0 0 48 40" width="58" height="48" aria-hidden="true" className="appicon">
      <path d="M3 6h14l3 4h25v26a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill={back} stroke="#343342" strokeWidth="2" strokeLinejoin="round" />
      <path d="M3 14h42v22a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill={fill} stroke="#343342" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function MemoryView({ memory }: { memory: Memory }) {
  const [revealed, setRevealed] = useState(false);
  const [sealedOpen, setSealedOpen] = useState(false);
  const fav = useProgress((s) => s.favourites.includes(memory.id));
  const touch = useIsTouch();
  const group = photos(memory.photos ?? []);

  return (
    <article className="memory">
      <header className="memory__head">
        <button
          className={`memory__date ${revealed ? 'is-open' : ''}`}
          onClick={() => {
            play('paper');
            setRevealed(true);
          }}
          aria-expanded={revealed}
        >
          <span className="memory__date-num">{dotDate(memory.date)}</span>
          {!revealed && <span className="memory__date-hint">click the date to reveal</span>}
        </button>
        <button
          className={`memory__fav ${fav ? 'is-on' : ''}`}
          aria-pressed={fav}
          aria-label={fav ? 'Remove from favourites' : 'Add to favourites'}
          onClick={() => {
            play('click');
            useProgress.getState().toggleFavourite(memory.id);
          }}
        >
          <Star size={18} fill={fav ? 'currentColor' : 'none'} />
        </button>
      </header>

      <h2 className="memory__title">{memory.title}</h2>
      {memory.place && <div className="tag">📍 {memory.place}</div>}

      <AnimatePresence>
        {revealed && (
          <motion.div className="memory__intro" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
            {memory.intro.map((line, i) => (
              <motion.p key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 + i * 0.22 }}>
                {line}
              </motion.p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {memory.messages && (
        <section className="memory__chat" aria-label="Messages">
          <div className="tag">original messages</div>
          {memory.messages.map((id) => (
            <ChatBubble key={id} id={id} />
          ))}
        </section>
      )}

      {group.length > 0 && (
        <section className="memory__photos" aria-label="Photographs">
          <div className="tag">photographs · {touch ? 'tap' : 'double-click'} to view</div>
          <div className={`memory__photo-grid memory__photo-grid--${Math.min(group.length, 3)}`}>
            {group.map((p, i) => (
              <figure key={p.key}>
                <button
                  className="img-btn"
                  aria-label={`View photo: ${p.alt}`}
                  onClick={() => touch && useUI.getState().openLightbox(group, i)}
                  onDoubleClick={() => useUI.getState().openLightbox(group, i)}
                  onKeyDown={(e) => e.key === 'Enter' && useUI.getState().openLightbox(group, i)}
                >
                  <img src={p.thumb} alt={p.alt} loading="lazy" />
                </button>
                <figcaption>
                  {p.caption} <span>{p.date}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {memory.sealed && (
        <section className="sealed">
          {!sealedOpen ? (
            <button
              className="sealed__file"
              onClick={() => {
                play('paper');
                setSealedOpen(true);
              }}
            >
              <span aria-hidden="true">📄</span> {memory.sealed.label}
              <span className="tag">open quietly</span>
            </button>
          ) : (
            <motion.div className="sealed__note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
              {memory.sealed.messageIds.map((id) => {
                const m = msg(id);
                return (
                  <p key={id}>
                    {m.text}
                    <span>
                      — Reva, {m.date.replace(/\//g, '.')}, {m.time}
                    </span>
                  </p>
                );
              })}
              {memory.sealed.note && <div className="editor-note">{memory.sealed.note}</div>}
            </motion.div>
          )}
        </section>
      )}

      <div className="memory__tags">
        {memory.tags.map((t) => (
          <span key={t} className="chip">
            #{t}
          </span>
        ))}
      </div>
    </article>
  );
}

function SearchResults({ results, query, onOpen }: { results: Memory[]; query: string; onOpen: (id: string) => void }) {
  if (!results.length)
    return (
      <p className="archive__empty">
        Nothing filed under “{query}”. Try <i>lily</i>, <i>27</i> or <i>bowling</i>.
      </p>
    );
  return (
    <ul className="results">
      {results.map((m) => (
        <li key={m.id}>
          <button onClick={() => onOpen(m.id)}>
            <span className="mono">{dotDate(m.date)}</span>
            <b>{m.title}</b>
            <span>{m.intro.join(' ')}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
