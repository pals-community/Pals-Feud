import type { IVideoEntry } from "@/types";
import { ultraCompState, type IUltraCompStateStateful } from "ultra-light-js";

export interface IVideoCTX {
    currentVideoId: IUltraCompStateStateful<string>;
    videos: IUltraCompStateStateful<Record<string, IVideoEntry>>;
    isVisible: IUltraCompStateStateful<boolean>;
    addVideo: (file: File) => string;
    getVideo: (id: string) => string;
    getCurrentVideo: () => IVideoEntry | null;
    playVideo: (id: string) => void;
    closeVideo: () => void;
    removeVideo: (id: string) => void;
}

export const VIDEO_CTX: IVideoCTX = ultraCompState({

    currentVideoId: '',
    
    videos: {} as Record<string, IVideoEntry>,

    isVisible: false,

    getVideo: (
        comp: IVideoCTX,
        id: string
    ) =>{
        return comp.videos.get()[id]?.url ?? ''
    },

    getCurrentVideo: (comp: IVideoCTX) => {
        const videoId = comp.currentVideoId.get();
        return videoId ? (comp.videos.get()[videoId] ?? null) : null;
    },

    addVideo: (
        comp: IVideoCTX,
        file: File
    ) => {
        const id = globalThis.crypto?.randomUUID?.() ?? `video-${Date.now()}-${Math.random().toString(16).slice(2)}`;
        const title = file.name.replace(/\.[^.]+$/, '') || file.name;
        const url = URL.createObjectURL(file);
        comp.videos.set({
            ...comp.videos.get(),
            [id]: {
                id,
                title,
                url,
                fileName: file.name,
                uploadedAt: Date.now()
            }
        });
        return id;
    },

    playVideo: (
        comp: IVideoCTX,
        id: string
    ) => {
        if (!comp.videos.get()[id]) return;
        comp.currentVideoId.set(id);
        comp.isVisible.set(true);
    },

    closeVideo: (comp: IVideoCTX) => {
        comp.isVisible.set(false);
    },

    removeVideo: (comp: IVideoCTX, id: string) => {
        const videos = comp.videos.get();
        const video = videos[id];
        if (!video) return;
        URL.revokeObjectURL(video.url);
        const nextVideos = { ...videos };
        delete nextVideos[id];
        comp.videos.set(nextVideos);
        if (comp.currentVideoId.get() === id) {
            comp.currentVideoId.set('');
            comp.isVisible.set(false);
        }
    }
    
})
