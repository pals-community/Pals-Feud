import { UltraComponent } from "ultra-light-js";
import styles from './visibility-button.module.css';
import { PRE_GAME_CTX } from "@/context/pre-game.context";

const EYE_ICON = `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M12,5C7,5,2.73,8.11,1,12.5,2.73,16.89,7,20,12,20s9.27-3.11,11-7.5C21.27,8.11,17,5,12,5Zm0,12.5A5,5,0,1,1,17,12.5,5,5,0,0,1,12,17.5Zm0-8A3,3,0,1,0,15,12.5,3,3,0,0,0,12,9.5Z"/>
</svg>`;

const EYE_OFF_ICON = `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M12,7a5,5,0,0,1,5,5,4.9,4.9,0,0,1-.36,1.85l2.92,2.92A11.6,11.6,0,0,0,23,12.5,11.86,11.86,0,0,0,12,5a11.6,11.6,0,0,0-4,.72L10.15,7.86A5,5,0,0,1,12,7Z"/>
    <path d="M2.71,3.29,1.29,4.71,4.5,7.93A11.83,11.83,0,0,0,1,12.5,11.86,11.86,0,0,0,12,20a11.6,11.6,0,0,0,5.14-1.19l3.15,3.15,1.42-1.42ZM12,17.5a5,5,0,0,1-5-5,4.9,4.9,0,0,1,.83-2.74l1.5,1.5A3,3,0,0,0,9,12.5,3,3,0,0,0,12,15.5a2.94,2.94,0,0,0,1.24-.28l1.5,1.5A4.9,4.9,0,0,1,12,17.5Z"/>
</svg>`;

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

export function VisibilityButton() {
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
