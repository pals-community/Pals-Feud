import { UltraComponent, type UltraTrigger } from "ultra-light-js"
import styles from './emoji-modal.module.css'

export function EmojiItem({
    emoji,
    isSelected,
    onSelectionChange,
    onStage,
    onPreview,
    onPreviewEnd
}: {
    emoji: string,
    isSelected: () => boolean,
    onSelectionChange: UltraTrigger['subscriber'],
    onStage: (emoji: string, confirm?: boolean) => void,
    onPreview: (emoji: string) => void,
    onPreviewEnd: () => void,
}) {

    const paint = ($cell: HTMLElement) => {
        const on = isSelected();
        $cell.classList.toggle(styles.selected, on);
        $cell.setAttribute('aria-pressed', String(on));
    };

    return UltraComponent({
        component: '<button type="button"></button>',
        className: [styles.cell],
        attributes: {
            'data-src': emoji,
            'aria-label': 'Choose team icon'
        },
        onMount: [paint],
        trigger: [{ subscriber: onSelectionChange, triggerFunction: paint }],
        eventHandler: {
            click: () => onStage(emoji),
            dblclick: () => onStage(emoji, true),
            mouseenter: () => onPreview(emoji),
            mouseleave: onPreviewEnd,
            focus: () => onPreview(emoji),
            blur: onPreviewEnd
        },
        children: [
            UltraComponent({
                component: '<img/>',
                attributes: {
                    src: emoji,
                    alt: '',
                    loading: 'lazy',
                    decoding: 'async',
                    draggable: 'false'
                }
            })
        ]
    })

}
