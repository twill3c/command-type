import type { KeyValueStore } from "@/core/highscore";

/**
 * 効果音(F-13)。Web Audio の合成音のみで外部アセットを持たない。
 * すべて try/catch ガード付きで、未対応環境・サーバでは無音の no-op になる。
 */

const MUTE_KEY = "command-type:muted";

export function isMuted(store: KeyValueStore): boolean {
  return store.get(MUTE_KEY) === "1";
}

export function setMuted(store: KeyValueStore, muted: boolean): void {
  store.set(MUTE_KEY, muted ? "1" : "0");
}

let ctx: AudioContext | null = null;

function ensureCtx(): AudioContext | null {
  try {
    if (!ctx) ctx = new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

/** 単音: freqStart → freqEnd へ滑らかに変化する減衰音。 */
function blip(
  freqStart: number,
  freqEnd: number,
  durS: number,
  type: OscillatorType,
  gain: number,
  delayS = 0,
): void {
  const ac = ensureCtx();
  if (!ac) return;
  try {
    const t0 = ac.currentTime + delayS;
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, t0);
    osc.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 1), t0 + durS);
    g.gain.setValueAtTime(gain, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + durS);
    osc.connect(g).connect(ac.destination);
    osc.start(t0);
    osc.stop(t0 + durS);
  } catch {
    /* no-op */
  }
}

/** クリア音: 上昇 2 音。コンボが乗るほどわずかに高くなる。 */
export function playClear(combo: number): void {
  const base = 520 + Math.min(combo, 10) * 24;
  blip(base, base * 1.25, 0.09, "triangle", 0.16);
  blip(base * 1.5, base * 1.9, 0.12, "triangle", 0.14, 0.07);
}

/** 不一致 Enter: 短い低音ブザー。 */
export function playMissEnter(): void {
  blip(180, 140, 0.12, "square", 0.1);
}

/** 落下(ライフ減): 下降音。 */
export function playDrop(): void {
  blip(340, 90, 0.35, "sawtooth", 0.14);
}
