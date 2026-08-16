import { ultraCompState, ultraState } from "ultra-light-js";

export const ULTRA_COVERS_CTX = ultraCompState({
    isLoading: false
})

type CoversManifest = {
    covers: string[];
};

export function ultraCovers() {

    const [covers, setCovers, subsCovers] = ultraState<string[]>([]);

    async function getCovers() {
        ULTRA_COVERS_CTX.isLoading.set(true);
        try {
            const response = await fetch("/covers/manifest.json", { cache: "no-store" });
            if (!response.ok) {
                setCovers([]);
                return;
            }

            const manifest = await response.json() as CoversManifest;
            setCovers(Array.isArray(manifest.covers) ? manifest.covers : []);
        } finally {
            ULTRA_COVERS_CTX.isLoading.set(false);
        }
    }

    return {
        covers,
        subsCovers,
        getCovers
    }

}
