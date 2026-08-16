import { UltraComponent } from "ultra-light-js";
import styles from './dev-by.module.css';
import { AMIN_AVATAR } from "@/data";

export function DevBy() {

    return UltraComponent({

        component: '<div></div>',

        className: [styles.hostedBy],

        children: [

            UltraComponent({

                component: '<div></div>',

                className: [styles.hostAvatarFrame],

                children: [

                    UltraComponent({

                        component: '<div></div>',

                        className: [styles.hostAvatarRing],

                        children: [

                            UltraComponent({
                                component: '<img/>',
                                className: [styles.hostAvatar],
                                attributes: {
                                    src: AMIN_AVATAR,
                                    alt: "Amin Almighty Pérez, the Wizard"
                                }
                            })

                        ]

                    })

                ]

            }),

            UltraComponent({

                component: '<div></div>',

                className: [styles.hostedByCopy],

                children: [

                    UltraComponent({
                        component: '<p>Developed by</p>',
                        className: [styles.hostedByLabel]
                    }),

                    UltraComponent({
                        component: "<p>Amín Pérez</p>",
                        className: [styles.hostedByName]
                    })
                ]

            })

        ]

    })

}
