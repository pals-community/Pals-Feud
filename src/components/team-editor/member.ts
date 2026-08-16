import { UltraComponent } from "ultra-light-js";
import styles from './team-editor.module.css';
import { GAME_CONTEXT } from "@/context/game.context";
import { TEAM_EDITOR_CTX } from "@/context/team-editor.context";

export function TeamEditorMember({
    memberIndex,
    activeIndex,
    name
}: {
    memberIndex: number;
    activeIndex: number;
    name: string;
}) {

    const ti = TEAM_EDITOR_CTX.teamIndex.get();

    const className = (memberIndex === activeIndex)
    ? [styles.row, styles.active]
    : [styles.row]

    return UltraComponent({
        component: '<li></li>',
        className,
        children: [

            UltraComponent({
                component: '<button type="button">&#9733;</button>',
                className: [styles.activeToggle],
                attributes: {
                    'aria-label': `Set ${name} as active player`,
                    'aria-pressed': String(memberIndex === activeIndex)
                },
                eventHandler: {
                    click: () => GAME_CONTEXT.setAnswerer(ti, memberIndex)
                }
            }),

            UltraComponent({
                component: `<span>${name}</span>`,
                className: [styles.memberName],
                attributes: { contenteditable: 'true', spellcheck: 'false' },
                eventHandler: {
                    blur: (e: Event) => GAME_CONTEXT.renameMember(
                        ti,
                        memberIndex,
                        (e.currentTarget as HTMLElement).textContent ?? ''
                    )
                }
            }),

            UltraComponent({
                component: '<button type="button">&times;</button>',
                className: [styles.remove],
                attributes: { 'aria-label': `Remove ${name}` },
                eventHandler: {
                    click: () => GAME_CONTEXT.removeMember(ti, memberIndex)
                }
            })
        ]
    })
}