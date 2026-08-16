import type { IFeudAnswer } from "@/types";
import { UltraComponent, ultraState } from "ultra-light-js";
import { GAME_CONTEXT } from "@/context/game.context";
import styles from './answer-card.module.css';

export function AnswerCard(
    answer: IFeudAnswer
) {

    const [isShown, setIsShown, subsIsShown] = ultraState(false);

    const syncRevealed = () => {
        if (GAME_CONTEXT.revealed.get().includes(answer.position)) {
            setIsShown(true);
        }
    }

    const updateFlip = ($card: HTMLElement) => {
        $card.classList.toggle(styles.flipped, isShown());
    }

    const onClick = () => {
        if (isShown()) return;
        GAME_CONTEXT.guess(answer.text)
    }

    return UltraComponent({

        component: '<article></article>',

        className: [styles.cardHolder],

        eventHandler: {
            click: onClick
        },

        onMount: [syncRevealed],

        trigger: [{
            subscriber: GAME_CONTEXT.revealed.subscribe,
            triggerFunction: syncRevealed
        }],

        children: [

            UltraComponent({

                component: '<div></div>',

                className: [styles.card],

                onMount: [updateFlip],

                trigger: [{
                    subscriber: subsIsShown,
                    triggerFunction: updateFlip
                }],

                children: [

                    UltraComponent({
                        component: '<div></div>',
                        className: [styles.front],
                        children: [`<span>${answer.position}</span>`]
                    }),

                    UltraComponent({
                        component: '<div></div>',
                        className: [styles.back],
                        children: [
                            `<span class="${styles.answerText}">${answer.text}</span>`,
                            `<span class="${styles.answerPoints}">${answer.points}</span>`
                        ]
                    })

                ]

            })

        ]

    })

}
