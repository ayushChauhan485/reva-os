import { AnimatePresence } from 'motion/react';
import { lazy, Suspense, type ComponentType } from 'react';
import type { AppId } from '../data/apps';
import { useDesktop } from '../store/desktopStore';
import { Window } from './Window';

// Each app is its own chunk, loaded the first time it opens.
const registry: Record<AppId, ComponentType> = {
  archive: lazy(() => import('../applications/Archive/Archive')),
  photos: lazy(() => import('../applications/Photos/Photos')),
  flowers: lazy(() => import('../applications/Flowers/Flowers')),
  dictionary: lazy(() => import('../applications/RevaDictionary/Dictionary')),
  calendar: lazy(() => import('../applications/Calendar/Calendar')),
  awards: lazy(() => import('../applications/Awards/Awards')),
  terminal: lazy(() => import('../applications/Terminal/Terminal')),
  classified: lazy(() => import('../applications/SecretFolder/SecretFolder')),
  settings: lazy(() => import('../applications/Settings/Settings')),
  lostfound: lazy(() => import('../applications/LostAndFound/FindGame')),
  about: lazy(() => import('../applications/About/About')),
};

const variants: Partial<Record<AppId, string>> = { photos: 'photos', awards: 'awards', terminal: 'terminal', classified: 'classified' };

export function WindowLayer() {
  const windows = useDesktop((s) => s.windows);
  const focused = useDesktop((s) => s.focused);
  return (
    <div className="win-layer">
      <AnimatePresence>
        {Object.values(windows).map((w) => {
          if (!w) return null;
          const App = registry[w.id];
          return (
            <Window key={`${w.id}-${w.session}`} win={w} focused={focused === w.id} variant={variants[w.id]}>
              <Suspense fallback={<div className="app-loading">loading {w.id}…</div>}>
                <App />
              </Suspense>
            </Window>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
