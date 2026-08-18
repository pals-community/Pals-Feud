import { VIDEO_CTX } from "@/context/video.context";
import { UltraComponent } from "ultra-light-js";
import styles from './ad-modal.module.css';

export function AdVideo() {

    const onVideoChange = ($el: HTMLElement) => {

        const $video = $el as HTMLVideoElement;
        const video = VIDEO_CTX.getCurrentVideo();

        if (!video) {
            $video.removeAttribute('src');
            $video.load();
            return;
        }

        if ($video.src !== video.url) {
            $video.src = video.url;
            $video.load();
        }
        
    };

    const onVisibleChange = ($el: HTMLElement) => {
        if (VIDEO_CTX.isVisible.get() === true) return;
        const $video = $el as HTMLVideoElement;
        $video.removeAttribute('src');
        $video.load();
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
                        triggerFunction: onVideoChange
                    },
                    {
                        subscriber: VIDEO_CTX.isVisible.subscribe,
                        triggerFunction: onVisibleChange
                    }
                ]
            })
        ]

    })

}