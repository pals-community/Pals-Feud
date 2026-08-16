import { UltraComponent } from "ultra-light-js";
import styles from './loader.module.css';

export function Loader() {
    return UltraComponent({
        component: '<div></div>',
        className: [styles.loader],
        children: [
            UltraComponent({
                component: '<div></div>',
                className: [styles.bar],
                children: [
                    UltraComponent({
                        component: '<div></div>',
                        className: [styles.fill]
                    })
                ]
            }),
            UltraComponent({
                component: '<p></p>',
                className: [styles.label],
                children: ['Loading...']
            })
        ]
    });
}
