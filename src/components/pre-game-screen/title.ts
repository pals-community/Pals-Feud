import { UltraComponent } from "ultra-light-js";
import styles from '@/pages/pre-game-screen.module.css'
import { APP_NAME } from "@/data";

export function PreGameScreenTitle() {

    return UltraComponent({

        component: '<div></div>',

        className: [styles.heroText],

        children: [

            UltraComponent({
                component: '<p>Welcome to</p>',
                className: [styles.eyebrow]
            }),

            UltraComponent({
                component: `<h1>${APP_NAME}</h1>`,
                className: [styles.title]
            })

        ]

    })

}
