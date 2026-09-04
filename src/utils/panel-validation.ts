import type { IFeudAnswerWithQuestion, IPanelValidationResult } from "@/types";
import { MIN_PANEL_ANSWERS } from "@/data";

export function filterValidPanels(
    answers: IFeudAnswerWithQuestion[]
): IPanelValidationResult {

    const byQuestion = new Map<string, IFeudAnswerWithQuestion[]>();
    for (const a of answers) {
        const group = byQuestion.get(a.question) ?? [];
        group.push(a);
        byQuestion.set(a.question, group);
    }

    const valid: IFeudAnswerWithQuestion[] = [];
    const droppedQuestions: string[] = [];

    for (const [question, group] of byQuestion) {
        if (group.length < MIN_PANEL_ANSWERS) {
            droppedQuestions.push(question);
        } else {
            valid.push(...group);
        }
    }

    return { valid, droppedQuestions };
}
