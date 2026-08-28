import { UltraComponent } from "ultra-light-js";
import styles from './emoji-modal.module.css';

export function EmojiModalHeader({
    onClose
}: {
    onClose: () => void
}) {
    return UltraComponent({
        component: '<header></header>',
        className: [styles.banner],
        children: [
            UltraComponent({
                component: '<h2 id="emoji-modal-title">Select your fighter</h2>',
                className: [styles.bannerText]
            }),
            UltraComponent({
                component: '<button type="button">&times;</button>',
                className: [styles.close],
                attributes: { 'aria-label': 'Close icon picker' },
                eventHandler: { click: onClose }
            })
        ]
    })
}
