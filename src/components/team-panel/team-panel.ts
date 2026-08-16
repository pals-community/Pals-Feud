import { UltraComponent, ultraState } from "ultra-light-js";
import { GAME_CONTEXT } from "@/context/game.context";
import styles from './team-panel.module.css';
import { TeamPanelScore } from "./score";
import { TeamPanelName } from "./name";
import { TeamPanelAnswerer } from "./answerer";

export function TeamPanel(teamIndex: 0 | 1) {

    const [prevScore, setPrevScore] = ultraState(0);

    const updateActive = ($el: HTMLElement) => {
        $el.classList.toggle(
            styles.active, 
            GAME_CONTEXT.activeTeam.get() === teamIndex
        );
    }

    return UltraComponent({
        
        component: '<div></div>',
        
        className: [styles.team],
        
        onMount: [updateActive],
        
        trigger: [{
            subscriber: GAME_CONTEXT.activeTeam.subscribe,
            triggerFunction: updateActive
        }],

        children: [

            TeamPanelName({
                teamIndex
            }),

            TeamPanelScore({
                teamIndex,
                prevScore,
                setPrevScore
            }),

            TeamPanelAnswerer({
                teamIndex
            })

        ]
    })
}
