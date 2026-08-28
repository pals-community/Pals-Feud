export interface IFeudAnswer {
    text: string;
    position: number;
    points: number;
}

export interface ITeam {
    name: string;
    score: number;
    members: string[];
    icon: string;
}

export type GamePhase = 'guessing' | 'steal' | 'round-over';

export interface IPersistedSettings {
    musicVolume: number;
    sfxVolume: number;
    muted: boolean;
    coverCount: number;
}

export interface ChromaKeyHandle {
    start(): void;
    stop(): void;
}

export interface ChromaKeyOptions {
    minGreen?: number;
    thresholdLow?: number;
    thresholdHigh?: number;
}

export interface IFeudAnswerWithQuestion extends IFeudAnswer {
    question: string;
}

export interface IConfirmOptions {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    onClickOut?: () => void;
}

export interface IVideoEntry {
    id: string;
    title: string;
    url: string;
    fileName: string;
    uploadedAt: number;
}

export type EmojiManifest = {
    emojis: string[];
};

export type CoversManifest = {
    covers: string[];
};