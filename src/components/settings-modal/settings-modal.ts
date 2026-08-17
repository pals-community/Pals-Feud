import { UltraActivity, UltraComponent } from "ultra-light-js";
import { SETTINGS_CONTEXT } from "@/context/settings.context";
import styles from './settings-modal.module.css';
import { VolumeField } from "./volume-field";
import { CoverCountField } from "./cover-count-field";

export function SettingsModal() { 

    const syncMuteButton = ($btn: HTMLElement) => {
        const muted = SETTINGS_CONTEXT.muted.get();
        $btn.textContent = muted ? 'Unmute All' : 'Mute All';
        $btn.classList.toggle(styles.muted, muted);
    };

    const onEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') SETTINGS_CONTEXT.closeSettings();
    };

    const onMount = () => {
        document.addEventListener('keydown', onEscape);
        return () => document.removeEventListener('keydown', onEscape);
    }

    return UltraActivity({
        
        mode: {
            state: () => SETTINGS_CONTEXT.open.get(),
            subscriber: SETTINGS_CONTEXT.open.subscribe
        },   

        component: '<div></div>',
        
        className: [styles.backdrop],
    
        type: 'display',
        
        eventHandler: {
            click: (e: Event) => {
                if (e.target === e.currentTarget) SETTINGS_CONTEXT.closeSettings();
            }
        },
        
        onMount: [onMount],

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
                    
                    VolumeField({
                        labelText: 'Music Volume', 
                        volume: SETTINGS_CONTEXT.musicVolume, 
                        setVolume: SETTINGS_CONTEXT.setMusicVolume
                    }),

                    VolumeField({
                        labelText: 'Sound Effects Volume', 
                        volume: SETTINGS_CONTEXT.sfxVolume, 
                        setVolume: SETTINGS_CONTEXT.setSfxVolume
                    }),
                    
                    CoverCountField({
                        labelText: 'Floating Covers',
                        count: SETTINGS_CONTEXT.coverCount,
                        setCount: SETTINGS_CONTEXT.setCoverCount
                    }),
                
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
