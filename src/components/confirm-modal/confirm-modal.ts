import { UltraActivity, UltraComponent } from "ultra-light-js";
import { CONFIRM_CONTEXT } from "@/context/confirm.context";
import styles from './confirm-modal.module.css';
import { KILLER_MOTH_CHIBI } from "@/data";

export function ConfirmModal() {

    const syncTitle = ($el: HTMLElement) => {
        const title = CONFIRM_CONTEXT.title.get();
        $el.textContent = title;
        $el.style.display = title ? '' : 'none';
    };

    const syncMessage = ($el: HTMLElement) => {
        $el.textContent = CONFIRM_CONTEXT.message.get();
    };

    const syncConfirmText = ($el: HTMLElement) => {
        $el.textContent = CONFIRM_CONTEXT.confirmText.get();
    };

    const syncCancelButton = ($el: HTMLElement) => {
        const cancelText = CONFIRM_CONTEXT.cancelText.get();
        $el.textContent = cancelText;
        $el.style.display = cancelText ? '' : 'none';
    };

    const onEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') CONFIRM_CONTEXT.cancel();
    };

    const onClickOut = () => {
        document.addEventListener('keydown', onEscape);
        return () => document.removeEventListener('keydown', onEscape);
    }

    return UltraActivity({
        
        component: '<div></div>',
        
        className: [styles.backdrop],
        
        mode: {
            state: () => CONFIRM_CONTEXT.open.get(),
            subscriber: CONFIRM_CONTEXT.open.subscribe
        },
        
        type: 'display',
        
        eventHandler: {
            click: (e: Event) => {
                if (e.target === e.currentTarget) CONFIRM_CONTEXT.cancel();
            }
        },
        
        onMount: [onClickOut],

        children: [

            UltraComponent({
                
                component: '<div></div>',
                
                className: [styles.panel],
                
                children: [
                    
                    UltraComponent({
                        component: '<div></div>',
                        className: [styles.avatarWrap],
                        children: [
                            UltraComponent({
                                component: '<img/>',
                                className: [styles.avatar],
                                attributes: {
                                    src: KILLER_MOTH_CHIBI,
                                    alt: 'Killer Moth warning you'
                                }
                            })
                        ]
                    }),
                    
                    UltraComponent({
                        component: '<h2></h2>',
                        className: [styles.title],
                        onMount: [syncTitle],
                        trigger: [{ subscriber: CONFIRM_CONTEXT.title.subscribe, triggerFunction: syncTitle }]
                    }),
                    
                    UltraComponent({
                        component: '<p></p>',
                        className: [styles.message],
                        onMount: [syncMessage],
                        trigger: [{ 
                            subscriber: CONFIRM_CONTEXT.message.subscribe, 
                            triggerFunction: syncMessage 
                        }]
                    }),

                    UltraComponent({
                    
                        component: '<div></div>',
                    
                        className: [styles.actions],
                    
                        children: [
                    
                            UltraComponent({
                                component: '<button type="button"></button>',
                                className: [styles.cancelButton],
                                onMount: [syncCancelButton],
                                trigger: [{ 
                                    subscriber: CONFIRM_CONTEXT.cancelText.subscribe, 
                                    triggerFunction: syncCancelButton 
                                }],
                                eventHandler: { 
                                    click: () => CONFIRM_CONTEXT.cancel() 
                                }
                            }),
                    
                            UltraComponent({
                                component: '<button type="button"></button>',
                                className: [styles.confirmButton],
                                onMount: [syncConfirmText],
                                trigger: [{ 
                                    subscriber: CONFIRM_CONTEXT.confirmText.subscribe, 
                                    triggerFunction: syncConfirmText 
                                }],
                                eventHandler: { 
                                    click: () => CONFIRM_CONTEXT.confirm() 
                                }
                            })

                        ]

                    })

                ]
            })
        ]
    });
}
