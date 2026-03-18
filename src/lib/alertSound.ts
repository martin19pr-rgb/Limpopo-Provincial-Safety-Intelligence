let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

export type AlertTone = 'critical' | 'high' | 'medium' | 'low' | 'dispatch' | 'resolved' | 'ai' | 'blockchain';

export function playAlertSound(tone: AlertTone = 'high') {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;

    const configs: Record<AlertTone, { freqs: number[]; duration: number; wave: OscillatorType; vol: number }> = {
      critical: { freqs: [880, 440, 880, 440], duration: 0.12, wave: 'sawtooth', vol: 0.35 },
      high:     { freqs: [660, 440, 660],       duration: 0.14, wave: 'square',   vol: 0.25 },
      medium:   { freqs: [520, 440],             duration: 0.18, wave: 'sine',     vol: 0.2  },
      low:      { freqs: [440],                  duration: 0.2,  wave: 'sine',     vol: 0.15 },
      dispatch: { freqs: [523, 659, 784],        duration: 0.15, wave: 'triangle', vol: 0.25 },
      resolved: { freqs: [523, 659, 784, 1047],  duration: 0.12, wave: 'sine',     vol: 0.18 },
      ai:       { freqs: [1047, 880, 1047, 1319],duration: 0.1,  wave: 'sine',     vol: 0.2  },
      blockchain:{ freqs: [659, 784, 659],        duration: 0.13, wave: 'triangle', vol: 0.18 },
    };

    const cfg = configs[tone];

    cfg.freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = cfg.wave;
      osc.frequency.setValueAtTime(freq, now + i * cfg.duration);
      gain.gain.setValueAtTime(0, now + i * cfg.duration);
      gain.gain.linearRampToValueAtTime(cfg.vol, now + i * cfg.duration + 0.01);
      gain.gain.linearRampToValueAtTime(0, now + i * cfg.duration + cfg.duration - 0.01);
      osc.start(now + i * cfg.duration);
      osc.stop(now + i * cfg.duration + cfg.duration);
    });
  } catch (_) {}
}

export function unlockAudio() {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();
  } catch (_) {}
}
