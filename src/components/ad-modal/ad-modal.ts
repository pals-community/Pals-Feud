import { UltraActivity, UltraComponent } from "ultra-light-js";
import styles from './ad-modal.module.css';
import { VIDEO_CTX } from "@/context/video.context";
import { AdVideo } from "./video";
import { AdHeader } from "./header";

export function AdModal() {

    const onEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') VIDEO_CTX.closeVideo();
    };

    const onMount = () => {
        document.addEventListener('keydown', onEscape);
        return () => document.removeEventListener('keydown', onEscape);
    }

    return UltraActivity({
        
        component: '<div></div>',
        
        className: [styles.backdrop],
        
        mode: {
            state: VIDEO_CTX.isVisible.get,
            subscriber: VIDEO_CTX.isVisible.subscribe
        },
        
        type: 'display',
        
        onMount: [onMount],

        children: [

            UltraComponent({
                
                component: '<section></section>',
                
                className: [styles.videoWrapper],
                
                attributes: {
                    role: 'dialog',
                    'aria-modal': 'true',
                    'aria-labelledby': 'ad-modal-title'
                },
                
                children: [
                    
                    UltraComponent({
                        
                        component: '<header></header>',
                        
                        className: [styles.videoFrame],
                        
                        children: [

                            AdHeader(),

                            UltraComponent({
                                component: '<button type="button">X</button>',
                                className: [styles.close],
                                attributes: { 'aria-label': 'Close video preview' },
                                eventHandler: { click: () => VIDEO_CTX.closeVideo() }
                            })

                        ]

                    }),

                    AdVideo()
                    
                ]
            })
        ],

        eventHandler: {
            click: (e: Event) => {
                if (e.target === e.currentTarget) VIDEO_CTX.closeVideo();
            }
        }

    });
    
}
