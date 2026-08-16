import { UltraComponent } from "ultra-light-js";
import styles from './team-panel.module.css';
import { GAME_CONTEXT } from "@/context/game.context";
import { animateNumber } from "@/utils/animate-number";
import { CONFIRM_CONTEXT } from "@/context/confirm.context";

export function TeamPanelScore({
    prevScore,
    setPrevScore,
    teamIndex
}:{
    prevScore: () => number;
    setPrevScore: (value: number) => void;
    teamIndex: 0 | 1;
}) {

    const updateScore = ($span: HTMLElement) => {
        const next = GAME_CONTEXT.teams.get()[teamIndex].score;
        animateNumber($span, prevScore(), next);
        setPrevScore(next);
    }

    const onBlur = (e: Event) => {
        const $span = e.currentTarget as HTMLElement;
        const newScore = Number($span.textContent);
        if (prevScore() === newScore) return;
        CONFIRM_CONTEXT.show({
            message: 'Are you sure?',
            cancelText: 'Cancel',
            onConfirm: () => {
                setPrevScore(newScore);
                GAME_CONTEXT.editPoints(teamIndex, newScore);
            },
            onCancel: () =>{
                $span.textContent = prevScore().toString();
            }
        })
    }

    return UltraComponent({
        component: '<span></span>',
        className: [styles.score],
        onMount: [updateScore],
        eventHandler: { blur: onBlur },
        attributes: {
            contenteditable: 'true',
            spellcheck: 'false'
        },
        trigger: [{
            subscriber: GAME_CONTEXT.teams.subscribe,
            triggerFunction: updateScore
        }]
    })
    
}