import { UltraComponent } from "ultra-light-js";
import { GAME_CONTEXT } from "@/context/game.context";
import styles from './team-setup.module.css';
import { CONFIRM_CONTEXT } from "@/context/confirm.context";
import { EMOJI_CTX } from "@/context/emoji.context";

export function TeamSetup(teamIndex: 0 | 1) {

    let draft = '';

    const updateName = ($span: HTMLElement) => {
        if (document.activeElement === $span) return;
        $span.textContent = GAME_CONTEXT.teams.get()[teamIndex].name;
    }

    const updateIcon = ($img: HTMLElement) => {
        ($img as HTMLImageElement).src = GAME_CONTEXT.teams.get()[teamIndex].icon;
    }

    const onNameBlur = (e: Event) => {
        GAME_CONTEXT.renameTeam(
            teamIndex, 
            (e.currentTarget as HTMLElement).textContent ?? ''
        );
    }

    const renderMembers = ($list: HTMLElement) => {
        
        const members = GAME_CONTEXT.teams.get()[teamIndex].members;
        
        $list.innerHTML = '';

        if (members.length === 0) {
            $list.appendChild(UltraComponent({
                component: '<li>No players yet</li>',
                className: [styles.empty]
            }));
            return;
        }

        members.forEach((name, memberIndex) => {
            $list.appendChild(UltraComponent({
                component: `<li>${name}</li>`,
                className: [styles.chip],
                children: [
                    UltraComponent({
                        component: '<button type="button">&times;</button>',
                        className: [styles.remove],
                        attributes: { 'aria-label': `Remove ${name}` },
                        eventHandler: {
                            click: () => GAME_CONTEXT
                            .removeMember(teamIndex, memberIndex)
                        }
                    })
                ]
            }));
        });
        
    }

    const addDraft = () => {
        if (!draft.trim()) {
            CONFIRM_CONTEXT.show({
                title: 'Hold on!',
                message: 'No team member to add!',
                confirmText: 'Got it'
            });
            return;
        }
        GAME_CONTEXT.addMember(teamIndex, draft);
        draft = '';
    }

    return UltraComponent({
        
        component: '<div></div>',
        
        className: [
            styles.card, 
            teamIndex === 0 ? styles.teamOne : styles.teamTwo
        ],
        
        children: [

            UltraComponent({
                component: '<button type="button"></button>',
                className: [styles.iconButton],
                attributes: { 'aria-label': 'Shuffle team icon', title: 'Shuffle team icon' },
                eventHandler: {
                    click: () => {
                        EMOJI_CTX.currentTeam.set(teamIndex);
                        EMOJI_CTX.isModalVisible.set(true);
                    }
                },
                children: [
                    UltraComponent({
                        component: '<img/>',
                        className: [styles.iconImg],
                        attributes: { alt: 'Team icon' },
                        onMount: [updateIcon],
                        trigger: [{
                            subscriber: GAME_CONTEXT.teams.subscribe,
                            triggerFunction: updateIcon
                        }]
                    })
                ]
            }),

            UltraComponent({
                component: '<div></div>',
                className: [styles.nameWrap],
                children: [
                    UltraComponent({
                        component: '<span></span>',
                        className: [styles.name],
                        attributes: { contenteditable: 'true', spellcheck: 'false' },
                        eventHandler: { blur: onNameBlur },
                        onMount: [updateName],
                        trigger: [{
                            subscriber: GAME_CONTEXT.teams.subscribe,
                            triggerFunction: updateName
                        }]
                    })
                ]
            }),
            
            UltraComponent({
                component: '<ul></ul>',
                className: [styles.members],
                onMount: [renderMembers],
                trigger: [{
                    subscriber: GAME_CONTEXT.teams.subscribe,
                    triggerFunction: renderMembers
                }]
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
}
