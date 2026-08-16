import { DEFAULTS, MIN_COVERS, MAX_COVERS, STORAGE_KEY } from "@/data";
import type { IPersistedSettings } from "@/types";
import { ultraCompState, type IUltraCompStateStateful } from "ultra-light-js";

export interface ISettingsCTX {
    musicVolume: IUltraCompStateStateful<number>;
    sfxVolume: IUltraCompStateStateful<number>;
    muted: IUltraCompStateStateful<boolean>;
    coverCount: IUltraCompStateStateful<number>;
    open: IUltraCompStateStateful<boolean>;
    persist: () => void;
    setMusicVolume: (value: number) => void;
    setSfxVolume: (value: number) => void;
    toggleMuted: () => void;
    setCoverCount: (value: number) => void;
    openSettings: () => void;
    closeSettings: () => void;
}

const persisted = (function (): IPersistedSettings{
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return DEFAULTS;
        return { ...DEFAULTS, ...JSON.parse(raw) };
    } catch {
        return DEFAULTS;
    }
})();

export const SETTINGS_CONTEXT: ISettingsCTX = ultraCompState({

    musicVolume: persisted.musicVolume,

    sfxVolume: persisted.sfxVolume,

    muted: persisted.muted,

    coverCount: persisted.coverCount,

    open: false,

    persist: (comp: ISettingsCTX) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                musicVolume: comp.musicVolume.get(),
                sfxVolume: comp.sfxVolume.get(),
                muted: comp.muted.get(),
                coverCount: comp.coverCount.get()
            }));
        } catch {}
    },

    setMusicVolume: (comp: ISettingsCTX, value: number) => {
        comp.musicVolume.set(Math.min(1, Math.max(0, value)));
        comp.persist();
    },

    setSfxVolume: (comp: ISettingsCTX, value: number) => {
        comp.sfxVolume.set(Math.min(1, Math.max(0, value)));
        comp.persist();
    },

    toggleMuted: (comp: ISettingsCTX) => {
        comp.muted.set(!comp.muted.get());
        comp.persist();
    },

    setCoverCount: (comp: ISettingsCTX, value: number) => {
        comp.coverCount.set(Math.min(MAX_COVERS, Math.max(MIN_COVERS, Math.round(value))));
        comp.persist();
    },

    openSettings: (comp: ISettingsCTX) => comp.open.set(true),

    closeSettings: (comp: ISettingsCTX) => comp.open.set(false)

});
