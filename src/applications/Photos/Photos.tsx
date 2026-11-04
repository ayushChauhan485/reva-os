// photos.exe — the Reva Photo Library.
import { AnimatePresence, motion } from 'motion/react';
import { Clapperboard, Dices, Film, Heart, LayoutGrid, LayoutPanelTop, Lock, Rows3, Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ChatBubble } from '../../components/common';
import { albums, missingPhotos, type AlbumId } from '../../data/photoLibrary';
import { dotDate, memoryById } from '../../data/memories';
import { albumCover, albumNames, isRecent, albumPhotos, dateLabel, isDeveloped, orientation, photoSize, photoSrc, remindRandom, trustedDate, viewablePhotos, visibleAlbums, visiblePhotos, type PhotoAsset } from '../../lib/photos';
import { useIsPhone } from '../../lib/hooks';
import { play } from '../../lib/sound';
import { useDesktop } from '../../store/desktopStore';
import { useProgress } from '../../store/progressStore';
import { useUI } from '../../store/uiStore';
import { StripMaker } from './StripMaker';
import { Wall } from './Wall';

type Section = { kind: 'home' } | { kind: 'all' } | { kind: 'favourites' } | { kind: 'recent' } | { kind: 'album'; id: AlbumId } | { kind: 'wall' } | { kind: 'strip' };
type ViewMode = 'grid' | 'masonry' | 'filmstrip' | 'timeline';
type FilterKey = 'favourites' | 'portrait' | 'landscape' | 'recent' | 'dated' | 'undated' | 'unassigned';

const FILTERS: { id: FilterKey; label: string }[] = [
  { id: 'favourites', label: 'Favourites' },
  { id: 'portrait', label: 'Portrait' },
  { id: 'landscape', label: 'Landscape' },
  { id: 'recent', label: 'Recently added' },
  { id: 'dated', label: 'Verified date' },
  { id: 'undated', label: 'Undated' },
  { id: 'unassigned', label: 'Unassigned' },
];

const VIEWS: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
  { id: 'grid', label: 'Grid', icon: <LayoutGrid size={15} /> },
  { id: 'masonry', label: 'Masonry', icon: <LayoutPanelTop size={15} /> },
  { id: 'filmstrip', label: 'Filmstrip', icon: <Film size={15} /> },
  { id: 'timeline', label: 'Timeline', icon: <Rows3 size={15} /> },
];

export default function Photos() {
  const [section, setSection] = useState<Section>({ kind: 'home' });
  const [view, setView] = useState<ViewMode>('grid');
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Set<FilterKey>>(new Set());
  const [albumFilter, setAlbumFilter] = useState<AlbumId | ''>('');
  const [showFilters, setShowFilters] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const favs = useProgress((s) => s.photoFavourites);
  const developed = useProgress((s) => s.developed);
  const phone = useIsPhone();
  const intent = useDesktop((s) => s.intent);

  useEffect(() => {
    if (intent?.app === 'photos' && intent.albumId) setSection({ kind: 'album', id: intent.albumId as AlbumId });
  }, [intent?.nonce]); // eslint-disable-line react-hooks/exhaustive-deps

  const base: PhotoAsset[] = useMemo(() => {
    switch (section.kind) {
      case 'favourites':
        return visiblePhotos().filter((p) => favs.includes(p.id));
      case 'recent':
        return visiblePhotos().filter((p) => isRecent(p));
      case 'album':
        return albumPhotos(section.id);
      default:
        return visiblePhotos();
    }
  }, [section, favs]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return base.filter((p) => {
      if (q) {
        const mem = p.relatedMemoryId ? memoryById(p.relatedMemoryId)?.title ?? '' : '';
        const hay = [p.title, p.description ?? '', ...p.tags, ...albumNames(p), dateLabel(p).text, mem].join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (albumFilter && !(albumFilter === 'unsorted' ? p.eventAssociation === 'unassigned' : p.albumIds.includes(albumFilter))) return false;
      for (const f of filters) {
        if (f === 'favourites' && !favs.includes(p.id)) return false;
        if (f === 'portrait' && orientation(p) !== 'portrait') return false;
        if (f === 'landscape' && orientation(p) !== 'landscape') return false;
        if (f === 'recent' && !isRecent(p)) return false;
        if (f === 'dated' && !trustedDate(p)) return false;
        if (f === 'undated' && p.dateStatus !== 'unknown') return false;
        if (f === 'unassigned' && p.eventAssociation !== 'unassigned') return false;
      }
      return true;
    });
  }, [base, query, filters, albumFilter, favs]);

  const activeFilters = filters.size + (albumFilter ? 1 : 0) + (query ? 1 : 0);
  const resetFilters = () => {
    setFilters(new Set());
    setAlbumFilter('');
    setQuery('');
  };

  const open = (p: PhotoAsset) => {
    setSelected(p.id);
    if (!isDeveloped(p, developed)) {
      play('error');
      useUI.getState().notify({ title: 'This photograph hasn’t developed yet.', body: p.secret === 'pufferfish' ? 'Somewhere, five small fish are hiding.' : 'Ruru.exe might know a command.', icon: 'lock' }, { force: true });
      return;
    }
    const ids = list.filter((x) => isDeveloped(x, developed)).map((x) => x.id);
    useUI.getState().openViewer(ids, Math.max(0, ids.indexOf(p.id)));
  };

  const go = (s: Section) => {
    play('click');
    setSection(s);
    resetFilters();
  };

  const showsCollection = section.kind !== 'home' && section.kind !== 'wall' && section.kind !== 'strip';
  const album = section.kind === 'album' ? albums.find((a) => a.id === section.id)! : null;
  const slideshowSource = section.kind === 'album' ? section.id : section.kind === 'favourites' ? 'favourites' : 'all';

  return (
    <div className="photos">
      <aside className="photos__side scroll" aria-label="Library">
        <div className="photos__brand">
          <span className="photos__brand-mark" aria-hidden="true" />
          REVA PHOTO LIBRARY
        </div>
        <div className="tag">Library</div>
        <SideBtn on={section.kind === 'home'} onClick={() => go({ kind: 'home' })}>⌂ Home</SideBtn>
        <SideBtn on={section.kind === 'all'} onClick={() => go({ kind: 'all' })} count={visiblePhotos().length}>
          ▦ All photographs
        </SideBtn>
        <SideBtn on={section.kind === 'favourites'} onClick={() => go({ kind: 'favourites' })} count={favs.length}>
          ♥ Favourites
        </SideBtn>
        <SideBtn on={section.kind === 'recent'} onClick={() => go({ kind: 'recent' })} count={visiblePhotos().filter((p) => isRecent(p)).length}>
          ✦ Recently added
        </SideBtn>
        <div className="tag" style={{ marginTop: 12 }}>
          Albums
        </div>
        {visibleAlbums().map((a) => (
          <SideBtn key={a.id} on={section.kind === 'album' && section.id === a.id} onClick={() => go({ kind: 'album', id: a.id })} count={albumPhotos(a.id).length}>
            {a.no} {a.title}
          </SideBtn>
        ))}
        <div className="tag" style={{ marginTop: 12 }}>
          Studio
        </div>
        <SideBtn on={section.kind === 'wall'} onClick={() => go({ kind: 'wall' })}>▤ The Wall of Reva</SideBtn>
        <SideBtn on={section.kind === 'strip'} onClick={() => go({ kind: 'strip' })}>▯ Make a memory strip</SideBtn>
        <SideBtn on={false} onClick={() => useUI.getState().openSlideshow('all')}>▶ Slideshow</SideBtn>
      </aside>

      {phone && (
        <nav className="photos__tabs" aria-label="Library sections">
          <button className="chip" aria-pressed={section.kind === 'home'} onClick={() => go({ kind: 'home' })}>Home</button>
          <button className="chip" aria-pressed={section.kind === 'all'} onClick={() => go({ kind: 'all' })}>All</button>
          <button className="chip" aria-pressed={section.kind === 'favourites'} onClick={() => go({ kind: 'favourites' })}>♥</button>
          {visibleAlbums().map((a) => (
            <button key={a.id} className="chip" aria-pressed={section.kind === 'album' && section.id === a.id} onClick={() => go({ kind: 'album', id: a.id })}>
              {a.title}
            </button>
          ))}
          <button className="chip" aria-pressed={section.kind === 'wall'} onClick={() => go({ kind: 'wall' })}>Wall</button>
          <button className="chip" aria-pressed={section.kind === 'strip'} onClick={() => go({ kind: 'strip' })}>Strip</button>
        </nav>
      )}

      <main className="photos__main">
        {showsCollection && (
          <div className="photos__toolbar">
            <div className="seg" role="radiogroup" aria-label="View">
              {VIEWS.map((v) => (
                <button key={v.id} role="radio" aria-checked={view === v.id} className="chip" aria-pressed={view === v.id} onClick={() => setView(v.id)} title={v.label}>
                  {v.icon}
                  <span className="hide-sm">{v.label}</span>
                </button>
              ))}
            </div>
            <label className="archive__search photos__search">
              <Search size={14} aria-hidden="true" />
              <span className="sr-only">Search photographs</span>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search titles, tags, dates…" />
            </label>
            <button className={`btn btn--sm ${activeFilters ? 'btn--primary' : ''}`} onClick={() => setShowFilters(!showFilters)} aria-expanded={showFilters}>
              <SlidersHorizontal size={14} /> <span className="hide-sm">Filters</span>
              {activeFilters > 0 && ` · ${activeFilters}`}
            </button>
            <button className="btn btn--sm" onClick={() => useUI.getState().openSlideshow(slideshowSource, selected ?? undefined)} title="Slideshow">
              <Clapperboard size={14} /> <span className="hide-sm">Slideshow</span>
            </button>
          </div>
        )}

        {showsCollection && showFilters && (
          <div className="photos__filters">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                className="chip"
                aria-pressed={filters.has(f.id)}
                onClick={() => {
                  const n = new Set(filters);
                  if (n.has(f.id)) n.delete(f.id);
                  else n.add(f.id);
                  setFilters(n);
                }}
              >
                {f.label}
              </button>
            ))}
            <select className="field photos__select" value={albumFilter} onChange={(e) => setAlbumFilter(e.target.value as AlbumId | '')} aria-label="Filter by album">
              <option value="">Any album</option>
              {visibleAlbums().map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title}
                </option>
              ))}
            </select>
            <button className="btn btn--sm btn--ghost" onClick={resetFilters} disabled={!activeFilters}>
              <X size={13} /> Reset filters
            </button>
          </div>
        )}

        <div className="photos__body scroll">
          <AnimatePresence mode="wait">
            <motion.div key={section.kind + ('id' in section ? section.id : '')} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
              {section.kind === 'home' && <Home go={go} />}
              {section.kind === 'wall' && <Wall />}
              {section.kind === 'strip' && <StripMaker />}
              {showsCollection && (
                <>
                  <CollectionHeader section={section} count={list.length} />
                  {album && <AlbumExtras albumId={album.id} />}
                  {list.length === 0 ? (
                    <div className="photos__empty">
                      {base.length === 0 ? (section.kind === 'favourites' ? 'No favourites yet. Press ♥ on any photograph.' : 'No photographs here yet.') : 'Nothing matches. '}
                      {base.length > 0 && (
                        <button className="btn btn--sm" onClick={resetFilters}>
                          Reset filters
                        </button>
                      )}
                    </div>
                  ) : view === 'grid' ? (
                    <div className="pgrid">
                      {list.map((p) => (
                        <Tile key={p.id} p={p} selected={selected === p.id} onOpen={open} />
                      ))}
                    </div>
                  ) : view === 'masonry' ? (
                    <div className="pmasonry">
                      {list.map((p) => (
                        <Tile key={p.id} p={p} selected={selected === p.id} onOpen={open} natural />
                      ))}
                    </div>
                  ) : view === 'filmstrip' ? (
                    <Filmstrip list={list} selected={selected} setSelected={setSelected} onOpen={open} />
                  ) : (
                    <Timeline list={list} selected={selected} onOpen={open} />
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function SideBtn({ on, onClick, count, children }: { on: boolean; onClick: () => void; count?: number; children: React.ReactNode }) {
  return (
    <button className={`archive__place ${on ? 'is-on' : ''}`} onClick={onClick}>
      <span>{children}</span>
      {count !== undefined && <span className="archive__count">{count}</span>}
    </button>
  );
}

function Tile({ p, selected, onOpen, natural }: { p: PhotoAsset; selected: boolean; onOpen: (p: PhotoAsset) => void; natural?: boolean }) {
  const fav = useProgress((s) => s.photoFavourites.includes(p.id));
  const developed = useProgress((s) => isDeveloped(p, s.developed));
  const size = photoSize(p);
  const date = dateLabel(p);
  if (!developed) {
    return (
      <button className={`ptile ptile--locked ${natural ? 'ptile--natural' : ''}`} onClick={() => onOpen(p)} style={natural ? { aspectRatio: `${size.w} / ${size.h}` } : undefined} aria-label="An undeveloped photograph">
        <span className="ptile__lock">
          <Lock size={16} />
          undeveloped
        </span>
      </button>
    );
  }
  return (
    <div className={`ptile ${selected ? 'is-sel' : ''} ${natural ? 'ptile--natural' : ''}`}>
      <button className="ptile__btn" onClick={() => onOpen(p)} aria-label={`${p.title}, ${date.text}`}>
        <img className="photo" src={photoSrc(p, { thumb: true }) ?? ''} alt={p.description ?? p.title} loading="lazy" decoding="async" width={size.w} height={size.h} />
        <span className="ptile__cap">
          <b>{p.title}</b>
          <i className={`date date--${date.kind}`}>{date.text}</i>
        </span>
      </button>
      <button
        className={`ptile__fav ${fav ? 'is-on' : ''}`}
        aria-pressed={fav}
        aria-label={fav ? `Remove ${p.title} from favourites` : `Add ${p.title} to favourites`}
        onClick={() => (play('pop'), useProgress.getState().togglePhotoFavourite(p.id))}
      >
        <Heart size={14} fill={fav ? 'currentColor' : 'none'} />
      </button>
    </div>
  );
}

function Filmstrip({ list, selected, setSelected, onOpen }: { list: PhotoAsset[]; selected: string | null; setSelected: (id: string) => void; onOpen: (p: PhotoAsset) => void }) {
  const developed = useProgress((s) => s.developed);
  const dev = list.filter((p) => isDeveloped(p, developed));
  const cur = dev.find((p) => p.id === selected) ?? dev[0];
  useEffect(() => {
    document.querySelector('.film__frame.is-on')?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [cur?.id]);
  if (!cur) return <div className="photos__empty">Nothing developed here yet.</div>;
  const i = dev.indexOf(cur);
  return (
    <div className="film">
      <div className="film__preview">
        <button className="img-btn" onClick={() => onOpen(cur)} aria-label={`Open ${cur.title}`}>
          <img className="photo" src={photoSrc(cur) ?? ''} alt={cur.description ?? cur.title} />
        </button>
        <div className="film__cap">
          <b>{cur.title}</b> <span className="mono">{dateLabel(cur).text}</span>
          <span className="film__nav">
            <button className="btn btn--sm" onClick={() => setSelected(dev[(i - 1 + dev.length) % dev.length].id)} aria-label="Previous">
              ←
            </button>
            <button className="btn btn--sm" onClick={() => setSelected(dev[(i + 1) % dev.length].id)} aria-label="Next">
              →
            </button>
          </span>
        </div>
      </div>
      <div className="film__strip scroll" role="listbox" aria-label="Filmstrip">
        {dev.map((p, n) => (
          <button key={p.id} role="option" aria-selected={p.id === cur.id} className={`film__frame ${p.id === cur.id ? 'is-on' : ''}`} onClick={() => setSelected(p.id)} onDoubleClick={() => onOpen(p)}>
            <img className="photo" src={photoSrc(p, { thumb: true }) ?? ''} alt={p.title} loading="lazy" />
            <span className="mono">{String(n + 1).padStart(2, '0')}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Timeline({ list, selected, onOpen }: { list: PhotoAsset[]; selected: string | null; onOpen: (p: PhotoAsset) => void }) {
  const dated = list.filter((p) => trustedDate(p)).sort((a, b) => trustedDate(a)!.localeCompare(trustedDate(b)!));
  const byFile = list.filter((p) => !trustedDate(p) && p.fileDate).sort((a, b) => a.fileDate!.localeCompare(b.fileDate!));
  const provisional = list.filter((p) => !trustedDate(p) && p.eventAssociation === 'provisional' && p.eventDate).sort((a, b) => a.eventDate!.localeCompare(b.eventDate!));
  const undated = list.filter((p) => !trustedDate(p) && !p.fileDate && !(p.eventAssociation === 'provisional' && p.eventDate));
  const groups = (xs: PhotoAsset[], key: (p: PhotoAsset) => string) => {
    const m = new Map<string, PhotoAsset[]>();
    xs.forEach((p) => m.set(key(p), [...(m.get(key(p)) ?? []), p]));
    return [...m.entries()];
  };
  return (
    <div className="tline">
      <p className="editor-note">Only verified capture dates and confirmed events are placed on the timeline.</p>
      {groups(dated, (p) => trustedDate(p)!).map(([d, ps]) => (
        <section key={d} className="tline__day">
          <div className="tline__date mono">{dotDate(d)}</div>
          <div className="tline__row">
            {ps.map((p) => (
              <Tile key={p.id} p={p} selected={selected === p.id} onOpen={onOpen} />
            ))}
          </div>
        </section>
      ))}
      {byFile.length > 0 && (
        <>
          <h4 className="tline__lane">Dated by file only (approximate)</h4>
          {groups(byFile, (p) => p.fileDate!).map(([d, ps]) => (
            <section key={d} className="tline__day tline__day--approx">
              <div className="tline__date mono">≈ {dotDate(d)}</div>
              <div className="tline__row">
                {ps.map((p) => (
                  <Tile key={p.id} p={p} selected={selected === p.id} onOpen={onOpen} />
                ))}
              </div>
            </section>
          ))}
        </>
      )}
      {provisional.length > 0 && (
        <>
          <h4 className="tline__lane">Provisional (date read from the photos, not confirmed)</h4>
          {groups(provisional, (p) => p.eventDate!).map(([d, ps]) => (
            <section key={d} className="tline__day tline__day--approx">
              <div className="tline__date mono">{dotDate(d)}?</div>
              <div className="tline__row">
                {ps.map((p) => (
                  <Tile key={p.id} p={p} selected={selected === p.id} onOpen={onOpen} />
                ))}
              </div>
            </section>
          ))}
        </>
      )}
      {undated.length > 0 && <p className="tline__undated">{undated.length} undated photograph{undated.length === 1 ? '' : 's'} not placed on the timeline.</p>}
    </div>
  );
}

function CollectionHeader({ section, count }: { section: Section; count: number }) {
  const album = section.kind === 'album' ? albums.find((a) => a.id === section.id) : null;
  const title =
    section.kind === 'all' ? 'All photographs' : section.kind === 'favourites' ? 'Favourites' : section.kind === 'recent' ? 'Recently added' : album ? album.title : '';
  const blurb =
    section.kind === 'all'
      ? 'Every approved photograph in the library.'
      : section.kind === 'favourites'
        ? 'Saved on this device.'
        : section.kind === 'recent'
          ? 'The newest photographs in the library.'
          : album?.blurb;
  return (
    <header className="phead">
      {album && <div className="phead__no mono">ALBUM {album.no}</div>}
      <h2>{title}</h2>
      <p>
        {blurb} <span className="mono">· {count} photograph{count === 1 ? '' : 's'}</span>
      </p>
    </header>
  );
}

function AlbumExtras({ albumId }: { albumId: AlbumId }) {
  const album = albums.find((a) => a.id === albumId)!;
  return (
    <>
      {album.memoryCards && (
        <div className="mcards">
          {album.memoryCards.map((id) => {
            const m = memoryById(id);
            if (!m) return null;
            return (
              <button key={id} className="mcard" onClick={() => useDesktop.getState().open('archive', { memoryId: id })}>
                <span className="mcard__date mono">{dotDate(m.date)}</span>
                <b>{m.title}</b>
                {m.messages?.[0] && m.messages[0] !== '…' && <ChatBubble id={m.messages[0]} compact />}
                <span className="mcard__empty">No photograph on record for this memory.</span>
                <span className="mcard__link">Open in the archive →</span>
              </button>
            );
          })}
        </div>
      )}
      {albumId === 'flowers' && (
        <div className="mcards">
          {missingPhotos.map((m) => (
            <div key={m.id} className="mcard mcard--missing">
              <span className="mcard__date mono">PHOTO PENDING</span>
              <b>{m.title}</b>
              <span className="mcard__empty">{m.note}</span>
            </div>
          ))}
          <button className="mcard" onClick={() => useDesktop.getState().open('flowers')}>
            <span className="mcard__date mono">ILLUSTRATIONS</span>
            <b>White lily · tiger lily · poppy</b>
            <span className="mcard__empty">Drawn, not photographed. They live, labelled, in the Flower Department.</span>
            <span className="mcard__link">Open flower.exe →</span>
          </button>
        </div>
      )}
    </>
  );
}

function Home({ go }: { go: (s: Section) => void }) {
  const favs = useProgress((s) => s.photoFavourites);
  const all = visiblePhotos();
  const unsorted = albumPhotos('unsorted').length;
  const recent = all.filter((p) => isRecent(p)).length;
  const today = new Date();
  const md = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const onThisDay = viewablePhotos().filter((p) => trustedDate(p)?.slice(5) === md);
  const stats: [string, number][] = [
    ['photographs', all.length],
    ['albums', visibleAlbums().length],
    ['favourites', favs.length],
    ['unsorted', unsorted],
    ['recently added', recent],
  ];

  return (
    <div className="phome">
      <header className="phome__head">
        <h1>REVA PHOTO LIBRARY</h1>
        <p>All the little frames worth keeping.</p>
        <dl className="phome__stats">
          {stats.map(([k, v]) => (
            <div key={k}>
              <dd>{v}</dd>
              <dt>{k}</dt>
            </div>
          ))}
        </dl>
      </header>

      <div className="phome__actions">
        <button className="phome__remind" onClick={remindRandom}>
          <Dices size={18} /> REMIND ME OF SOMETHING RANDOM
        </button>
        <button className="btn" onClick={() => useUI.getState().openSlideshow('all')}>
          <Clapperboard size={15} /> Slideshow
        </button>
        <button className="btn" onClick={() => go({ kind: 'wall' })}>
          <Sparkles size={15} /> The Wall of Reva
        </button>
        <button className="btn" onClick={() => go({ kind: 'strip' })}>
          ▯ Make a memory strip
        </button>
      </div>

      <section className="phome__otd">
        <div className="tag">On this day · {dotDate(`${today.getFullYear()}-${md}`).slice(0, 5)}</div>
        {onThisDay.length ? (
          <div className="phome__otd-row">
            {onThisDay.map((p) => (
              <button key={p.id} className="img-btn" onClick={() => useUI.getState().openViewer(onThisDay.map((x) => x.id), onThisDay.indexOf(p))}>
                <img className="photo" src={photoSrc(p, { thumb: true }) ?? ''} alt={p.title} />
              </button>
            ))}
          </div>
        ) : (
          <p className="editor-note">Nothing with a verified date falls on today. Yet.</p>
        )}
      </section>

      <div className="covers">
        {visibleAlbums().map((a, i) => {
          const cover = albumCover(a.id);
          const n = albumPhotos(a.id).length;
          return (
            <motion.button key={a.id} className={`cover cover--${i % 3}`} onClick={() => go({ kind: 'album', id: a.id })} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <span className="cover__img">
                {cover ? (
                  <img className="photo" src={photoSrc(cover, { thumb: true }) ?? ''} alt="" loading="lazy" />
                ) : (
                  <span className="cover__empty mono">
                    {a.memoryCards?.map((id) => dotDate(memoryById(id)!.date).slice(0, 5)).join(' · ')}
                    <br />
                    no photographs yet
                  </span>
                )}
              </span>
              <span className="cover__label">
                <span className="mono">ALBUM {a.no}</span>
                <b>{a.title}</b>
                <span>
                  {n} photo{n === 1 ? '' : 's'}
                  {a.private ? ' · private' : ''}
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>
      <p className="editor-note" style={{ marginTop: 18 }}>
        Undated photographs stay undated. Nothing here has been given a memory it can’t prove.
      </p>
    </div>
  );
}

