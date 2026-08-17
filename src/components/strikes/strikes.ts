import { UltraComponent } from "ultra-light-js";
import styles from './strikes.module.css';
import { StealStrikeMark, StrikeMark } from "./strike-mark";

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
