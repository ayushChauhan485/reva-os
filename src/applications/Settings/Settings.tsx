import { wallpapers } from '../../config';
import { photo } from '../../data/assets';
import { hiddenPufferfish } from '../../data/easterEggs';
import { play } from '../../lib/sound';
import { useProgress } from '../../store/progressStore';
import { useSettings, type MotionPref } from '../../store/settingsStore';
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
        <div className="wp-grid" role="radiogroup" aria-label="Wallpaper">
          {wallpapers.map((w) => {
            const p = w.photo ? photo(w.photo) : null;
            return (
              <button key={w.id} role="radio" aria-checked={s.wallpaper === w.id} className={`wp ${s.wallpaper === w.id ? 'is-on' : ''}`} onClick={() => s.set({ wallpaper: w.id })}>
                <span className={`wp__swatch wallpaper--${p ? 'photo' : w.id}`} style={p ? { backgroundImage: `url(${p.thumb})` } : undefined} />
                <span>{w.label}</span>
              </button>
            );
          })}
        </div>
        <Toggle label="Notifications" hint="Occasional system messages. Award news still comes through." on={s.notifications} onChange={(v) => s.set({ notifications: v })} />
        <Toggle label="Screensaver" hint="After about 50 seconds idle, only when no window is open." on={s.screensaver} onChange={(v) => s.set({ screensaver: v })} />
        <Toggle label="Wandering pufferfish" hint="Swims by now and then." on={s.pufferfish} onChange={(v) => s.set({ pufferfish: v })} />
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
