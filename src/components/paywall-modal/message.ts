import { UltraComponent } from "ultra-light-js";
import styles from './paywall-modal.module.css';
import { PAYWALL_CTX, PAYWALL_MESSAGES } from "@/context/paywall.context";

export function Message() {

    const syncMessage = (node: HTMLElement) => {
        node.textContent = PAYWALL_MESSAGES[PAYWALL_CTX.clicks.get()];
    };

    return UltraComponent({
        component: '<p role="status" aria-live="polite"></p>',
        className: [styles.message],
        trigger: [{
            subscriber: PAYWALL_CTX.clicks.subscribe,
            triggerFunction: syncMessage
        }],
        onMount: [syncMessage]
    });
}
