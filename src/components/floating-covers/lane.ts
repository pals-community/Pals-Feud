import { UltraComponent, type UltraLightElement } from "ultra-light-js";
import styles from './floating-covers.module.css';
import { randomBetween } from "@/utils";

export function Lane({
    src,
    index
}:{
    src: string, index: number
}) {
    
    const direction = index % 2 === 0 ? 'ltr' : 'rtl';
    const duration = randomBetween(26, 58);
    const delay = -randomBetween(0, duration);
    const top = randomBetween(-4, 92);
    const rotation = randomBetween(-9, 9);
    const bobDuration = randomBetween(4, 8);
    const bobDelay = -randomBetween(0, bobDuration);

    const laneStyle = [
        `top:${top}%`,
        `--duration:${duration}s`,
        `--delay:${delay}s`
    ].join(';');

    const coverStyle = [
        `--rot:${rotation}deg`,
        `--bob-duration:${bobDuration}s`,
        `--bob-delay:${bobDelay}s`
    ].join(';');

    const onMount = ($el: HTMLElement) => {
        const $img = $el as HTMLImageElement & UltraLightElement;
        const $wrap = $img.parentElement;
        const reveal = () => $wrap?.classList.add(styles.loaded);
        $img.onload = reveal;
        $img.onerror = () => {
            $img._cleanup?.();
            $img.remove();
        };
        $img.src = src;
        if ($img.complete && $img.naturalWidth > 0) reveal();
    };

    return UltraComponent({
        component: '<div></div>',
        className: [styles.lane, direction === 'ltr' ? styles.driftLtr : styles.driftRtl],
        attributes: { style: laneStyle },
        children: [
            UltraComponent({
                component: '<div></div>',
                className: [styles.coverWrap],
                children: [
                    UltraComponent({
                        component: '<img/>',
                        className: [styles.cover],
                        onMount: [onMount],
                        attributes: {
                            alt: '',
                            style: coverStyle,
                            loading: 'eager',
                            decoding: 'async'
                        }
                    })
                ]
            })
        ]
    });

}
