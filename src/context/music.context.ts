import { SETTINGS_CONTEXT } from "@/context/settings.context";
import { FAMILY_FEUD_MUSIC } from "@/data";
import { ultraCompState, type IUltraCompStateStateful } from "ultra-light-js";

export interface IMusicCTX {
    audioEl: IUltraCompStateStateful<HTMLAudioElement|null>;
    primed: IUltraCompStateStateful<boolean>;
    getMusicElement: () => HTMLAudioElement;
    applyVolume: () => void;
    primeBackgroundMusic: () => void;
    arm: () => void;
}

export const MUSIC_CTX: IMusicCTX = ultraCompState({

    audioEl: null as HTMLAudioElement | null,

    primed: false,

    getMusicElement: (comp: IMusicCTX) => {
        if (!comp.audioEl.get()) {
            const el = new Audio(FAMILY_FEUD_MUSIC);
            el.loop = true;
            comp.audioEl.set(el);
            comp.applyVolume();
        }
        return comp.audioEl.get()!;
    },

    applyVolume: (comp: IMusicCTX) => {
        const el = comp.audioEl.get();
        if (!el) return;
        el.volume = SETTINGS_CONTEXT.muted.get() ? 0 : SETTINGS_CONTEXT.musicVolume.get();
    },

    primeBackgroundMusic: (comp: IMusicCTX) => {
        if (comp.primed.get()) return;
        const $el = comp.getMusicElement();
        $el.play()
        .then(() => comp.primed.set(true))
        .catch(() => {});
    },

    arm: (comp: IMusicCTX) => {
        const start = () => {
            comp.primeBackgroundMusic();
            if (comp.primed.get()) {
                document.removeEventListener('pointerdown', start);
                document.removeEventListener('keydown', start);
            }
        };
        document.addEventListener('pointerdown', start);
        document.addEventListener('keydown', start);
    }

})

SETTINGS_CONTEXT.musicVolume.subscribe(() => MUSIC_CTX.applyVolume());
SETTINGS_CONTEXT.muted.subscribe(() => MUSIC_CTX.applyVolume());
