export type PhoneShellSound = "unlock" | "lock" | "tap" | "tick";

const UI_GAIN = 0.32;

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;
  if (!audioContext) audioContext = new Ctor();
  return audioContext;
}

export function resumePhoneShellAudio(): void {
  const ctx = getAudioContext();
  if (ctx?.state === "suspended") {
    void ctx.resume();
  }
}

function tone(
  frequency: number,
  durationMs: number,
  volume: number,
  type: OscillatorType = "sine",
  when = 0
) {
  const ctx = getAudioContext();
  if (!ctx || volume <= 0) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const t0 = ctx.currentTime + when;
  const t1 = t0 + durationMs / 1000;

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, t0);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(
    Math.max(0.0002, volume * UI_GAIN),
    t0 + 0.012
  );
  gain.gain.exponentialRampToValueAtTime(0.0001, t1);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t0);
  osc.stop(t1 + 0.02);
}

function noiseClick(volume: number, when = 0) {
  const ctx = getAudioContext();
  if (!ctx || volume <= 0) return;

  const bufferSize = Math.floor(ctx.sampleRate * 0.04);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }

  const source = ctx.createBufferSource();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  const t0 = ctx.currentTime + when;

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(900, t0);

  source.buffer = buffer;
  gain.gain.setValueAtTime(volume * UI_GAIN * 0.45, t0);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.045);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start(t0);
  source.stop(t0 + 0.05);
}

export function playPhoneShellSound(
  sound: PhoneShellSound,
  level: number,
  muted: boolean
): void {
  if (muted || level <= 0) return;
  resumePhoneShellAudio();
  const vol = Math.min(1, Math.max(0, level));

  switch (sound) {
    case "tap":
      noiseClick(vol * 0.7);
      tone(1180, 28, vol * 0.35, "sine");
      break;
    case "tick":
      tone(920, 22, vol * 0.55, "triangle");
      break;
    case "unlock":
      tone(523.25, 55, vol, "sine", 0);
      tone(783.99, 70, vol * 0.95, "sine", 0.055);
      break;
    case "lock":
      noiseClick(vol * 0.85);
      tone(320, 75, vol * 0.8, "sine");
      break;
    default:
      break;
  }
}