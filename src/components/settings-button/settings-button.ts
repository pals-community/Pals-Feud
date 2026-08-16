import { UltraComponent } from "ultra-light-js";
import { SETTINGS_CONTEXT } from "@/context/settings.context";
import styles from './settings-button.module.css';

export function SettingsButton() {
    return UltraComponent({
        component: `<button type="button">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M19.14,12.94a7.14,7.14,0,0,0,.06-.94,7.14,7.14,0,0,0-.06-.94l2.03-1.58a.5.5,0,0,0,.12-.64l-1.92-3.32a.5.5,0,0,0-.6-.22l-2.39.96a7.3,7.3,0,0,0-1.62-.94L14.4,2.81a.5.5,0,0,0-.5-.41H10.1a.5.5,0,0,0-.5.41L9.24,5.26a7.3,7.3,0,0,0-1.62.94l-2.39-.96a.5.5,0,0,0-.6.22L2.71,8.78a.5.5,0,0,0,.12.64L4.86,11a7.14,7.14,0,0,0-.06.94,7.14,7.14,0,0,0,.06.94L2.83,14.46a.5.5,0,0,0-.12.64l1.92,3.32a.5.5,0,0,0,.6.22l2.39-.96a7.3,7.3,0,0,0,1.62.94l.36,2.45a.5.5,0,0,0,.5.41h3.8a.5.5,0,0,0,.5-.41l.36-2.45a7.3,7.3,0,0,0,1.62-.94l2.39.96a.5.5,0,0,0,.6-.22l1.92-3.32a.5.5,0,0,0-.12-.64ZM12,15.5A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/>
            </svg>
        </button>`,
        className: [styles.gearButton],
        attributes: { 'aria-label': 'Open settings' },
        eventHandler: {
            click: () => SETTINGS_CONTEXT.openSettings()
        }
    });
}
