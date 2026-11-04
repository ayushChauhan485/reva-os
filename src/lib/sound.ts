// Tiny Web Audio synth. Every sound is generated here, so there are no audio
// files to license or download. Nothing plays until the first user gesture
// (the boot screen's start button calls unlockAudio()).
import { useSettings } from '../store/settingsStore';

export type SoundName =
  | 'click'
  | 'open'
  | 'close'
  | 'minimize'
  | 'notify'
  | 'startup'
  | 'drumroll'
  | 'applause'
  | 'fanfare'
  | 'unlock'
  | 'complete'
  | 'error'
  | 'pop'
  | 'paper'
  | 'type'
  | 'ambient';

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noiseBuf: AudioBuffer | null = null;

export function unlockAudio() {
  try {
    if (!ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new AC();
      master = ctx.createGain();
      master.connect(ctx.destination);
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === 'suspended') void ctx.resume();
  } catch {
    ctx = null;
  }
}

interface ToneOpts {
  type?: OscillatorType;
  gain?: number;
  at?: number;
  attack?: number;
  slideTo?: number;
}

function tone(freq: number, dur: number, o: ToneOpts = {}) {
  if (!ctx || !master) return;
  const t = ctx.currentTime + (o.at ?? 0);
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = o.type ?? 'sine';
  osc.frequency.setValueAtTime(freq, t);
  if (o.slideTo) osc.frequency.exponentialRampToValueAtTime(o.slideTo, t + dur);
  const peak = o.gain ?? 0.2;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + (o.attack ?? 0.008));
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(master);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

function noise(dur: number, o: { at?: number; gain?: number; freq?: number; q?: number; type?: BiquadFilterType } = {}) {
  if (!ctx || !master || !noiseBuf) return;
  const t = ctx.currentTime + (o.at ?? 0);
  const src = ctx.createBufferSource();
  src.buffer = noiseBuf;
  const f = ctx.createBiquadFilter();
  f.type = o.type ?? 'bandpass';
  f.frequency.value = o.freq ?? 1200;
  f.Q.value = o.q ?? 0.8;
  const g = ctx.createGain();
  g.gain.setValueAtTime(o.gain ?? 0.2, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f).connect(g).connect(master);
  src.start(t, Math.random());
  src.stop(t + dur + 0.05);
}

const recipes: Record<SoundName, () => void> = {
  click: () => tone(1800, 0.03, { type: 'square', gain: 0.04 }),
  // a very soft, slow chord for the screensaver
  ambient: () => [196, 246.9, 293.7].forEach((f, i) => tone(f, 4.5, { type: 'sine', gain: 0.025, at: i * 0.3, attack: 1.2 })),
  type: () => tone(2400 + Math.random() * 400, 0.015, { type: 'square', gain: 0.015 }),
  open: () => {
    tone(523, 0.09, { type: 'triangle', gain: 0.12 });
    tone(784, 0.12, { type: 'triangle', gain: 0.1, at: 0.06 });
  },
  close: () => {
    tone(659, 0.08, { type: 'triangle', gain: 0.1 });
    tone(440, 0.12, { type: 'triangle', gain: 0.08, at: 0.05 });
  },
  minimize: () => tone(700, 0.16, { type: 'sine', gain: 0.08, slideTo: 300 }),
  notify: () => {
    tone(988, 0.25, { type: 'sine', gain: 0.1 });
    tone(1319, 0.35, { type: 'sine', gain: 0.08, at: 0.09 });
  },
  pop: () => {
    tone(220, 0.12, { type: 'sine', gain: 0.2, slideTo: 880 });
    tone(1200, 0.05, { type: 'triangle', gain: 0.05, at: 0.1 });
  },
  paper: () => noise(0.25, { freq: 3500, q: 0.5, gain: 0.12 }),
  error: () => {
    tone(200, 0.12, { type: 'square', gain: 0.06 });
    tone(150, 0.18, { type: 'square', gain: 0.06, at: 0.12 });
  },
  startup: () => {
    // a warm major-seventh bloom
    [261.6, 329.6, 392, 493.9, 523.2].forEach((f, i) => tone(f, 1.6 - i * 0.12, { type: 'triangle', gain: 0.09, at: i * 0.11, attack: 0.04 }));
    tone(130.8, 1.8, { type: 'sine', gain: 0.12, attack: 0.1 });
  },
  unlock: () => {
    [659, 784, 988, 1319, 1568].forEach((f, i) => tone(f, 0.4, { type: 'sine', gain: 0.07, at: i * 0.07 }));
  },
  complete: () => {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.5, { type: 'triangle', gain: 0.08, at: i * 0.09 }));
  },
  drumroll: () => {
    // ~1.6s of tightening snare taps, then a cymbal
    for (let i = 0; i < 40; i++) {
      const at = i * 0.04;
      noise(0.05, { at, freq: 1800, q: 1.2, gain: 0.05 + (i / 40) * 0.12 });
    }
    noise(1.2, { at: 1.62, freq: 7000, q: 0.4, gain: 0.16, type: 'highpass' });
    tone(110, 0.3, { at: 1.6, type: 'sine', gain: 0.25, slideTo: 60 });
  },
  applause: () => {
    for (let i = 0; i < 70; i++) {
      noise(0.04 + Math.random() * 0.04, { at: Math.random() * 2.2, freq: 1500 + Math.random() * 2500, q: 1.5, gain: 0.04 + Math.random() * 0.05 });
    }
    noise(2.4, { freq: 2200, q: 0.3, gain: 0.04 });
  },
  fanfare: () => {
    const seq: [number, number, number][] = [
      [392, 0, 0.16],
      [392, 0.18, 0.1],
      [523, 0.3, 0.5],
      [659, 0.84, 0.16],
      [784, 1.02, 0.9],
    ];
    seq.forEach(([f, at, d]) => {
      tone(f, d, { type: 'sawtooth', gain: 0.05, at, attack: 0.02 });
      tone(f * 1.5, d, { type: 'triangle', gain: 0.04, at, attack: 0.02 });
    });
    tone(196, 1.9, { type: 'triangle', gain: 0.08, at: 0.3, attack: 0.05 });
  },
};

export function play(name: SoundName) {
  const { sound, volume } = useSettings.getState();
  if (!sound || !ctx || !master) return;
  if (ctx.state === 'suspended') void ctx.resume();
  master.gain.value = volume;
  try {
    recipes[name]();
  } catch {
    /* never let audio break the UI */
  }
}
