import { UltraComponent } from "ultra-light-js";
import styles from '@/pages/pre-game-screen.module.css'
import { COMIC_PALS_LOGO } from "@/data";

export function PreGameScreenAvatar({
    src = COMIC_PALS_LOGO,
    alt = 'The Comics Pals logo'
}:{
    src?: string,
    alt?: string
} = {}) {

    return UltraComponent({

        component: '<div></div>',

        className: [styles.avatarWrap],

        children: [

            UltraComponent({
                component: '<div></div>',
                className: [styles.avatarGlow]
            }),

            UltraComponent({
                component: '<div></div>',
                className: [styles.avatarFloat],
                children: [
                    UltraComponent({
                        component: '<img/>',
                        className: [styles.avatarImg],
                        attributes: {
                            src,
                            alt
                        }
                    })
                ]
            })
        ]

    })

}
