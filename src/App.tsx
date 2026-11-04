import { MotionConfig } from 'motion/react';
import { useEffect, useState } from 'react';
import { BootScreen } from './components/BootScreen';
import { Desktop } from './components/Desktop';
import { Dock } from './components/Dock';
import { MenuBar } from './components/MenuBar';
import { Lightbox, NotificationScheduler, Screensaver, Toasts, WanderingPufferfish } from './components/Overlays';
import { WindowLayer } from './components/WindowLayer';
import { useMediaQuery } from './lib/hooks';
import { useDesktop } from './store/desktopStore';
import { useSettings } from './store/settingsStore';
import { useUI } from './store/uiStore';

export default function App() {
  const [booted, setBooted] = useState(false);
  const bootKey = useUI((s) => s.bootKey);
  const motionPref = useSettings((s) => s.motion);
  const systemReduce = useMediaQuery('(prefers-reduced-motion: reduce)');
  const reduce = motionPref === 'reduced' || (motionPref === 'system' && systemReduce);

  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reduce);
  }, [reduce]);

  useEffect(() => {
    if (bootKey > 0) {
      useDesktop.getState().closeAll();
      setBooted(false);
    }
  }, [bootKey]);

  return (
    <MotionConfig reducedMotion={reduce ? 'always' : 'never'}>
      {!booted && <BootScreen key={bootKey} onDone={() => setBooted(true)} />}
      {booted && (
        <>
          <MenuBar />
          <Desktop />
          <WindowLayer />
          <Dock />
          <WanderingPufferfish />
          <Toasts />
          <Lightbox />
          <Screensaver />
          <NotificationScheduler />
        </>
      )}
    </MotionConfig>
  );
}
