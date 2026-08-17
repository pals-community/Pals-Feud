import { UltraComponent, type IUltraCompStateStateful } from "ultra-light-js";
import styles from './settings-modal.module.css';

export function VolumeField({
    labelText,
    volume,
    setVolume
}:{
    labelText: string,
    volume: IUltraCompStateStateful<number>,
    setVolume: (value: number) => void
}) {

    const sync = ($input: HTMLElement) => {
        ($input as HTMLInputElement).value = String(Math.round(volume.get() * 100));
    };

    const onInput = (e: Event) => {
        setVolume(Number((e.currentTarget as HTMLInputElement).value) / 100)
    }

    return UltraComponent({
        component: '<label></label>',
        className: [styles.field],
        children: [
            UltraComponent({ component: `<span>${labelText}</span>`, className: [styles.fieldLabel] }),
            UltraComponent({
                component: '<input type="range" min="0" max="100" step="1"/>',
                className: [styles.slider],
                onMount: [sync],
                trigger: [{ subscriber: volume.subscribe, triggerFunction: sync }],
                eventHandler: {
                    input: onInput
                }
            })
        ]
    });

}