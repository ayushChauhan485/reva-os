import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Fonts are bundled locally: no requests to third-party font services.
import '@fontsource-variable/dm-sans';
import '@fontsource-variable/fraunces/full.css';
import '@fontsource-variable/fraunces/full-italic.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import '@fontsource/caveat/500.css';
import '@fontsource/caveat/700.css';
import '@fontsource/silkscreen/400.css';
import './styles/base.css';
import './styles/os.css';
import './styles/apps.css';
import './styles/awards.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
