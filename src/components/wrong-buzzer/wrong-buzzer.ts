import { UltraComponent } from "ultra-light-js";
import { GAME_CONTEXT } from "@/context/game.context";
import { createChromaKeyPainter, type ChromaKeyHandle } from "@/utils/chroma-key";
import styles from './wrong-buzzer.module.css';
import { WRONG_BUZZER_VIDEO } from "@/data";
import { SETTINGS_CONTEXT } from "@/context/settings.context";

export function WrongBuzzer() {

    let painter: ChromaKeyHandle | null = null;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    const FALLBACK_HIDE_MS = 3000;
    
    const fire = ($el: HTMLElement) => {
        const $video = $el.querySelector('video') as HTMLVideoElement;
        const $canvas = $el.querySelector('canvas') as HTMLCanvasElement;
        if (!painter) painter = createChromaKeyPainter($video, $canvas);
        const hide = () => {
            painter?.stop();
            $el.classList.remove(styles.show);
        };
        if (hideTimer) clearTimeout(hideTimer);
        $el.classList.remove(styles.show);
        void $el.offsetWidth;
        $el.classList.add(styles.show);
        $video.currentTime = 0;
        $video.onended = hide;
        void $video.play().catch(() => {});
        painter.start();
        hideTimer = setTimeout(hide, FALLBACK_HIDE_MS);
    };

    const onSfxVolumeChange = ($video: HTMLElement) => {
        ($video as HTMLVideoElement).volume = 
        SETTINGS_CONTEXT.sfxVolume.get();
    }

    return UltraComponent({

        cleanup: [() => {
            if (hideTimer) clearTimeout(hideTimer);
            painter?.stop();
        }],

        component: '<div></div>',

        className: [styles.overlay],

        children: [
            
            UltraComponent({
                component: '<video></video>',
                className: [styles.source],
                onMount: [onSfxVolumeChange],
                attributes: {
                    src: WRONG_BUZZER_VIDEO,
                    playsinline: '',
                    preload: 'auto',
                },
                trigger: [{
                    subscriber: SETTINGS_CONTEXT.sfxVolume.subscribe,
                    triggerFunction: onSfxVolumeChange
                }]
            }),
            
            `<canvas class="${styles.canvas}"></canvas>`

        ],

        trigger: [{
            subscriber: GAME_CONTEXT.missCount.subscribe,
            triggerFunction: fire,
            defer: true
        }]

    });

}
