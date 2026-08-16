import { UltraComponent } from "ultra-light-js";
import { PANEL_CONTEXT } from "@/context/panel.context";
import { feudAnswerDTO } from "@/utils/dto";
import styles from './csv-upload.module.css';
import { CONFIRM_CONTEXT } from "@/context/confirm.context";

export function CsvUpload() {

    const onFileChange = async (e: Event) => {

        const $input = e.target as HTMLInputElement;
        const $label = $input.closest(`.${styles.upload}`) as HTMLElement | null;

        const file = $input.files?.[0];
        if (!file) return;

        const text = await file.text();

        const answers = text
        .split('\n')
        .slice(1)
        .map(feudAnswerDTO)
        .filter(f => f.question);

        PANEL_CONTEXT.panelAnswers.set(answers);
        PANEL_CONTEXT.currentPanel.set(PANEL_CONTEXT.getPanelKeys()[0] ?? '');

        CONFIRM_CONTEXT.show({
            title: 'Panels Loaded',
            message: 'All panels have been loaded.',
            confirmText: "Let's go!",
            cancelText: 'Lemme check',
            onCancel: () =>{
                CONFIRM_CONTEXT.show({
                    title: 'Panels:',
                    message: Array.from(new Set(answers.map(a => `· ${a.question}`))).join('\n'),
                    confirmText: 'Nisu',
                    cancelText: 'Nah',
                    onCancel: () => {
                        $input.click();  
                    }
                })
            }
        })

        if ($label) {
            const $text = $label.querySelector(`.${styles.text}`);
            if ($text) $text.textContent = file.name;
            $label.classList.add(styles.loaded);
        }

    }
    
    return UltraComponent({

        component: '<label></label>',

        children: [
            '<input type="file" accept=".csv" />',
            '<span class="${styles.text}">Upload Panels</span>'
        ],

        className: [styles.upload],

        attributes: { 
            'aria-label': 'Upload CSV of questions and answers' 
        },

        eventHandler: {
            change: onFileChange
        }

    })

}
