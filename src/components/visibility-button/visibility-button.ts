import { UltraComponent } from "ultra-light-js";
import styles from './visibility-button.module.css';
import { PRE_GAME_CTX } from "@/context/pre-game.context";
import { EYE_ICON, EYE_OFF_ICON } from "@/icons";

export function VisibilityButton() {

    function iconFor(isVisible: boolean) {
        return isVisible ? EYE_ICON : EYE_OFF_ICON;
    }

    function labelFor(isVisible: boolean) {
        return isVisible ? 'Hide game screen' : 'Show game screen';
    }

    function syncButton(node: HTMLElement) {
        const isVisible = PRE_GAME_CTX.isVisible.get();
        node.innerHTML = iconFor(isVisible);
        node.setAttribute('aria-label', labelFor(isVisible));
        node.setAttribute('aria-pressed', String(!isVisible));
        node.classList.toggle(styles.isHidden, !isVisible);
    }

    return UltraComponent({
        component: `<button type="button">${iconFor(PRE_GAME_CTX.isVisible.get())}</button>`,
        className: [styles.visibilityButton],
        attributes: {
            'aria-label': labelFor(PRE_GAME_CTX.isVisible.get()),
            'aria-pressed': String(!PRE_GAME_CTX.isVisible.get())
        },
        eventHandler: {
            click: () => PRE_GAME_CTX.isVisible.set(!PRE_GAME_CTX.isVisible.get())
        },
        trigger: [{
            subscriber: PRE_GAME_CTX.isVisible.subscribe,
            triggerFunction: syncButton
        }]
    });

}
