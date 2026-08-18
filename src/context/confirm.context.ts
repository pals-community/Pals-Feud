import type { IConfirmOptions } from "@/types";
import { ultraCompState, type IUltraCompStateStateful } from "ultra-light-js";

export interface IConfirmCTX {
    open: IUltraCompStateStateful<boolean>;
    title: IUltraCompStateStateful<string>;
    message: IUltraCompStateStateful<string>;
    confirmText: IUltraCompStateStateful<string>;
    cancelText: IUltraCompStateStateful<string>;
    show: (options: IConfirmOptions) => void;
    confirm: () => void;
    cancel: () => void;
}

let pendingConfirm: (() => void) | null = null;
let pendingCancel: (() => void) | null = null;

export const CONFIRM_CONTEXT: IConfirmCTX = ultraCompState({

    open: false,
    title: '',
    message: '',
    confirmText: 'OK',
    cancelText: '',

    show: (comp: IConfirmCTX, options: IConfirmOptions) => {
        comp.title.set(options.title ?? '');
        comp.message.set(options.message);
        comp.confirmText.set(options.confirmText ?? 'OK');
        comp.cancelText.set(options.cancelText ?? '');
        pendingConfirm = options.onConfirm ?? null;
        pendingCancel = options.onCancel ?? null;
        comp.open.set(true);
    },

    confirm: (comp: IConfirmCTX) => {
        comp.open.set(false);
        const callback = pendingConfirm;
        pendingConfirm = null;
        pendingCancel = null;
        callback?.();
    },

    cancel: (comp: IConfirmCTX) => {
        comp.open.set(false);
        const callback = pendingCancel;
        pendingConfirm = null;
        pendingCancel = null;
        callback?.();
    }

});

export function showFirstGuessPrompt(): void {
    CONFIRM_CONTEXT.show({
        title: 'First Guess Phase!',
        message: 'Both teams can make a guess. Higher guess gets to continue the panel!',
        confirmText: 'Got it!'
    });
}
