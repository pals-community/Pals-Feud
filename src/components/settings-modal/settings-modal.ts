import { UltraActivity, UltraComponent, type IUltraCompStateStateful } from "ultra-light-js";
import { SETTINGS_CONTEXT } from "@/context/settings.context";
import { MIN_COVERS, MAX_COVERS } from "@/data";
import styles from './settings-modal.module.css';

function volumeField(labelText: string, volume: IUltraCompStateStateful<number>, setVolume: (value: number) => void) {
    const sync = ($input: HTMLElement) => {
        ($input as HTMLInputElement).value = String(Math.round(volume.get() * 100));
    };

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
                    input: (e: Event) => setVolume(Number((e.currentTarget as HTMLInputElement).value) / 100)
                }
            })
        ]
    });
}

function coverCountField(labelText: string, count: IUltraCompStateStateful<number>, setCount: (value: number) => void) {
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
                component: `<input type="range" min="${MIN_COVERS}" max="${MAX_COVERS}" step="1"/>`,
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

export function SettingsModal() {

    const syncMuteButton = ($btn: HTMLElement) => {
        const muted = SETTINGS_CONTEXT.muted.get();
        $btn.textContent = muted ? 'Unmute All' : 'Mute All';
        $btn.classList.toggle(styles.muted, muted);
    };

    const onEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') SETTINGS_CONTEXT.closeSettings();
    };

    return UltraActivity({
        component: '<div></div>',
        className: [styles.backdrop],
        mode: {
            state: () => SETTINGS_CONTEXT.open.get(),
            subscriber: SETTINGS_CONTEXT.open.subscribe
        },
        type: 'display',
        eventHandler: {
            click: (e: Event) => {
                if (e.target === e.currentTarget) SETTINGS_CONTEXT.closeSettings();
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
                            UltraComponent({ component: '<h2>Settings</h2>', className: [styles.title] }),
                            UltraComponent({
                                component: '<button type="button">&times;</button>',
                                className: [styles.close],
                                attributes: { 'aria-label': 'Close settings' },
                                eventHandler: { click: () => SETTINGS_CONTEXT.closeSettings() }
                            })
                        ]
                    }),
                    volumeField('Music Volume', SETTINGS_CONTEXT.musicVolume, SETTINGS_CONTEXT.setMusicVolume),
                    volumeField('Sound Effects Volume', SETTINGS_CONTEXT.sfxVolume, SETTINGS_CONTEXT.setSfxVolume),
                    coverCountField('Floating Covers', SETTINGS_CONTEXT.coverCount, SETTINGS_CONTEXT.setCoverCount),
                    UltraComponent({
                        component: '<button type="button">Mute All</button>',
                        className: [styles.muteButton],
                        onMount: [syncMuteButton],
                        trigger: [{ subscriber: SETTINGS_CONTEXT.muted.subscribe, triggerFunction: syncMuteButton }],
                        eventHandler: { click: () => SETTINGS_CONTEXT.toggleMuted() }
                    })
                ]
            })
        ]
    });
}
