import { UltraComponent, ultraState } from "ultra-light-js";
import styles from './ad-modal.module.css';
import { VIDEO_CTX } from "@/context/video.context";
import { VideoTile } from "./video-tile";

const CHEVRON_ICON = `
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="5 8 10 13 15 8"></polyline>
    </svg>
`;

export function AdHeader() {

    const [isOpen, setIsOpen, subscribeIsOpen] = ultraState(false);

    const toggleDropdown = () => setIsOpen(!isOpen());
    const closeDropdown = () => setIsOpen(false);

    const syncTitle = ($el: HTMLElement) => {
        const video = VIDEO_CTX.getCurrentVideo();
        $el.textContent = video
            ? video.title
            : 'Uploaded video';
    };

    const syncTrigger = ($button: HTMLElement) => {
        $button.setAttribute('aria-expanded', String(isOpen()));
    };

    const syncDropdown = ($div: HTMLElement) => {
        $div.classList.toggle(styles.open, isOpen());
    };

    const onVideoTilesChange = ($div: HTMLElement) => {
        const currVideoEntries = Object.values(VIDEO_CTX.videos.get())
            .sort((a, b) => b.uploadedAt - a.uploadedAt);

        if (currVideoEntries.length === 0) {
            $div.replaceChildren(
                UltraComponent({
                    component: '<p></p>',
                    className: [styles.videoListEmpty],
                    onMount: [($p: HTMLElement) => { $p.textContent = 'No ads uploaded yet'; }]
                })
            );
            return;
        }

        $div.replaceChildren(
            ...currVideoEntries.map(videoEntry => VideoTile({ videoEntry }))
        );
    };

    const onMenuMount = ($menu: HTMLElement) => {
        const onDocumentClick = (e: MouseEvent) => {
            if (!isOpen()) return;
            if ($menu.contains(e.target as Node)) return;
            closeDropdown();
        };
        document.addEventListener('click', onDocumentClick);
        return () => document.removeEventListener('click', onDocumentClick);
    };

    return UltraComponent({

        component: '<div></div>',

        className: [styles.heading],

        children: [

            UltraComponent({
                component: '<p>Sponsored break</p>',
                className: [styles.kicker],
            }),

            UltraComponent({

                component: '<div></div>',

                className: [styles.menu],

                onMount: [onMenuMount],

                children: [

                    UltraComponent({
                        component: '<button type="button"></button>',
                        className: [styles.titleButton],
                        attributes: {
                            id: 'ad-modal-title',
                            'aria-haspopup': 'listbox',
                            'aria-expanded': 'false'
                        },
                        eventHandler: { click: toggleDropdown },
                        trigger: [{
                            subscriber: subscribeIsOpen,
                            triggerFunction: syncTrigger
                        }],
                        children: [

                            UltraComponent({
                                component: '<span></span>',
                                className: [styles.titleText],
                                onMount: [syncTitle],
                                trigger: [{
                                    subscriber: [
                                        VIDEO_CTX.currentVideoId.subscribe,
                                        VIDEO_CTX.videos.subscribe
                                    ],
                                    triggerFunction: syncTitle
                                }]
                            }),

                            UltraComponent({
                                component: `<span>${CHEVRON_ICON}</span>`,
                                className: [styles.chevron],
                                attributes: { 'aria-hidden': 'true' }
                            })

                        ]
                    }),

                    UltraComponent({
                        component: '<div></div>',
                        className: [styles.videoListDropdown],
                        attributes: {
                            role: 'listbox',
                            'aria-label': 'Available ad videos'
                        },
                        onMount: [onVideoTilesChange, syncDropdown],
                        trigger: [
                            {
                                subscriber: VIDEO_CTX.videos.subscribe,
                                triggerFunction: onVideoTilesChange
                            },
                            {
                                subscriber: subscribeIsOpen,
                                triggerFunction: syncDropdown
                            },
                            {
                                subscriber: VIDEO_CTX.currentVideoId.subscribe,
                                triggerFunction: closeDropdown
                            }
                        ]
                    })

                ]

            })

        ]

    })

}
