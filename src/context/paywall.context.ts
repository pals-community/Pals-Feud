import { ultraCompState, type IUltraCompStateStateful } from "ultra-light-js";

const SEEN_KEY = 'pf-paywall-seen';

export const PAYWALL_MESSAGES = [
    'Pick a plan to continue. Your host duties are valuable!',
    'Processing... Premium+ added to your cart. Welcome aboard!',
    'Upgrade failed. Enrolled you in Host Ultra Max Supreme instead ($4,999/week).',
    'Your free trial of "free trial" has expired. Please renew it.',
    'We have run out of tiers. Maybe look for something tiny in the corner...'
];

export interface IPaywallCTX {
    open: IUltraCompStateStateful<boolean>;
    clicks: IUltraCompStateStateful<number>;
    show: (onContinue: () => void) => void;
    upsell: () => void;
    proceed: () => void;
}

let pending: (() => void) | null = null;

function hasSeen() {
    try {
        return localStorage.getItem(SEEN_KEY) === '1';
    } catch {
        return false;
    }
}

function markSeen() {
    try {
        localStorage.setItem(SEEN_KEY, '1');
    } catch {}
}

export const PAYWALL_CTX: IPaywallCTX = ultraCompState({

    open: false,

    clicks: 0,

    show: (comp: IPaywallCTX, onContinue: () => void) => {
        if (hasSeen()) {
            onContinue();
            return;
        }
        markSeen();
        pending = onContinue;
        comp.clicks.set(0);
        comp.open.set(true);
    },

    upsell: (comp: IPaywallCTX) => {
        comp.clicks.set(Math.min(comp.clicks.get() + 1, PAYWALL_MESSAGES.length - 1));
    },

    proceed: (comp: IPaywallCTX) => {
        const next = pending;
        pending = null;
        comp.open.set(false);
        next?.();
    }

});
