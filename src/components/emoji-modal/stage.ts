import { UltraComponent, type UltraTrigger } from "ultra-light-js";
import styles from './emoji-modal.module.css';
import { EMOJI_CTX } from "@/context/emoji.context";
import { EmojiModalPedestal } from "./pedestal";
import { EmojiModalPlate } from "./plate";
import { EmojiModalLockButton } from "./lock-button";

type Subscribe = (fn: (value: unknown) => void) => () => void;

/** The left column of the modal. It holds the pedestal portrait, the name plate, and the lock-in button. */
export function EmojiModalStage({
    staged,
    subStaged,
    preview,
    subPreview,
    onCommit
}: {
    staged: () => string,
    subStaged: Subscribe,
    preview: () => string | null,
    subPreview: Subscribe,
    onCommit: () => void
}) {

    /** On the pedestal, a hover preview takes priority over the locked-in pick. */
    const displayed = () => preview() || staged();

    return UltraComponent({
        component: '<div></div>',
        className: [styles.stage],
        children: [
            EmojiModalPedestal({
                displayed,
                quiet: subPreview,
                slam: [subStaged, EMOJI_CTX.isModalVisible.subscribe] as UltraTrigger['subscriber']
            }),
            EmojiModalPlate(),
            EmojiModalLockButton({ staged, subscribe: subStaged, onLock: onCommit })
        ]
    });
}
