import { UltraComponent } from "ultra-light-js";
import { PANEL_CONTEXT } from "@/context/panel.context";
import { feudAnswerDTO } from "@/utils/dto";
import { filterValidPanels } from "@/utils/panel-validation";
import { MIN_PANEL_ANSWERS } from "@/data";
import styles from './csv-upload.module.css';
import { CONFIRM_CONTEXT } from "@/context/confirm.context";

export function CsvUpload() {

    const onFileChange = async (e: Event) => {

        const $input = e.target as HTMLInputElement;
        const $label = $input.closest(`.${styles.upload}`) as HTMLElement | null;

        const file = $input.files?.[0];
        if (!file) return;

        const text = await file.text();

        const parsed = text
        .split('\n')
        .slice(1)
        .map(feudAnswerDTO)
        .filter(f => f.question);

        const { valid: answers, droppedQuestions } = filterValidPanels(parsed);

        PANEL_CONTEXT.panelAnswers.set(answers);
        PANEL_CONTEXT.currentPanel.set(PANEL_CONTEXT.getPanelKeys()[0] ?? '');

        const showLoadedConfirm = () => CONFIRM_CONTEXT.show({
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

        if (droppedQuestions.length > 0) {
            CONFIRM_CONTEXT.show({
                title: 'Some Panels Skipped',
                message: `Panels need at least ${MIN_PANEL_ANSWERS} answers, so these were skipped:\n${droppedQuestions.map(q => `· ${q}`).join('\n')}`,
                confirmText: 'Got it',
                onConfirm: showLoadedConfirm
            })
        } else {
            showLoadedConfirm();
        }

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
