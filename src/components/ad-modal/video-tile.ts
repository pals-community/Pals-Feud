import { VIDEO_CTX } from "@/context/video.context"
import type { IVideoEntry } from "@/types"
import { UltraComponent } from "ultra-light-js"
import styles from './ad-modal.module.css';
import { REMOVE_ICON } from "@/icons";

export function VideoTile({
    videoEntry
}:{
    videoEntry: IVideoEntry
}){

    const isSelected = () => VIDEO_CTX.currentVideoId.get() === videoEntry.id;

    const syncSelected = ($tile: HTMLElement) => {
        const selected = isSelected();
        $tile.classList.toggle(styles.videoTileActive, selected);
        $tile.setAttribute('aria-selected', String(selected));
    };

    const selectVideo = () => VIDEO_CTX.currentVideoId.set(videoEntry.id);

    const removeThisVideo = (e: Event) => {
        e.stopPropagation();
        VIDEO_CTX.removeVideo(videoEntry.id);
    };

    return UltraComponent({

        component: '<div></div>',

        className: [styles.videoTile],

        attributes: {
            role: 'option',
            tabindex: '0',
            'aria-selected': 'false'
        },

        onMount: [syncSelected],

        trigger: [{
            subscriber: VIDEO_CTX.currentVideoId.subscribe,
            triggerFunction: syncSelected
        }],

        children: [

            UltraComponent({
                component: '<span></span>',
                className: [styles.videoTileTitle],
                onMount: [($title: HTMLElement) => { $title.textContent = videoEntry.title; }]
            }),

            UltraComponent({
                component: `<button type="button">${REMOVE_ICON}</button>`,
                className: [styles.videoTileRemove],
                attributes: { 'aria-label': `Remove ${videoEntry.title}` },
                eventHandler: { click: removeThisVideo }
            })

        ],

        eventHandler: {
            click: selectVideo,
            keydown: (e: Event) => {
                const ke = e as KeyboardEvent;
                if (ke.target !== ke.currentTarget) return;
                if (ke.key !== 'Enter' && ke.key !== ' ') return;
                ke.preventDefault();
                selectVideo();
            }
        }

    })

}
