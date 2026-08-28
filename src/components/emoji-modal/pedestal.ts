import { UltraComponent, type UltraTrigger } from "ultra-light-js";
import styles from './emoji-modal.module.css';

export function EmojiModalPedestal({
    displayed,
    quiet,
    slam
}: {
    /** The emoji URL to show on the pedestal. An empty string clears it. */
    displayed: () => string,
    /** Subscribers that repaint the portrait without the slam animation. */
    quiet: UltraTrigger['subscriber'],
    /** Subscribers that repaint the portrait and replay the slam animation. */
    slam: UltraTrigger['subscriber']
}) {

    const paint = (
        $portrait: HTMLImageElement,
        replay: boolean
    ) => {
        const emoji = displayed();
        if (emoji) {
            $portrait.src = emoji;
            $portrait.style.visibility = '';
        } else {
            $portrait.removeAttribute('src');
            $portrait.style.visibility = 'hidden';
        }
        if (replay) {
            $portrait.classList.remove(styles.slam);
            void $portrait.offsetWidth;
            $portrait.classList.add(styles.slam);
        }
    };

    return UltraComponent({
        component: '<div></div>',
        className: [styles.pedestal],
        children: [
            UltraComponent({
                component: '<span>?</span>',
                className: [styles.portraitEmpty]
            }),
            UltraComponent({
                component: '<img/>',
                className: [styles.portrait],
                attributes: {
                    alt: '',
                    draggable: 'false',
                    decoding: 'async'
                },
                onMount: [($el) => paint($el as HTMLImageElement, false)],
                trigger: [
                    {
                        subscriber: quiet,
                        triggerFunction: ($el) => paint($el as HTMLImageElement, false)
                    },
                    {
                        subscriber: slam,
                        triggerFunction: ($el) => paint($el as HTMLImageElement, true)
                    }
                ]
            })
        ]
    })
}
