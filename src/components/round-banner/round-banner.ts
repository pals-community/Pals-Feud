import { UltraActivity, UltraComponent } from "ultra-light-js";
import { GAME_CONTEXT } from "@/context/game.context";
import styles from './round-banner.module.css';

export function RoundBanner() {

    const updateMessage = ($el: HTMLElement) => {
        const winner = GAME_CONTEXT.roundWinner.get();
        if (winner === null) return;
        const team = GAME_CONTEXT.teams.get()[winner];
        $el.textContent = `${team.name} wins the round! +${GAME_CONTEXT.pot.get()} points`;
    }

    return UltraActivity({
        component: '<section></section>',
        className: [styles.banner],
        mode: {
            state: () => GAME_CONTEXT.phase.get() === 'round-over',
            subscriber: GAME_CONTEXT.phase.subscribe
        },
        type: 'display',
        children: [
            UltraComponent({
                component: '<p></p>',
                className: [styles.message],
                onMount: [updateMessage],
                trigger: [{
                    subscriber: GAME_CONTEXT.roundWinner.subscribe,
                    triggerFunction: updateMessage,
                    defer: true
                }]
            }),
            UltraComponent({
                component: '<button>Next Round</button>',
                className: [styles.nextButton],
                eventHandler: {
                    click: () => GAME_CONTEXT.nextRound()
                }
            })
        ]
    })
    
}
