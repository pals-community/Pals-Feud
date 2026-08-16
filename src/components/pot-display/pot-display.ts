import { UltraComponent } from "ultra-light-js";
import { GAME_CONTEXT } from "@/context/game.context";
import { animateNumber } from "@/utils/animate-number";
import styles from './pot-display.module.css';

export function PotDisplay() {

    let previous = 0;

    const updatePot = ($span: HTMLElement) => {
        const next = GAME_CONTEXT.pot.get();
        animateNumber($span, previous, next);
        previous = next;
    }

    return UltraComponent({
        component: '<div></div>',
        className: [styles.pot],
        children: [
            UltraComponent({
                component: '<span>POT</span>',
                className: [styles.potLabel]
            }),
            UltraComponent({
                component: '<span></span>',
                className: [styles.potValue],
                onMount: [updatePot],
                trigger: [{
                    subscriber: GAME_CONTEXT.pot.subscribe,
                    triggerFunction: updatePot
                }]
            })
        ]
    })
}
