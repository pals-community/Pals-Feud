import type { IFeudAnswer, IFeudAnswerWithQuestion } from "@/types";
import { ultraCompState, type IUltraCompStateStateful } from "ultra-light-js";

export interface IPanelCTX {
    panelAnswers: IUltraCompStateStateful<IFeudAnswerWithQuestion[]>;
    currentPanel: IUltraCompStateStateful<string>;
    getPanelKeys: () => string[];
    getPanel: () => IFeudAnswer[];
    next: () => number;
}

export const PANEL_CONTEXT: IPanelCTX = ultraCompState({

    panelAnswers: [] as IFeudAnswerWithQuestion[],

    currentPanel: '',

    getPanelKeys: (comp: IPanelCTX) => {
        return [...new Set(comp.panelAnswers.get().map(a => a.question))];
    },

    getPanel: (comp: IPanelCTX) => {
        return comp.panelAnswers
            .get()
            .filter(a => a.question === comp.currentPanel.get())
            .map(({ text, position, points }) => ({ text, position, points }));
    },

    next: (comp: IPanelCTX) => {
        const keys = comp.getPanelKeys();
        const currentIndex = keys.indexOf(comp.currentPanel.get());
        const nextIndex = (currentIndex + 1) % keys.length;
        comp.currentPanel.set(keys[nextIndex]);
        return nextIndex === 0 ? 0 : nextIndex - currentIndex
    }

})