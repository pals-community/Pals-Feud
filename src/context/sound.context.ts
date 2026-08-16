import { SETTINGS_CONTEXT } from "@/context/settings.context";
import { ultraCompState, type IUltraCompStateStateful } from "ultra-light-js";

export interface ISoundCTX {
    audioCtx: IUltraCompStateStateful<AudioContext|null>;
    correctAnswerAudio: IUltraCompStateStateful<HTMLAudioElement|null>;
    getAudioContext: () => AudioContext;
    playTone: (freq: number, startOffset: number, duration: number, type?: OscillatorType, peakGain?: number) => void;
    playCorrect: () => void;
    playWrong: () => void;
    playSteal: () => void;
    playRoundWin: () => void;
}

export const SOUND_CTX: ISoundCTX = ultraCompState({

    audioCtx: null as AudioContext | null,
    correctAnswerAudio: null as HTMLAudioElement | null,

    getAudioContext: (comp: ISoundCTX) => {
        if (!comp.audioCtx.get()) comp.audioCtx.set(new AudioContext());
        const ctx = comp.audioCtx.get()!;
        if (ctx.state === 'suspended') ctx.resume();
        return ctx;
    },

    playTone: (
        comp: ISoundCTX,
        freq: number,
        startOffset: number,
        duration: number,
        type: OscillatorType = 'sine',
        peakGain = 0.2
    ) => {
        if (SETTINGS_CONTEXT.muted.get()) return;
        const effectiveGain = peakGain * SETTINGS_CONTEXT.sfxVolume.get();
        if (effectiveGain <= 0) return;

        const ctx = comp.getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.value = freq;

        const startTime = ctx.currentTime + startOffset;
        const endTime = startTime + duration;

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(effectiveGain, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, endTime);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(endTime);
    },

    playCorrect: (comp: ISoundCTX) => {
        if (SETTINGS_CONTEXT.muted.get()) return;
        const volume = SETTINGS_CONTEXT.sfxVolume.get();
        if (volume <= 0) return;

        if (!comp.correctAnswerAudio.get()) comp.correctAnswerAudio.set(new Audio('/audio/correct-answer.mp3'));
        const audio = comp.correctAnswerAudio.get()!;
        audio.volume = volume;
        audio.currentTime = 0;
        audio.play();
    },

    playWrong: (comp: ISoundCTX) => {
        comp.playTone(160, 0, 0.35, 'sawtooth', 0.25);
        comp.playTone(120, 0.1, 0.4, 'sawtooth', 0.25);
    },

    playSteal: (comp: ISoundCTX) => {
        comp.playTone(440, 0, 0.15, 'square', 0.15);
        comp.playTone(330, 0.15, 0.25, 'square', 0.15);
    },

    playRoundWin: (comp: ISoundCTX) => {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
            comp.playTone(freq, i * 0.12, 0.2, 'triangle');
        });
    }

})
