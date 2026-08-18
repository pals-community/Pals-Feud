import { UltraComponent } from "ultra-light-js";
import styles from './video-upload.module.css';
import { VIDEO_CTX } from "@/context/video.context";
import { CONFIRM_CONTEXT } from "@/context/confirm.context";

export function VideoUpload() {

    const onFileChange = (e: Event) => {

        const $input = e.target as HTMLInputElement;

        const file = $input.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('video/')) {
            CONFIRM_CONTEXT.show({
                title: 'Unsupported file',
                message: 'Choose a video file such as MP4, WebM, or MOV.',
                confirmText: 'Got it'
            });
            $input.value = '';
            return;
        }

        const videoId = VIDEO_CTX.addVideo(file);

        CONFIRM_CONTEXT.show({
            title: 'Video loaded',
            message: `"${file.name}" is ready. Preview it now?`,
            confirmText: 'Preview',
            cancelText: 'Later',
            onConfirm() {
                VIDEO_CTX.playVideo(videoId)
            }
        })

    };

    return UltraComponent({

        component: '<label></label>',

        children: [
            '<input type="file" accept="video/*" />',
            `<span class="${styles.text}">Upload Ads</span>`,
            UltraComponent({
                component: '<span>0</span>',
                className: [styles.counter],
                trigger: [{
                    subscriber: VIDEO_CTX.videos.subscribe,
                    triggerFunction: ($span: HTMLElement) => {
                        $span.textContent = Object.keys(
                            VIDEO_CTX.videos.get()
                        ).length.toString()
                    }
                }]
            })
        ],

        className: [styles.upload],

        attributes: {
            'aria-label': 'Upload video for ADs'
        },

        eventHandler: {
            change: onFileChange
        }

    });

}
