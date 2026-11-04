import { apps, dockOrder } from '../data/apps';
import { play } from '../lib/sound';
import { useDesktop } from '../store/desktopStore';
import { AppIcon } from './AppIcon';

export function Dock() {
  const windows = useDesktop((s) => s.windows);
  return (
    <nav className="dock" aria-label="Dock">
      {dockOrder.map((id, i) => {
        const w = windows[id];
        const live = id === 'awards' && w && !w.minimized;
        return (
          <span key={id} style={{ display: 'contents' }}>
            {i === dockOrder.length - 1 && <span className="dock__sep" aria-hidden="true" />}
            <button
              className="dock__btn"
              aria-label={`${apps[id].title}${w ? (w.minimized ? ' (minimised)' : ' (open)') : ''}`}
              onClick={() => {
                play('click');
                useDesktop.getState().dockClick(id);
              }}
            >
              <AppIcon id={id} />
              <span className="dock__tip">{apps[id].file}</span>
              {w && <span className={`dock__dot ${w.minimized ? 'dock__dot--min' : ''}`} />}
              {live && <span className="dock__live">LIVE</span>}
            </button>
          </span>
        );
      })}
    </nav>
  );
}
