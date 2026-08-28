import { UltraComponent } from "ultra-light-js";
import styles from './emoji-modal.module.css';
import { EMOJI_CTX } from "@/context/emoji.context";
import { GAME_CONTEXT } from "@/context/game.context";

/** The name plate under the pedestal. It shows a "PLAYER n" tag and the team name. */
export function EmojiModalPlate() {

    const syncTag = ($el: HTMLElement) => {
        $el.textContent = `Player ${EMOJI_CTX.currentTeam.get() + 1}`;
    };

    const syncName = ($el: HTMLElement) => {
        const team = GAME_CONTEXT.teams.get()[EMOJI_CTX.currentTeam.get()];
        $el.textContent = team?.name || 'Fighter';
    };

    return UltraComponent({
        component: '<div></div>',
        className: [styles.plate],
        children: [
            UltraComponent({
                component: '<span></span>',
                className: [styles.plateTag],
                onMount: [syncTag],
                trigger: [{
                    subscriber: EMOJI_CTX.currentTeam.subscribe,
                    triggerFunction: syncTag
                }]
            }),
            UltraComponent({
                component: '<span></span>',
                className: [styles.plateName],
                onMount: [syncName],
                trigger: [{
                    subscriber: [EMOJI_CTX.currentTeam.subscribe, GAME_CONTEXT.teams.subscribe],
                    triggerFunction: syncName
                }]
            })
        ]
    });
}
