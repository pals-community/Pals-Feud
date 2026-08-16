import { currentAnswerer, GAME_CONTEXT } from "@/context/game.context";
import { UltraComponent } from "ultra-light-js";
import styles from './team-panel.module.css';
import { TEAM_EDITOR_CTX } from "@/context/team-editor.context";

export function TeamPanelAnswerer({
    teamIndex
}:{
    teamIndex: 0|1
}) {

    const updateAnswerer = ($span: HTMLElement) => {
        const name = currentAnswerer(teamIndex);
        $span.textContent = name ? `Up: ${name}` : 'No player';
    }

    const onClick = () => {
        TEAM_EDITOR_CTX.teamIndex.set(teamIndex);
        TEAM_EDITOR_CTX.isVisible.set(true);
    }

    return UltraComponent({
        component: '<span></span>',
        eventHandler: {
            click: onClick
        },
        className: [styles.answerer],
        onMount: [updateAnswerer],
        trigger: [{
            subscriber: [
                GAME_CONTEXT.teams.subscribe,
                GAME_CONTEXT.answererIndex.subscribe
            ],
            triggerFunction: updateAnswerer
        }]
    })
    
}
