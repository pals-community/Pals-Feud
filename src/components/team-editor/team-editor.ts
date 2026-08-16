import { TEAM_EDITOR_CTX } from "@/context/team-editor.context";
import { GAME_CONTEXT } from "@/context/game.context";
import { UltraActivity, UltraComponent } from "ultra-light-js";
import styles from './team-editor.module.css';
import { TeamEditorMember } from "./member";

export function TeamEditor(){
    
    let draft = '';
    
    const teamIndex = () => TEAM_EDITOR_CTX.teamIndex.get();

    const close = () => TEAM_EDITOR_CTX.isVisible.set(false);

    const onEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') close();
    };

    const syncTitle = ($h: HTMLElement) => {
        $h.textContent = GAME_CONTEXT.teams.get()[teamIndex()].name;
    };

    const addDraft = () => {
        if (!draft.trim()) return;
        GAME_CONTEXT.addMember(teamIndex(), draft);
        draft = '';
    };

    const renderMembers = (
        $list: HTMLElement
    ) => {

        const ti = teamIndex();
        
        const members = GAME_CONTEXT.teams.get()[ti].members;
        
        const activeIndex = (members.length === 0) ? -1
        : GAME_CONTEXT.answererIndex.get()[ti] % members.length;

        if (members.length === 0) {
            $list.replaceChildren(UltraComponent({
                component: '<li>No players yet</li>',
                className: [styles.empty]
            }));
            return;
        }

        $list.replaceChildren(
            ...members.map((name, memberIndex) => {
                return TeamEditorMember({
                    memberIndex,
                    activeIndex,
                    name
                })
            })
        )

    };

    return UltraActivity({

        component: '<div></div>',

        className: [styles.backdrop],

        mode: {
            state: () => TEAM_EDITOR_CTX.isVisible.get(),
            subscriber: TEAM_EDITOR_CTX.isVisible.subscribe
        },

        eventHandler: {
            click: (e: Event) => {
                if (e.target === e.currentTarget) close();
            }
        },

        onMount: [() => {
            document.addEventListener('keydown', onEscape);
            return () => document.removeEventListener('keydown', onEscape);
        }],

        children: [

            UltraComponent({
                
                component: '<div></div>',
                
                className: [styles.panel],
                
                children: [

                    UltraComponent({
                        component: '<div></div>',
                        className: [styles.header],
                        children: [
                            UltraComponent({
                                component: '<h2></h2>',
                                className: [styles.title],
                                onMount: [syncTitle],
                                trigger: [
                                    { subscriber: GAME_CONTEXT.teams.subscribe, triggerFunction: syncTitle },
                                    { subscriber: TEAM_EDITOR_CTX.teamIndex.subscribe, triggerFunction: syncTitle }
                                ]
                            }),
                            UltraComponent({
                                component: '<button type="button">&times;</button>',
                                className: [styles.close],
                                attributes: { 'aria-label': 'Close team editor' },
                                eventHandler: { click: close }
                            })
                        ]
                    }),

                    UltraComponent({
                        component: '<ul></ul>',
                        className: [styles.members],
                        onMount: [renderMembers],
                        trigger: [
                            { subscriber: GAME_CONTEXT.teams.subscribe, triggerFunction: renderMembers },
                            { subscriber: GAME_CONTEXT.answererIndex.subscribe, triggerFunction: renderMembers },
                            { subscriber: TEAM_EDITOR_CTX.teamIndex.subscribe, triggerFunction: renderMembers }
                        ]
                    }),

                    UltraComponent({
                        component: '<div></div>',
                        className: [styles.addRow],
                        children: [
                            UltraComponent({
                                component: '<input/>',
                                className: [styles.addInput],
                                attributes: { placeholder: 'Add player name' },
                                eventHandler: {
                                    input: (e: Event) =>
                                        draft = (e.currentTarget as HTMLInputElement).value,
                                    keydown: (e: Event) => {
                                        const kEvent = e as KeyboardEvent;
                                        if (kEvent.key === 'Enter') {
                                            addDraft();
                                            (kEvent.currentTarget as HTMLInputElement).value = '';
                                        }
                                    }
                                }
                            }),
                            UltraComponent({
                                component: '<button type="button">Add</button>',
                                className: [styles.addButton],
                                eventHandler: {
                                    click: (e: Event) => {
                                        addDraft();
                                        const $input = (e.currentTarget as HTMLElement).previousElementSibling as HTMLInputElement;
                                        $input.value = '';
                                    }
                                }
                            })
                        ]
                    })

                ]
            })

        ]

    })

}
