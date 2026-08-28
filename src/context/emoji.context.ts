import type { EmojiManifest } from "@/types";
import { pickRandom } from "@/utils";
import { ultraCompState, type IUltraCompStateStateful } from "ultra-light-js";

export interface IEmojiCTX {
    pool: IUltraCompStateStateful<string[]>;
    isLoading: IUltraCompStateStateful<boolean>;
    isModalVisible: IUltraCompStateStateful<boolean>;
    currentTeam: IUltraCompStateStateful<0|1>;
    load: () => Promise<void>;
    pick: (exclude?: string[]) => string;
}

export const EMOJI_CTX: IEmojiCTX = ultraCompState({

    pool: [] as string[],

    isLoading: false,

    isModalVisible: false,

    currentTeam: 0 as 0|1,

    load: async (
        comp: IEmojiCTX
    ) => {
        comp.isLoading.set(true);
        try {
            const response = await fetch("/emojis/manifest.json", { cache: "no-store" });
            if (!response.ok) {
                comp.pool.set([]);
                return;
            }
            const manifest = await response.json() as EmojiManifest;
            comp.pool.set(Array.isArray(manifest.emojis) ? manifest.emojis : []);
        } finally {
            comp.isLoading.set(false);
        }
    },

    pick: (
        comp: IEmojiCTX, 
        exclude: string[] = []
    ) => {
        const pool = comp.pool.get();
        if (!pool.length) return '';
        const available = pool.filter(src => !exclude.includes(src));
        const [picked] = pickRandom(available.length ? available : pool, 1);
        return picked ?? '';
    }

})
