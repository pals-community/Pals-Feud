import { UltraActivity, UltraComponent } from "ultra-light-js";
import { GAME_CONTEXT } from "@/context/game.context";
import styles from './strikes.module.css';

const X_MARK = `
    <svg class="${styles.xmark}" viewBox="0 0 472 623" xmlns="http://www.w3.org/2000/svg">
        <path d="M285.58,310.67,419.87,570.81H314.27L233,412.17,151.73,570.81H47L180,310.67,44.82,44.52H150l83,162.4,82.57-162.4H421.18Z" transform="translate(3.5 3.5)"/>
        <path d="M0,0V616H465V0ZM435,586H30V30H435Z" transform="translate(3.5 3.5)"/>
    </svg>
`;

function StealStrikeMark() {

    const update = (e: Event) => {
        const $el = e?.currentTarget as HTMLElement;
        $el.classList.toggle(styles.hit,true);
        GAME_CONTEXT.guess(new Date().toDateString());
    }

    return UltraActivity({
        mode: {
            subscriber: GAME_CONTEXT.strikes.subscribe,
            state: () => GAME_CONTEXT.strikes.get() === 3
        },
        component: '<span></span>',
        className: [styles.mark],
        children: [X_MARK],
        eventHandler: { 
            click: update
        }
    })

}

function StrikeMark(
    index: number
) {

    const update = ($el: HTMLElement) => {
        $el.classList.toggle(
            styles.hit, 
            GAME_CONTEXT.strikes.get() > index
        );
    }

    const onClick = () => {
        GAME_CONTEXT.guess(new Date().toDateString())
    }

    return UltraComponent({
        component: '<span></span>',
        className: [styles.mark],
        children: [X_MARK],
        onMount: [update],
        eventHandler: { click: onClick },
        trigger: [{
            subscriber: GAME_CONTEXT.strikes.subscribe,
            triggerFunction: update
        }]
    })

}

export function Strikes() {
    return UltraComponent({
        component: '<div></div>',
        className: [styles.strikes],
        children: [
            StrikeMark(0), 
            StrikeMark(1), 
            StrikeMark(2),
            StealStrikeMark()
        ]
    })
}
