import { GAME_CONTEXT } from "@/context/game.context";
import { UltraComponent } from "ultra-light-js";
import styles from './team-panel.module.css';

export function TeamPanelIcon({
    teamIndex
}:{
    teamIndex: 0 | 1;
}) {

    const updateIcon = ($img: HTMLElement) => {
        ($img as HTMLImageElement).src = 
        GAME_CONTEXT.teams.get()[teamIndex].icon;
    }

    return UltraComponent({
        component: '<button type="button"></button>',
        className: [styles.iconButton],
        attributes: { 
            'aria-label': 'Shuffle team icon', 
            title: 'Shuffle team icon' 
        },
        eventHandler: {
            click: () => GAME_CONTEXT.cycleTeamIcon(teamIndex)
        },
        children: [
            UltraComponent({
                component: '<img/>',
                className: [styles.iconImg],
                attributes: { alt: 'Team icon' },
                onMount: [updateIcon],
                trigger: [{
                    subscriber: GAME_CONTEXT.teams.subscribe,
                    triggerFunction: updateIcon
                }]
            })
        ]
    })

}
