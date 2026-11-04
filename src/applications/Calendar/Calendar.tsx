import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ChatThread, HiddenPuffer, Img } from '../../components/common';
import { today } from '../../config';
import { calendarCopy, calendarEvents, calendarRange } from '../../data/calendar';
import { msg, senderLabel } from '../../data/curatedContent';
import { dotDate, months } from '../../data/memories';
import type { CalendarEvent } from '../../data/types';
import { play } from '../../lib/sound';
import { useDesktop } from '../../store/desktopStore';

const pad = (n: number) => String(n).padStart(2, '0');
const iso = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;
const WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function monthKeys() {
  const [sy, sm] = calendarRange.start.split('-').map(Number);
  const [ey, em] = calendarRange.end.split('-').map(Number);
  const out: [number, number][] = [];
  for (let y = sy, m = sm - 1; y < ey || (y === ey && m <= em - 1); m++) {
    if (m > 11) {
      m = 0;
      y++;
    }
    out.push([y, m]);
  }
  return out;
}

export default function Calendar() {
  const keys = useMemo(monthKeys, []);
  const now = today();
  const todayIso = iso(now.getFullYear(), now.getMonth(), now.getDate());
  const startIdx = Math.max(0, keys.findIndex(([y, m]) => y === now.getFullYear() && m === now.getMonth()));
  const [idx, setIdx] = useState(startIdx === -1 ? 0 : startIdx);
  const [picked, setPicked] = useState<string | null>(null);
  const [y, m] = keys[idx];

  const days = new Date(y, m + 1, 0).getDate();
  const offset = (new Date(y, m, 1).getDay() + 6) % 7;
  const evOn = (d: string) => calendarEvents.filter((e) => e.date === d);
  const featured = msg(calendarCopy.featuredQuoteId);

  const sel = picked ?? (calendarEvents.find((e) => e.date.startsWith(`${y}-${pad(m + 1)}`) && e.kind === 'meeting')?.date ?? iso(y, m, 27));
  const selEvents = evOn(sel);
  const selIs27 = sel.endsWith('-27');
  const selFuture = sel > todayIso;

  return (
    <div className="cal">
      <header className="cal__head">
        <div>
          <div className="tag">membership: 2 · meetings on record: 2</div>
          <h2>{calendarCopy.title}</h2>
          <p className="cal__tagline">{calendarCopy.tagline}</p>
        </div>
        <figure className="cal__quote">
          <blockquote>“{featured.text}”</blockquote>
          <figcaption>
            {senderLabel[featured.sender]} · {featured.date.replace(/\//g, '.')}
          </figcaption>
          <div className="cal__origin">
            <span className="tag">club origin</span>
            <ChatThread ids={calendarCopy.originIds} compact />
          </div>
        </figure>
      </header>

      <div className="cal__main">
        <section className="cal__month" aria-label={`${months[m]} ${y}`}>
          <div className="cal__nav">
            <button className="btn btn--sm btn--ghost" disabled={idx === 0} onClick={() => (setIdx(idx - 1), setPicked(null), play('paper'))} aria-label="Previous month">
              <ChevronLeft size={16} />
            </button>
            <AnimatePresence mode="wait">
              <motion.h3 key={idx} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.15 }}>
                {months[m].charAt(0) + months[m].slice(1).toLowerCase()} <span>{y}</span>
              </motion.h3>
            </AnimatePresence>
            <button className="btn btn--sm btn--ghost" disabled={idx === keys.length - 1} onClick={() => (setIdx(idx + 1), setPicked(null), play('paper'))} aria-label="Next month">
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="cal__grid" role="grid">
            {WEEK.map((w) => (
              <div key={w} className="cal__wd" role="columnheader">
                {w}
              </div>
            ))}
            {Array.from({ length: offset }, (_, i) => (
              <div key={`e${i}`} />
            ))}
            {Array.from({ length: days }, (_, i) => {
              const d = i + 1;
              const key = iso(y, m, d);
              const evs = evOn(key);
              const is27 = d === 27;
              const future = key > todayIso;
              const cls = ['cal__day', is27 && 'is-27', evs.length && 'has-ev', evs.some((e) => e.kind === 'meeting') && 'is-meeting', future && 'is-future', key === todayIso && 'is-today', sel === key && 'is-sel']
                .filter(Boolean)
                .join(' ');
              return (
                <button key={key} role="gridcell" className={cls} onClick={() => (setPicked(key), play('click'))} aria-label={`${d} ${months[m]}${evs.length ? `: ${evs.map((e) => e.title).join(', ')}` : ''}${is27 ? ', a 27th' : ''}`}>
                  <span className="cal__num">{d}</span>
                  {is27 && <span className="cal__seal">{future ? <Lock size={10} /> : evs.length ? '★' : '27'}</span>}
                  {evs.length > 0 && !is27 && <span className="cal__dot" />}
                  {evs[0] && <span className="cal__label">{evs[0].title}</span>}
                </button>
              );
            })}
          </div>
          <div className="cal__legend">
            <span>
              <i className="lg lg--27" /> a 27th
            </span>
            <span>
              <i className="lg lg--ev" /> a memory
            </span>
            <span>
              <i className="lg lg--future" /> still waiting
            </span>
            <HiddenPuffer spot="calendar" style={{ marginLeft: 'auto', opacity: 0.45 }} />
          </div>
        </section>

        <aside className="cal__detail" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div key={sel} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
              <div className="cal__detail-date">{dotDate(sel)}</div>
              {selEvents.length ? (
                selEvents.map((e) => <EventCard key={e.title} e={e} />)
              ) : selIs27 ? (
                selFuture ? (
                  <div className="cal__locked">
                    <Lock size={18} />
                    <p>{calendarCopy.locked}</p>
                  </div>
                ) : (
                  <p className="editor-note">{calendarCopy.unrecorded}</p>
                )
              ) : selFuture ? (
                <p className="editor-note">Unwritten.</p>
              ) : (
                <p className="editor-note">Nothing filed for this day.</p>
              )}
            </motion.div>
          </AnimatePresence>
        </aside>
      </div>
    </div>
  );
}

function EventCard({ e }: { e: CalendarEvent }) {
  return (
    <div className={`cal__event cal__event--${e.kind}`}>
      <div className="tag">{e.kind === 'meeting' ? '27th club meeting' : e.kind === 'milestone' ? 'milestone' : 'memory'}</div>
      <h4>{e.title}</h4>
      <p>{e.description}</p>
      {e.kind !== 'milestone' &&
        (e.photos?.length ? (
          <div className="cal__photos">
            {e.photos.map((id) => (
              <Img key={id} id={id} openable group={e.photos} className="cal__photo" />
            ))}
          </div>
        ) : (
          <div className="cal__nophoto">
            <span className="mono">{dotDate(e.date)}</span>
            <span>No photograph on record for this day.</span>
          </div>
        ))}
      {e.memoryId && (
        <button className="btn btn--sm" onClick={() => useDesktop.getState().open('archive', { memoryId: e.memoryId })}>
          Open in archive →
        </button>
      )}
    </div>
  );
}
