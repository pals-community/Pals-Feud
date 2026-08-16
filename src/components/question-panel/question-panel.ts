import { UltraComponent, ultraState } from "ultra-light-js";
import { AnswerCard } from "../answer-card/answer-card";
import { PANEL_CONTEXT } from "../../context/panel.context";
import type { IFeudAnswer } from "@/types";
import styles from './question-panel.module.css';
import { CONFIRM_CONTEXT } from "@/context/confirm.context";

export function QuestionPanel() {

    const [
        panelTitle,
        setPanelTitle,
        subsPanelTitle
    ] = ultraState('');

    const [
        answers,
        setAnswers,
        subsAnswers
    ] = ultraState<IFeudAnswer[]>([]);

    const onAnswersChange = ($div: HTMLElement) => {
        CONFIRM_CONTEXT.show({
            title: 'First Guess Phase!',
            message: 'Both teams can make a guess. Higher guess gets to continue the panel!',
            confirmText: 'Got it!'
        });
        $div.replaceChildren(
            ...answers()
                .sort((a, b) => a.position - b.position)
                .map(m => AnswerCard(m))
        )
    }

    const getPanelInfo = () => {
        setPanelTitle(PANEL_CONTEXT.currentPanel.get());
        setAnswers(PANEL_CONTEXT.getPanel())
    }

    const onTitleChange = ($h1: HTMLElement) => {
        $h1.textContent = panelTitle();
    }

    return UltraComponent({
        component: '<section></section>',
        className: [styles.panel],
        onMount: [getPanelInfo],
        trigger: [{
            subscriber: PANEL_CONTEXT.currentPanel.subscribe,
            triggerFunction: getPanelInfo
        }],
        children: [
            UltraComponent({
                component: '<h1></h1>',
                className: [styles.title],
                trigger: [{
                    subscriber: subsPanelTitle,
                    triggerFunction: onTitleChange
                }]
            }),
            UltraComponent({
                component: '<div></div>',
                className: [styles.answersGrid],
                trigger: [{
                    subscriber: subsAnswers,
                    triggerFunction: onAnswersChange
                }]
            })
        ]
    })

}