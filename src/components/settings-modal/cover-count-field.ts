import { UltraComponent, type IUltraCompStateStateful } from "ultra-light-js";
import styles from './settings-modal.module.css';
import { MAX_COVERS, MIN_COVERS } from "@/data";

export function CoverCountField({
    labelText,
    count,
    setCount
}:{
    labelText: string, 
    count: IUltraCompStateStateful<number>, 
    setCount: (value: number) => void
}) {

    const sync = ($input: HTMLElement) => {
        ($input as HTMLInputElement).value = String(count.get());
    };

    const syncLabel = ($span: HTMLElement) => {
        $span.textContent = `${labelText} (${count.get()})`;
    };

    return UltraComponent({
        component: '<label></label>',
        className: [styles.field],
        children: [
            UltraComponent({
                component: `<span>${labelText} (${count.get()})</span>`,
                className: [styles.fieldLabel],
                trigger: [{ subscriber: count.subscribe, triggerFunction: syncLabel }]
            }),
            UltraComponent({
                component: `<input/>`,
                attributes: {
                    type: 'range',
                    min: MIN_COVERS.toString(),
                    max: MAX_COVERS.toString(),
                    step: '1'
                },
                className: [styles.slider],
                onMount: [sync],
                trigger: [{ subscriber: count.subscribe, triggerFunction: sync }],
                eventHandler: {
                    input: (e: Event) => setCount(Number((e.currentTarget as HTMLInputElement).value))
                }
            })
        ]
    });
    
}