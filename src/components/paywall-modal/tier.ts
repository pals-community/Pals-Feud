import { UltraComponent } from "ultra-light-js";
import styles from './paywall-modal.module.css';
import { PAYWALL_CTX } from "@/context/paywall.context";

export const TIERS = [
    { icon: '🚀', name: 'Host Basic', old: '$29.99', price: '$19.99/mo', perks: ['✨ Permission to press Start', '⚡ Seamless button-pressing experience', '🌟 Elevated clicking'], popular: false },
    { icon: '💎', name: 'Host Pro', old: '$149.99', price: '$99.99/mo', perks: ['✨ Everything in Basic', '🔊 A louder, more robust buzzer', '🧠 Next-gen host synergy'], popular: true },
    { icon: '👑', name: 'Host Ultra', old: '$1,499', price: '$999/yr', perks: ['✨ Everything in Pro', '🎤 The right to say "Survey says!"', '🌌 Unlock the full potential of fun'], popular: false }
];

export function Tier(tier: typeof TIERS[number]) {
    return UltraComponent({
        component: '<article></article>',
        className: [styles.tier, tier.popular ? styles.popular : ''].filter(Boolean),
        children: [
            tier.popular ? UltraComponent({ component: '<span>MOST POPULAR</span>', className: [styles.badge] }) : null,
            UltraComponent({ component: `<span>${tier.icon}</span>`, className: [styles.icon] }),
            UltraComponent({ component: `<h3>${tier.name}</h3>`, className: [styles.tierName] }),
            UltraComponent({ component: `<s>${tier.old}</s>`, className: [styles.old] }),
            UltraComponent({ component: `<p>${tier.price}</p>`, className: [styles.price] }),
            UltraComponent({
                component: '<ul></ul>',
                className: [styles.perks],
                children: tier.perks.map(perk => UltraComponent({ component: `<li>${perk}</li>` }))
            }),
            UltraComponent({
                component: '<button type="button">Subscribe</button>',
                className: [styles.subscribe],
                eventHandler: { click: () => PAYWALL_CTX.upsell() }
            })
        ]
    });
}
