/**
 * UI sound, synthesised with Web Audio so the site ships no audio files.
 * Everything is dry and short, in the spirit of the game's menus: a click
 * when the cursor moves, a brushed confirm, a lower back, and a swell
 * under the big word wipe. The context is created lazily on the first
 * user gesture (browsers refuse to start audio before one).
 */

let ctx: AudioContext | null = null
let master: GainNode | null = null
let enabled = false
let lastTick = 0

export function setSfxEnabled(on: boolean) {
  enabled = on
  if (!on && ctx && ctx.state === 'running') void ctx.suspend()
  if (on && ctx && ctx.state === 'suspended') void ctx.resume()
}

function graph(): { ctx: AudioContext; out: GainNode } | null {
  if (!enabled) return null
  if (typeof window === 'undefined') return null
  try {
    if (!ctx) {
      ctx = new AudioContext()
      master = ctx.createGain()
      master.gain.value = 0.55
      // a touch of glue so the clicks never spike
      const comp = ctx.createDynamicsCompressor()
      comp.threshold.value = -18
      comp.ratio.value = 4
      master.connect(comp).connect(ctx.destination)
    }
    if (ctx.state === 'suspended') void ctx.resume()
    return { ctx, out: master! }
  } catch {
    return null
  }
}

/* ── building blocks ─────────────────────────────────────────────────── */

function tone(
  g: { ctx: AudioContext; out: GainNode },
  { type = 'sine', from, to = from, at = 0, dur, gain, decay = dur }: { type?: OscillatorType; from: number; to?: number; at?: number; dur: number; gain: number; decay?: number },
) {
  const t0 = g.ctx.currentTime + at
  const osc = g.ctx.createOscillator()
  osc.type = type
  osc.frequency.setValueAtTime(from, t0)
  if (to !== from) osc.frequency.exponentialRampToValueAtTime(to, t0 + dur)
  const env = g.ctx.createGain()
  env.gain.setValueAtTime(0.0001, t0)
  env.gain.exponentialRampToValueAtTime(gain, t0 + 0.006)
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + decay)
  osc.connect(env).connect(g.out)
  osc.start(t0)
  osc.stop(t0 + decay + 0.02)
}

function noise(
  g: { ctx: AudioContext; out: GainNode },
  { at = 0, dur, gain, filter, from, to = from, q = 1, attack = 0.005 }: { at?: number; dur: number; gain: number; filter: BiquadFilterType; from: number; to?: number; q?: number; attack?: number },
) {
  const t0 = g.ctx.currentTime + at
  const len = Math.ceil(g.ctx.sampleRate * dur)
  const buf = g.ctx.createBuffer(1, len, g.ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
  const src = g.ctx.createBufferSource()
  src.buffer = buf
  const f = g.ctx.createBiquadFilter()
  f.type = filter
  f.Q.value = q
  f.frequency.setValueAtTime(from, t0)
  if (to !== from) f.frequency.exponentialRampToValueAtTime(to, t0 + dur)
  const env = g.ctx.createGain()
  env.gain.setValueAtTime(0.0001, t0)
  env.gain.exponentialRampToValueAtTime(gain, t0 + attack)
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  src.connect(f).connect(env).connect(g.out)
  src.start(t0)
  src.stop(t0 + dur + 0.02)
}

/* ── the vocabulary ──────────────────────────────────────────────────── */

export const sfx = {
  /** cursor moved: a 30 ms metallic click centred near 6.7 kHz */
  tick() {
    const now = performance.now()
    if (now - lastTick < 35) return
    lastTick = now
    const g = graph()
    if (!g) return
    noise(g, { dur: 0.03, gain: 0.5, filter: 'bandpass', from: 6700, q: 7, attack: 0.002 })
    tone(g, { from: 6700, dur: 0.03, gain: 0.16, decay: 0.028 })
    tone(g, { from: 3350, dur: 0.03, gain: 0.06, decay: 0.02 })
  },
  /** chosen: a brushed 150 ms burst that opens upward, with a faint ring */
  confirm() {
    const g = graph()
    if (!g) return
    noise(g, { dur: 0.15, gain: 0.42, filter: 'bandpass', from: 2400, to: 9000, q: 0.9, attack: 0.008 })
    noise(g, { dur: 0.05, gain: 0.3, filter: 'bandpass', from: 6700, q: 6, attack: 0.002 })
    tone(g, { from: 4200, dur: 0.2, gain: 0.07, decay: 0.22 })
    tone(g, { from: 6300, at: 0.03, dur: 0.16, gain: 0.05, decay: 0.18 })
  },
  /** stepped back: the same brush, closing downward and shorter */
  back() {
    const g = graph()
    if (!g) return
    noise(g, { dur: 0.12, gain: 0.36, filter: 'bandpass', from: 7000, to: 1800, q: 0.9, attack: 0.006 })
    tone(g, { from: 2600, dur: 0.14, gain: 0.07, decay: 0.16 })
  },
  /** a value flipped: the cursor click pitched a little lower */
  toggle() {
    const g = graph()
    if (!g) return
    noise(g, { dur: 0.035, gain: 0.45, filter: 'bandpass', from: 5200, q: 7, attack: 0.002 })
    tone(g, { from: 5200, dur: 0.035, gain: 0.14, decay: 0.03 })
  },
  /** the big word wipe: a low thud, then a brushed sweep that opens and closes */
  wipe() {
    const g = graph()
    if (!g) return
    tone(g, { from: 110, to: 55, dur: 0.35, gain: 0.45, decay: 0.45 })
    noise(g, { dur: 0.6, gain: 0.3, filter: 'bandpass', from: 300, to: 3600, q: 0.7, attack: 0.1 })
    noise(g, { at: 0.86, dur: 0.45, gain: 0.2, filter: 'bandpass', from: 3000, to: 360, q: 0.7, attack: 0.05 })
  },
  /** leaving the title screen: a rising swell */
  begin() {
    const g = graph()
    if (!g) return
    tone(g, { from: 220, dur: 0.6, gain: 0.2, decay: 0.9 })
    tone(g, { from: 330, at: 0.12, dur: 0.6, gain: 0.16, decay: 0.9 })
    tone(g, { from: 440, at: 0.24, dur: 0.6, gain: 0.14, decay: 1.0 })
    noise(g, { dur: 1.1, gain: 0.28, filter: 'bandpass', from: 180, to: 4200, q: 0.6, attack: 0.25 })
  },
}
