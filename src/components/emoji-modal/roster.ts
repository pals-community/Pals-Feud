import { UltraComponent, type UltraTrigger } from "ultra-light-js";
import styles from './emoji-modal.module.css';
import { EMOJI_CTX } from "@/context/emoji.context";
import { EmojiItem } from "./emoji-item";

/** A scrollable icon grid. It has arrow-key navigation and shows loading and empty states. */
export function EmojiModalRoster({
    staged,
    setStaged,
    subStaged,
    setPreview,
    onCommit
}: {
    staged: () => string,
    setStaged: (emoji: string) => void,
    subStaged: UltraTrigger['subscriber'],
    setPreview: (emoji: string | null) => void,
    onCommit: () => void
}) {

    /** Stage an icon. A double-click (confirm) also commits the icon and closes the modal. */
    const stage = (emoji: string, confirm = false) => {
        setStaged(emoji);
        if (confirm) onCommit();
    };

    const previewEnd = () => setPreview(null);

    const columnCount = ($grid: HTMLElement) => {
        const tracks = getComputedStyle($grid).gridTemplateColumns;
        if (!tracks || tracks === 'none' || tracks.includes('(')) return 1;
        return tracks.split(/\s+/).filter(Boolean).length || 1;
    };

    const onKey = (e: Event) => {
        const $grid = e.currentTarget as HTMLElement;
        const key = (e as KeyboardEvent).key;
        const step = key === 'ArrowRight' ? 1
            : key === 'ArrowLeft' ? -1
            : key === 'ArrowDown' ? columnCount($grid)
            : key === 'ArrowUp' ? -columnCount($grid)
            : 0;
        if (!step) return;
        const cells = [...$grid.children].filter(
            ($c): $c is HTMLElement => $c instanceof HTMLElement && $c.hasAttribute('data-src')
        );
        const current = cells.indexOf(document.activeElement as HTMLElement);
        const next = cells[Math.max(0, Math.min(cells.length - 1, current + step))];
        if (next) {
            e.preventDefault();
            next.focus();
        }
    };

    const message = (text: string) => UltraComponent({
        component: '<p></p>',
        className: [styles.status],
        children: [text]
    });

    const render = ($grid: HTMLElement) => {

        if (!EMOJI_CTX.isModalVisible.get()) return;

        if (EMOJI_CTX.isLoading.get()) {
            $grid.replaceChildren(message('Loading roster…'));
            return;
        }

        const pool = EMOJI_CTX.pool.get();
        if (!pool.length) {
            $grid.replaceChildren(message('No fighters available.'));
            return;
        }

        $grid.replaceChildren(
            ...pool.map(emoji => EmojiItem({
                emoji,
                isSelected: () => staged() === emoji,
                onSelectionChange: subStaged,
                onStage: stage,
                onPreview: setPreview,
                onPreviewEnd: previewEnd
            }))
        );
    };

    return UltraComponent({
        component: '<div></div>',
        className: [styles.roster],
        attributes: { 'aria-label': 'Icon roster' },
        eventHandler: { keydown: onKey },
        onMount: [render],
        trigger: [{
            subscriber: [
                EMOJI_CTX.isModalVisible.subscribe,
                EMOJI_CTX.pool.subscribe,
                EMOJI_CTX.isLoading.subscribe,
                EMOJI_CTX.currentTeam.subscribe
            ],
            triggerFunction: render
        }]
    });
}
