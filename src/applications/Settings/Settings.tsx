import { wallpapers } from '../../config';
import { getPhoto, photoSrc, visibleAlbums } from '../../lib/photos';
import { hiddenPufferfish } from '../../data/easterEggs';
import { play } from '../../lib/sound';
import { useProgress } from '../../store/progressStore';
import { useSettings, type MotionPref, type SaverStyle, type WallpaperMode } from '../../store/settingsStore';

const WP_MODES: WallpaperMode[] = ['fill', 'fit', 'centre', 'blur'];
import { useUI } from '../../store/uiStore';

function Toggle({ label, hint, on, onChange }: { label: string; hint?: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="set-row">
      <span>
        <b>{label}</b>
        {hint && <small>{hint}</small>}
      </span>
      <button role="switch" aria-checked={on} className={`switch ${on ? 'is-on' : ''}`} onClick={() => (onChange(!on), play('click'))}>
        <i />
      </button>
    </label>
  );
}

export default function Settings() {
  const s = useSettings();
  const found = useProgress((p) => p.hiddenFound.length);
  const wpPhoto = s.wallpaperPhoto ? getPhoto(s.wallpaperPhoto.id) : undefined;
  const revealed = useProgress((p) => p.revealedAwards.length);

  return (
    <div className="settings scroll">
      <section>
        <h3>Sound</h3>
        <Toggle label="System sounds" hint="Clicks, notifications, the drumroll." on={s.sound} onChange={(v) => s.set({ sound: v })} />
        <label className="set-row">
          <span>
            <b>Volume</b>
            <small>{Math.round(s.volume * 100)}%</small>
          </span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={s.volume}
            disabled={!s.sound}
            onChange={(e) => s.set({ volume: Number(e.target.value) })}
            onPointerUp={() => play('notify')}
            aria-label="Volume"
          />
        </label>
      </section>

      <section>
        <h3>Motion</h3>
        <div className="set-row">
          <span>
            <b>Animation</b>
            <small>“System” follows your device’s reduce-motion setting.</small>
          </span>
          <div className="seg" role="radiogroup" aria-label="Animation">
            {(['system', 'full', 'reduced'] as MotionPref[]).map((m) => (
              <button key={m} role="radio" aria-checked={s.motion === m} className="chip" aria-pressed={s.motion === m} onClick={() => s.set({ motion: m })}>
                {m}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h3>Desktop</h3>
        <div className="wp-grid" role="radiogroup" aria-label="Wallpaper pattern">
          {wallpapers.map((w) => (
            <button
              key={w.id}
              role="radio"
              aria-checked={!s.wallpaperPhoto && s.wallpaper === w.id}
              className={`wp ${!s.wallpaperPhoto && s.wallpaper === w.id ? 'is-on' : ''}`}
              onClick={() => s.set({ wallpaper: w.id, wallpaperPhoto: null })}
            >
              <span className={`wp__swatch wallpaper--${w.id}`} />
              <span>{w.label}</span>
            </button>
          ))}
          {wpPhoto && (
            <button className="wp is-on" aria-checked role="radio">
              <span className="wp__swatch" style={{ backgroundImage: `url(${photoSrc(wpPhoto, { thumb: true })})` }} />
              <span>{wpPhoto.title}</span>
            </button>
          )}
        </div>
        {s.wallpaperPhoto ? (
          <div className="set-row">
            <span>
              <b>Photo wallpaper</b>
              <small>Portraits get a blurred fill instead of being cropped.</small>
            </span>
            <div className="seg" role="radiogroup" aria-label="Photo wallpaper mode">
              {WP_MODES.map((m) => (
                <button key={m} role="radio" className="chip" aria-checked={s.wallpaperPhoto?.mode === m} aria-pressed={s.wallpaperPhoto?.mode === m} onClick={() => s.set({ wallpaperPhoto: { id: s.wallpaperPhoto!.id, mode: m } })}>
                  {m}
                </button>
              ))}
              <button className="chip" onClick={() => s.set({ wallpaperPhoto: null })}>
                reset
              </button>
            </div>
          </div>
        ) : (
          <p className="editor-note">To use a photograph: open it in photos.exe and press “Set as wallpaper”.</p>
        )}
        <Toggle label="Notifications" hint="Occasional system messages. Award news still comes through." on={s.notifications} onChange={(v) => s.set({ notifications: v })} />
        <Toggle label="Screensaver" hint="After about 50 seconds idle, only when no window is open." on={s.screensaver} onChange={(v) => s.set({ screensaver: v })} />
        <Toggle label="Wandering pufferfish" hint="Swims by now and then." on={s.pufferfish} onChange={(v) => s.set({ pufferfish: v })} />
      </section>

      <section>
        <h3>Screensaver</h3>
        <div className="set-row">
          <span>
            <b>Photographs from</b>
          </span>
          <select className="field" style={{ width: 'auto' }} value={s.saverSource} onChange={(e) => s.set({ saverSource: e.target.value })} aria-label="Screensaver photographs">
            <option value="all">All approved photos</option>
            <option value="favourites">Favourites only</option>
            {visibleAlbums().map((a) => (
              <option key={a.id} value={a.id}>
                {a.title}
              </option>
            ))}
          </select>
        </div>
        <div className="set-row">
          <span>
            <b>Style</b>
          </span>
          <div className="seg" role="radiogroup" aria-label="Screensaver style">
            {(['polaroid', 'filmstrip', 'drift'] as SaverStyle[]).map((m) => (
              <button key={m} role="radio" className="chip" aria-checked={s.saverStyle === m} aria-pressed={s.saverStyle === m} onClick={() => s.set({ saverStyle: m })}>
                {m}
              </button>
            ))}
          </div>
        </div>
        <Toggle label="Shuffle" on={s.saverShuffle} onChange={(v) => s.set({ saverShuffle: v })} />
        <Toggle label="Ambient sound" hint="A very soft chord between photographs." on={s.saverSound} onChange={(v) => s.set({ saverSound: v })} />
      </section>

      <section>
        <h3>About this system</h3>
        <div className="sysrow">
          <span>Hidden pufferfish found</span>
          <b>
            {found}/{hiddenPufferfish.length}
          </b>
        </div>
        <div className="sysrow">
          <span>Trophies in the Hall of Fame</span>
          <b>{revealed}</b>
        </div>
        <div className="set-actions">
          <button className="btn btn--sm" onClick={() => useUI.getState().reboot()}>
            Replay the boot sequence
          </button>
          <button
            className="btn btn--sm btn--ghost"
            onClick={() => {
              if (window.confirm('Reset trophies, votes, favourites and discoveries on this device?')) useProgress.getState().reset();
            }}
          >
            Reset progress
          </button>
        </div>
        <p className="editor-note" style={{ marginTop: 14 }}>
          Settings and progress are saved only in this browser. Nothing is sent anywhere.
        </p>
      </section>
    </div>
  );
}
