/**
 * Audio and Speech Synthesis & Recognition utilities
 */

// Web Audio API context for pleasant sound effects without external files
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSound(type: 'correct' | 'wrong' | 'celebration' | 'click' | 'pop') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'correct') {
      // Pleasant high double chime
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);
        gain.gain.setValueAtTime(0, now + idx * 0.09);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.09 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.35);
      });
    } else if (type === 'wrong') {
      // Soft gentle bonk
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(180, now + 0.2);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'celebration') {
      // Major triad arpeggio
      const notes = [440, 554.37, 659.25, 880, 1108.73];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.22, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.45);
      });
    } else if (type === 'pop') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    }
  } catch {
    // Ignore audio errors gracefully
  }
}

let cachedFrenchVoice: SpeechSynthesisVoice | null = null;
let cachedArabicVoice: SpeechSynthesisVoice | null = null;

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve([]);
      return;
    }
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }
    window.speechSynthesis.onvoiceschanged = () => {
      resolve(window.speechSynthesis.getVoices());
    };
    // fallback timeout
    setTimeout(() => {
      resolve(window.speechSynthesis.getVoices());
    }, 500);
  });
}

export async function getFrenchVoice(): Promise<SpeechSynthesisVoice | null> {
  if (cachedFrenchVoice) return cachedFrenchVoice;
  const voices = await loadVoices();
  // Prefer fr-FR then fr-CA then any starting with fr
  const frFR = voices.find(v => v.lang.startsWith('fr-FR') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Amélie') || v.name.includes('Thomas')));
  const frAny = frFR || voices.find(v => v.lang.startsWith('fr-FR')) || voices.find(v => v.lang.startsWith('fr'));
  cachedFrenchVoice = frAny || null;
  return cachedFrenchVoice;
}

export async function getArabicVoice(): Promise<SpeechSynthesisVoice | null> {
  if (cachedArabicVoice) return cachedArabicVoice;
  const voices = await loadVoices();
  const ar = voices.find(v => v.lang.startsWith('ar'));
  cachedArabicVoice = ar || null;
  return cachedArabicVoice;
}

export function cleanFrenchForSpeech(text: string): string {
  // If text contains slashes (e.g. "affiche / annonce"), we can speak both with a pause
  return text.replace(/\//g, ' ou ');
}

export async function speakFrench(text: string, speed: 'normal' | 'slow' = 'normal'): Promise<void> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();

  const cleaned = cleanFrenchForSpeech(text);
  const utterance = new SpeechSynthesisUtterance(cleaned);
  utterance.lang = 'fr-FR';
  utterance.rate = speed === 'slow' ? 0.65 : 0.95;
  utterance.pitch = 1.05; // Slightly friendlier pitch for young students

  const voice = await getFrenchVoice();
  if (voice) {
    utterance.voice = voice;
  }

  return new Promise((resolve) => {
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
}

export async function speakArabic(text: string): Promise<void> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ar-SA';
  utterance.rate = 0.9;

  const voice = await getArabicVoice();
  if (voice) {
    utterance.voice = voice;
  }

  return new Promise((resolve) => {
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
}

export async function speakSyllables(syllables: string[]): Promise<void> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  const voice = await getFrenchVoice();
  
  for (const syll of syllables) {
    if (syll === '—') continue;
    await new Promise<void>((resolve) => {
      const utterance = new SpeechSynthesisUtterance(syll);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.65;
      utterance.pitch = 1.1;
      if (voice) utterance.voice = voice;
      utterance.onend = () => setTimeout(resolve, 280);
      utterance.onerror = () => resolve();
      window.speechSynthesis.speak(utterance);
    });
  }
}

// Speech recognition support check
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}

// Normalized text comparison helper (strips accents, punctuation, lowercases)
export function normalizeFrench(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

export function calculateSimilarity(input: string, target: string): number {
  const normInput = normalizeFrench(input);
  const normTarget = normalizeFrench(target);

  if (normInput === normTarget) return 1.0;
  if (!normInput || !normTarget) return 0.0;

  // Check if target is included in input or vice versa (e.g. if target is "affiche" and input is "une affiche")
  if (normInput.includes(normTarget) || normTarget.includes(normInput)) {
    return 0.85;
  }

  // Levenshtein distance
  const m = normInput.length;
  const n = normTarget.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (normInput[i - 1] === normTarget[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  const distance = dp[m][n];
  const maxLength = Math.max(m, n);
  return Math.max(0, 1 - distance / maxLength);
}
