import { VIDEO_CTX } from "@/context/video.context";
import { UltraComponent } from "ultra-light-js";
import styles from './ad-modal.module.css';
import { SETTINGS_CONTEXT } from "@/context/settings.context";

let mutedBeforeAd: boolean | null = null;

const duckAudio = () => {
    if (mutedBeforeAd !== null) return;
    mutedBeforeAd = SETTINGS_CONTEXT.muted.get();
    SETTINGS_CONTEXT.muted.set(true);
};

const restoreAudio = () => {
    if (mutedBeforeAd === null) return;
    SETTINGS_CONTEXT.muted.set(mutedBeforeAd);
    mutedBeforeAd = null;
};

export function AdVideo() {

    const onVideoChange = ($el: HTMLElement) => {
        const $video = $el as HTMLVideoElement;
        const video = VIDEO_CTX.getCurrentVideo();
        if (!video) {
            $video.removeAttribute('src');
            $video.load();
        }else{
            if ($video.src !== video.url) {
                $video.src = video.url;
                $video.load();
            }
        }   
    };

    const onVisibleChange = ($el: HTMLElement) => {
        if (VIDEO_CTX.isVisible.get() === true) return;
        const $video = $el as HTMLVideoElement;
        $video.removeAttribute('src');
        $video.load();
        restoreAudio();
    }

    return UltraComponent({
        
        component: '<div></div>',
        
        className: [styles.player],
        
        children: [

            UltraComponent({
                
                component: '<video></video>',
                
                className: [styles.video],
                
                attributes: {
                    controls: 'true',
                    playsInline: 'true',
                    preload: 'metadata'
                },

                trigger: [
                    {
                        subscriber: [
                            VIDEO_CTX.currentVideoId.subscribe,
                            VIDEO_CTX.videos.subscribe
                        ],
                        triggerFunction: onVideoChange,
                        defer: true
                    },
                    {
                        subscriber: VIDEO_CTX.isVisible.subscribe,
                        triggerFunction: onVisibleChange,
                        defer: true
                    }
                ],

                eventHandler: {
                    play: duckAudio,
                    pause: restoreAudio
                }

            })
        ]

    })

}