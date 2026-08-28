import { UltraComponent, type UltraTrigger } from "ultra-light-js";
import styles from './emoji-modal.module.css';

/** The "Lock in" button. It is disabled while nothing is staged. */
export function EmojiModalLockButton({
    staged,
    subscribe,
    onLock
}: {
    staged: () => string,
    subscribe: UltraTrigger['subscriber'],
    onLock: () => void
}) {

    const sync = ($el: HTMLElement) => {
        ($el as HTMLButtonElement).disabled = !staged();
    };

    return UltraComponent({
        component: '<button type="button">Lock in</button>',
        className: [styles.lockButton],
        onMount: [sync],
        trigger: [{ subscriber: subscribe, triggerFunction: sync }],
        eventHandler: { click: onLock }
    });
}
