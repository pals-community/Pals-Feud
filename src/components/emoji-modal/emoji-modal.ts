import { UltraActivity, UltraComponent, ultraState } from "ultra-light-js";
import styles from './emoji-modal.module.css';
import { EMOJI_CTX } from "@/context/emoji.context";
import { GAME_CONTEXT } from "@/context/game.context";
import { EmojiModalHeader } from "./header";
import { EmojiModalStage } from "./stage";
import { EmojiModalRoster } from "./roster";

export function EmojiModal() {

    const [staged, setStaged, subStaged] = ultraState('');
    const [preview, setPreview, subPreview] = ultraState<string | null>(null);

    const close = () => EMOJI_CTX.isModalVisible.set(false);

    const applyStaged = () => {
        if (!staged()) return;
        GAME_CONTEXT.setTeamIcon(EMOJI_CTX.currentTeam.get(), staged());
        close();
    };

    const onOpen = () => {
        if (!EMOJI_CTX.isModalVisible.get()) return;
        setPreview(null);
        setStaged(GAME_CONTEXT.teams.get()[EMOJI_CTX.currentTeam.get()]?.icon ?? '');
        if (!EMOJI_CTX.isLoading.get() && !EMOJI_CTX.pool.get().length) {
            void EMOJI_CTX.load();
        }
    };

    const bindEscape = () => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') close();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    };

    return UltraActivity({

        component: '<div></div>',

        className: [styles.backdrop],

        mode: {
            state: EMOJI_CTX.isModalVisible.get,
            subscriber: EMOJI_CTX.isModalVisible.subscribe
        },

        type: 'display',

        onMount: [bindEscape],

        trigger: [{
            subscriber: EMOJI_CTX.isModalVisible.subscribe,
            triggerFunction: onOpen
        }],

        eventHandler: {
            click: (e: Event) => {
                if (e.target === e.currentTarget) close();
            }
        },

        children: [

            UltraComponent({

                component: '<section></section>',

                className: [styles.panel],

                attributes: {
                    role: 'dialog',
                    'aria-modal': 'true',
                    'aria-labelledby': 'emoji-modal-title'
                },

                children: [

                    EmojiModalHeader({ onClose: close }),

                    UltraComponent({

                        component: '<div></div>',

                        className: [styles.body],

                        children: [

                            EmojiModalStage({
                                staged,
                                subStaged,
                                preview,
                                subPreview,
                                onCommit: applyStaged
                            }),

                            EmojiModalRoster({
                                staged,
                                setStaged,
                                subStaged,
                                setPreview,
                                onCommit: applyStaged
                            })

                        ]
                    })

                ]

            })

        ]

    });

}
