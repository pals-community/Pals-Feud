import { UltraComponent } from "ultra-light-js";
import styles from './paywall-modal.module.css';

export function Stamp({
	message,
	submessage,
	orientation = 'right'
}:{
	message: string;
	submessage: string;
	orientation?: 'right' | 'left'
}) {

    return UltraComponent({
        component: `<div><span>★ Certified ★</span><strong>${message}</strong><span>${submessage}</span></div>`,
    	attributes: {
    		role: 'img',
    		'aria-label': 'Stamp',
    		style: `${orientation}: -14px`
    	},
        className: [styles.stamp]
    });
    
}
