import { UltraComponent } from "ultra-light-js";
import { TeamPanel } from "@/components/team-panel/team-panel";
import { PotDisplay } from "@/components/pot-display/pot-display";
import styles from './scoreboard.module.css';

export function Scoreboard() {
    return UltraComponent({
        component: '<header></header>',
        className: [styles.scoreboard],
        children: [
            TeamPanel(0),
            PotDisplay(),
            TeamPanel(1)
        ]
    })
}
