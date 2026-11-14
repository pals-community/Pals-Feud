import { UltraActivity, UltraComponent } from "ultra-light-js";
import styles from './paywall-modal.module.css';
import { PAYWALL_CTX } from "@/context/paywall.context";
import { KILLER_MOTH_CHIBI } from "@/data";
import { Message } from "./message";
import { Stamp } from "./stamp";
import { Tier, TIERS } from "./tier";

export function PaywallModal() {

    return UltraActivity({

        component: '<div></div>',

        className: [styles.backdrop],

        mode: {
            state: PAYWALL_CTX.open.get,
            subscriber: PAYWALL_CTX.open.subscribe
        },

        type: 'display',

        children: [

            UltraComponent({

                component: '<section></section>',

                className: [styles.panel],

                attributes: {
                    role: 'dialog',
                    'aria-modal': 'true',
                    'aria-labelledby': 'paywall-title'
                },

                children: [

                    Stamp({ 
                    	message: 'Human Made',
                    	submessage: '100% Organic · No Robots',
                        orientation: 'right'
                    }),

                    Stamp({
                    	message: 'No AI',
                    	submessage: '(maybe a little)',
                        orientation: 'left'
                    }),

                    UltraComponent({
                        component: `<img alt="" src="${KILLER_MOTH_CHIBI}">`,
                        className: [styles.avatar]
                    }),

                    UltraComponent({
                        component: '<h2 id="paywall-title">🚀 Unlock the Power of Hosting ✨</h2>',
                        className: [styles.title]
                    }),

                    UltraComponent({
                        component: '<p>This was clearly NOT done with AI*</p>',
                        className: [styles.subtitle]
                    }),

                    UltraComponent({
                        component: '<p>⏰ Limited offer ends in 04:59 (it never does)</p>',
                        className: [styles.countdown]
                    }),

                    UltraComponent({
                        component: '<div></div>',
                        className: [styles.tiers],
                        children: TIERS.map(Tier)
                    }),

                    Message(),

                    UltraComponent({
                        component: '<p>* 200-300 agents and 1M litres of water might have been used. Company not liable.</p>',
                        className: [styles.footnote]
                    }),

                    UltraComponent({
                        component: '<button type="button">continue without support</button>',
                        className: [styles.tiny],
                        eventHandler: { click: () => PAYWALL_CTX.proceed() }
                    })

                ]
            })
        ]

    });

}
