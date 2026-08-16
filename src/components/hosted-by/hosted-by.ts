import { UltraComponent } from "ultra-light-js";
import styles from './hosted-by.module.css';
import { KILLER_MOTH_LEGO } from "@/data";

export function HostedBy() {

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
                                    src: KILLER_MOTH_LEGO,
                                    alt: "Killer Moth, host of Hayden's Hideout"
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
                        component: '<p>Hosted and Created by</p>',
                        className: [styles.hostedByLabel]
                    }),

                    UltraComponent({
                        component: "<p>Hayden's Hideout</p>",
                        className: [styles.hostedByName]
                    })
                ]

            })

        ]

    })

}
