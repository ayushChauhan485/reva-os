import { useEffect, useRef, useState } from 'react';
import { config, today, wallpapers } from '../config';
import { apps, desktopOrder, type AppId } from '../data/apps';
import { facts, pufferfishStats } from '../data/curatedContent';
import { useIsTouch, useNow } from '../lib/hooks';
import { play } from '../lib/sound';
import { useDesktop } from '../store/desktopStore';
import { useProgress } from '../store/progressStore';
import { useSettings } from '../store/settingsStore';
import { useUI } from '../store/uiStore';
import { AppIcon } from './AppIcon';
import { Img, openPhotos } from './common';
import { getPhoto, photoOfTheDay, photoSrc, randomPhoto, remindRandom, dateLabel, viewablePhotos } from '../lib/photos';
import { Dices } from 'lucide-react';
import { awards } from '../data/awards';

function greetingFor(h: number) {
  if (h < 5) return 'Still up';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const ICONS: AppId[] = [...desktopOrder, 'lostfound'];

export function Desktop() {
  const wallpaper = useSettings((s) => s.wallpaper);
  const wallpaperPhoto = useSettings((s) => s.wallpaperPhoto);
  const recent = useProgress((s) => s.recentPhotos);
  const developed = useProgress((s) => s.developed);
  const [polaroidId, setPolaroidId] = useState(() => randomPhoto()?.id);
  const [selected, setSelected] = useState<AppId | null>(null);
  const [ctx, setCtx] = useState<{ x: number; y: number } | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const touch = useIsTouch();
  const now = useNow(60_000);
  const longPress = useRef<number | null>(null);
  const revealed = useProgress((s) => s.revealedAwards.filter((id) => awards.some((a) => a.id === id && a.isUnlocked)).length);

  const wp = wallpapers.find((w) => w.id === wallpaper) ?? wallpapers[0];
  const wpPhoto = wallpaperPhoto ? getPhoto(wallpaperPhoto.id) : undefined;
  const night = !wpPhoto && wp.id === 'night';
  const potd = photoOfTheDay();
  const polaroid = polaroidId ? getPhoto(polaroidId) : undefined;
  const viewable = new Set(viewablePhotos(developed).map((p) => p.id));
  const recentList = recent.filter((id) => viewable.has(id)).slice(0, 6);
  const appCount = desktopOrder.filter((id) => apps[id].core).length;
  const days = Math.floor((today().getTime() - new Date(`${facts.firstDate.iso}T00:00:00`).getTime()) / 86_400_000);
  const mainAwards = awards.filter((a) => a.isUnlocked).length;

  const open = (id: AppId) => {
    setSelected(id);
    useDesktop.getState().open(id);
  };

  useEffect(() => {
    if (!ctx) return;
    const off = (e: PointerEvent) => !(e.target as HTMLElement).closest('.dropdown') && setCtx(null);
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setCtx(null);
    window.addEventListener('pointerdown', off);
    window.addEventListener('keydown', esc);
    return () => {
      window.removeEventListener('pointerdown', off);
      window.removeEventListener('keydown', esc);
    };
  }, [ctx]);

  const cycleWallpaper = () => {
    const i = wallpapers.findIndex((w) => w.id === wallpaper);
    useSettings.getState().set({ wallpaper: wallpapers[(i + 1) % wallpapers.length].id });
  };

  return (
    <div className={`desktop ${night ? 'desktop--night' : ''}`}>
      {wpPhoto && wallpaperPhoto ? (
        <div className={`wallpaper wallpaper--photo wallpaper--${wallpaperPhoto.mode}`} aria-hidden="true">
          <div className="wallpaper__blur" style={{ backgroundImage: `url(${photoSrc(wpPhoto, { thumb: true })})` }} />
          <div className="wallpaper__img" style={{ backgroundImage: `url(${photoSrc(wpPhoto)})`, backgroundPosition: 'center' }} />
        </div>
      ) : (
        <div className={`wallpaper wallpaper--${wp.id}`} aria-hidden="true">
          <div className="wallpaper__mark">21.0</div>
        </div>
      )}

      <div
        key={refreshKey}
        className="desktop__surface"
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) setSelected(null);
          if (e.pointerType === 'touch' && e.target === e.currentTarget) {
            const { clientX: x, clientY: y } = e;
            longPress.current = window.setTimeout(() => setCtx({ x, y }), 550);
          }
        }}
        onPointerUp={() => longPress.current && clearTimeout(longPress.current)}
        onPointerMove={() => longPress.current && clearTimeout(longPress.current)}
        onContextMenu={(e) => {
          if ((e.target as HTMLElement).closest('.widget, .icon, .poster, .polaroid, .desk-polaroid')) return;
          e.preventDefault();
          setCtx({ x: Math.min(e.clientX, window.innerWidth - 240), y: Math.min(e.clientY, window.innerHeight - 200) });
        }}
      >
        <div className="icons" role="listbox" aria-label="Desktop" aria-orientation="vertical">
          {ICONS.map((id) => (
            <button
              key={id}
              role="option"
              aria-selected={selected === id}
              className={`icon ${id === 'awards' ? 'icon--feature' : ''}`}
              onClick={() => {
                play('click');
                if (touch) open(id);
                else setSelected(id);
              }}
              onDoubleClick={() => !touch && open(id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  open(id);
                }
              }}
              title={touch ? undefined : 'Double-click to open'}
            >
              <span className="icon__img">
                <AppIcon id={id} size={52} />
              </span>
              <span className="icon__label">{apps[id].file}</span>
            </button>
          ))}
        </div>

        <header className="greeting">
          <div className="greeting__eyebrow">
            {now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
          <h1>
            {greetingFor(now.getHours())}, <em>{config.userName}.</em>
          </h1>
          <p>Your little corner of the internet is ready.</p>
          <div className="greeting__status">
            <i aria-hidden="true" /> {appCount} applications available. 1 very specific user.
          </div>
          {!touch && <p className="tag" style={{ marginTop: 14, opacity: 0.7 }}>double-click an icon to open · right-click the desktop for more</p>}
          {polaroid && (
            <div className="desk-polaroid">
              <button className="polaroid" onClick={() => openPhotos([polaroid.id], polaroid.id)} aria-label={`Open ${polaroid.title}`}>
                <span className="tape" aria-hidden="true" />
                <Img id={polaroid.id} />
                <figcaption>{polaroid.title}</figcaption>
              </button>
              <div className="desk-polaroid__btns">
                <button className="btn btn--sm" onClick={() => (play('paper'), setPolaroidId(randomPhoto(polaroid.id)?.id))}>
                  another
                </button>
                <button className="btn btn--sm" onClick={remindRandom}>
                  <Dices size={13} /> remind me of something
                </button>
              </div>
            </div>
          )}
        </header>

        <aside className="widgets" aria-label="Widgets">
          <button className="poster" onClick={() => open('awards')}>
            <div className="poster__bulbs" aria-hidden="true">
              {Array.from({ length: 11 }, (_, i) => (
                <i key={i} />
              ))}
            </div>
            <div className="poster__kicker">TONIGHT · LIVE</div>
            <div className="poster__title">The 21st Annual Reva Awards</div>
            <div style={{ fontSize: 13, opacity: 0.85 }}>
              {revealed === 0 ? 'The envelopes are sealed.' : `${revealed} of ${mainAwards} envelopes opened.`}
            </div>
            <span className="poster__live">
              <i /> ENTER THE CEREMONY →
            </span>
          </button>

          <section className="widget">
            <div className="widget__head">
              <span>System</span>
              <span>v{config.version}</span>
            </div>
            <div className="widget__body">
              <div className="sysrow">
                <span>uptime since 27.04</span>
                <b>{days} days</b>
              </div>
              <div className="sysrow">
                <span>pufferfish on record</span>
                <b>{pufferfishStats.total}</b>
              </div>
              <div className="meter" aria-hidden="true">
                <i style={{ width: `${(pufferfishStats.inGoodnights / pufferfishStats.total) * 100}%` }} />
              </div>
              <div className="sysrow" style={{ fontSize: 11, opacity: 0.7 }}>
                <span>{pufferfishStats.inGoodnights} arrived with a goodnight</span>
              </div>
              <div className="sysrow">
                <span>cuteness check</span>
                <b style={{ color: 'var(--red)' }}>over limit</b>
              </div>
            </div>
          </section>

          {potd && (
            <section className="widget potd">
              <div className="widget__head">
                <span>Photo of the day</span>
                <button className="potd__open" onClick={() => open('photos')}>
                  library →
                </button>
              </div>
              <button className="potd__img" onClick={() => openPhotos([potd.id], potd.id)} aria-label={`Open ${potd.title}`}>
                <Img id={potd.id} />
              </button>
              <div className="widget__body potd__cap">
                <b>{potd.title}</b>
                <span className="mono">{dateLabel(potd).text}</span>
              </div>
            </section>
          )}

          {recentList.length > 0 && (
            <section className="widget">
              <div className="widget__head">
                <span>Recently viewed</span>
                <span>{recentList.length}</span>
              </div>
              <div className="recent">
                {recentList.map((id) => {
                  const p = getPhoto(id)!;
                  return (
                    <button key={id} className="recent__item" onClick={() => openPhotos(recentList, id)} aria-label={`Open ${p.title}`}>
                      <img className="photo" src={photoSrc(p, { thumb: true }) ?? ''} alt="" loading="lazy" />
                    </button>
                  );
                })}
              </div>
            </section>
          )}
        </aside>
      </div>

      {ctx && (
        <div className="dropdown" role="menu" style={{ top: ctx.y, left: ctx.x }}>
          <button role="menuitem" onClick={() => (setCtx(null), useSettings.getState().set({ wallpaperPhoto: null }), cycleWallpaper())}>
            Change wallpaper
          </button>
          <button role="menuitem" onClick={() => (setCtx(null), useDesktop.getState().open('photos'))}>
            Pick a photo wallpaper…
          </button>
          <button role="menuitem" onClick={() => (setCtx(null), useDesktop.getState().open('settings'))}>
            Open settings
          </button>
          <button
            role="menuitem"
            onClick={() => {
              setCtx(null);
              setSelected(null);
              setRefreshKey((k) => k + 1);
              play('click');
            }}
          >
            Refresh desktop
          </button>
          <hr />
          <button role="menuitem" onClick={() => (setCtx(null), useDesktop.getState().open('about'))}>
            About Reva OS
          </button>
          <button role="menuitem" onClick={() => (setCtx(null), useUI.getState().summonPufferfish())}>
            Release a pufferfish
          </button>
        </div>
      )}
    </div>
  );
}
