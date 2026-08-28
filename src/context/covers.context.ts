import type { CoversManifest } from "@/types";
import { pickRandom } from "@/utils";
import { ultraCompState, type IUltraCompStateStateful } from "ultra-light-js";

export interface ICoversCTX {
    pool: IUltraCompStateStateful<string[]>;
    isLoading: IUltraCompStateStateful<boolean>;
    load: () => Promise<void>;
    pick: (count: number) => string[];
}

export const COVERS_CTX: ICoversCTX = ultraCompState({

    pool: [] as string[],

    isLoading: false,

    load: async (comp: ICoversCTX) => {
        comp.isLoading.set(true);
        try {
            const response = await fetch("/covers/manifest.json", { cache: "no-store" });
            if (!response.ok) {
                comp.pool.set([]);
                return;
            }
            const manifest = await response.json() as CoversManifest;
            comp.pool.set(Array.isArray(manifest.covers) ? manifest.covers : []);
        } finally {
            comp.isLoading.set(false);
        }
    },

    pick: (comp: ICoversCTX, count: number) => {
        return pickRandom(comp.pool.get(), count);
    }

})
