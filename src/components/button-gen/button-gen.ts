import { UltraComponent, type UltraElementProps } from "ultra-light-js";
import styles from './button-gen.module.css';

export function ButtonGen({
    text,
    ...props
}:{
    text: string
} & UltraElementProps){
    
    return UltraComponent({
        ...props,
        className: [
            styles.button, 
            ...(props.className ? props.className : [])
        ],
        component: `<button>${text}</button>`,
    })

}