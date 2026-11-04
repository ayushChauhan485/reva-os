import { Bell, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { apps } from '../data/apps';
import { useNow } from '../lib/hooks';
import { play } from '../lib/sound';
import { useDesktop } from '../store/desktopStore';
import { useSettings } from '../store/settingsStore';
import { useUI } from '../store/uiStore';
import { RevaLogo } from './AppIcon';

type Menu = 'os' | 'notifs' | null;

export function MenuBar() {
  const focused = useDesktop((s) => s.focused);
  const sound = useSettings((s) => s.sound);
  const unread = useUI((s) => s.unread);
  const history = useUI((s) => s.history);
  const now = useNow(15_000);
  const [menu, setMenu] = useState<Menu>(null);
  const barRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!menu) return;
    const off = (e: PointerEvent) => {
      if (!(e.target as HTMLElement).closest('.dropdown, .menubar')) setMenu(null);
    };
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(null);
    window.addEventListener('pointerdown', off);
    window.addEventListener('keydown', esc);
    return () => {
      window.removeEventListener('pointerdown', off);
      window.removeEventListener('keydown', esc);
    };
  }, [menu]);

  const run = (fn: () => void) => () => {
    setMenu(null);
    play('click');
    fn();
  };

  const d = useDesktop.getState();
  const date = now.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      <nav className="menubar" ref={barRef} aria-label="Menu bar">
        <button className="menubar__item menubar__logo" aria-haspopup="menu" aria-expanded={menu === 'os'} onClick={() => setMenu(menu === 'os' ? null : 'os')}>
          <RevaLogo size={16} /> REVA OS
        </button>
        <span className="menubar__item menubar__app" aria-live="polite">
          {focused ? apps[focused].title : 'Desktop'}
        </span>
        <button className="menubar__item menubar__hide-sm" onClick={run(() => d.open('settings'))}>
          Settings
        </button>
        <span className="menubar__spacer" />
        <button
          className="menubar__item"
          aria-label={sound ? 'Mute sound' : 'Unmute sound'}
          aria-pressed={!sound}
          onClick={() => {
            useSettings.getState().set({ sound: !sound });
            if (!sound) window.setTimeout(() => play('click'), 10);
          }}
        >
          {sound ? <Volume2 size={15} /> : <VolumeX size={15} />}
        </button>
        <button
          className="menubar__item"
          aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
          aria-expanded={menu === 'notifs'}
          onClick={() => {
            setMenu(menu === 'notifs' ? null : 'notifs');
            useUI.getState().markRead();
          }}
        >
          <Bell size={15} />
          {unread > 0 && <span className="menubar__badge">{unread}</span>}
        </button>
        <span className="menubar__clock">
          <span className="menubar__hide-sm">{date} · </span>
          {time}
        </span>
      </nav>

      {menu === 'os' && (
        <div className="dropdown" role="menu" style={{ top: 32, left: 6 }}>
          <button role="menuitem" onClick={run(() => d.open('about'))}>
            About Reva OS
          </button>
          <button role="menuitem" onClick={run(() => d.open('settings'))}>
            Settings… <kbd>⚙</kbd>
          </button>
          <hr />
          <button role="menuitem" onClick={run(() => d.minimizeAll())}>
            Show desktop
          </button>
          <button role="menuitem" onClick={run(() => d.closeAll())}>
            Close all windows
          </button>
          <hr />
          <button role="menuitem" onClick={run(() => useUI.getState().reboot())}>
            Restart…
          </button>
        </div>
      )}

      {menu === 'notifs' && (
        <div className="dropdown notif-centre scroll" role="dialog" aria-label="Notification centre" style={{ top: 32, right: 6 }}>
          <div className="dropdown__row">
            <b>Notifications</b>
            {history.length > 0 && (
              <button className="btn btn--ghost btn--sm" style={{ width: 'auto' }} onClick={() => useUI.getState().clearHistory()}>
                Clear
              </button>
            )}
          </div>
          {history.length === 0 && <p className="editor-note" style={{ padding: '6px 10px' }}>Nothing yet. The system is being patient.</p>}
          {history.map((t) => (
            <div key={t.id} className="notif-centre__item">
              <div style={{ fontWeight: 600 }}>{t.title}</div>
              {t.body && <div style={{ fontSize: 13, color: 'var(--ink-60)' }}>{t.body}</div>}
              <div className="notif-centre__time">{t.time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
