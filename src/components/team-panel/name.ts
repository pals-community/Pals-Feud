import { GAME_CONTEXT } from "@/context/game.context";
import { UltraComponent } from "ultra-light-js";
import styles from './team-panel.module.css';

export function TeamPanelName({
    teamIndex
}:{
    teamIndex: 0 | 1;
}) {
    
    const onNameBlur = (e: Event) => {
        GAME_CONTEXT.renameTeam(
            teamIndex,
            (e.currentTarget as HTMLElement).textContent ?? ''
        );
    }

    const updateName = ($span: HTMLElement) => {
        if (document.activeElement === $span) return;
        $span.textContent = GAME_CONTEXT.teams
        .get()[teamIndex].name;
    }

    return UltraComponent({
        component: '<span></span>',
        className: [styles.name],
        attributes: {
            contenteditable: 'true',
            spellcheck: 'false'
        },
        eventHandler: { blur: onNameBlur },
        onMount: [updateName],
        trigger: [{
            subscriber: GAME_CONTEXT.teams.subscribe,
            triggerFunction: updateName
        }]
    })

}