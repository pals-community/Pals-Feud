import { ultraCompState, type IUltraCompStateStateful } from "ultra-light-js";
import { PANEL_CONTEXT } from "./panel.context";
import { SOUND_CTX } from "@/context/sound.context";
import { isMercifulMatch } from "@/utils/fuzzy-match";
import type { GamePhase, ITeam } from "@/types";
import { CONFIRM_CONTEXT, showFirstGuessPrompt } from "./confirm.context";
import confetti from 'canvas-confetti';
import { WRON_BUZZER_DURATION } from "@/data";
import { VIDEO_CTX } from "./video.context";

let playOrPassTimer: ReturnType<typeof setTimeout> | null = null;

export interface IGameCTX {
    teams: IUltraCompStateStateful<ITeam[]>;
    activeTeam: IUltraCompStateStateful<0 | 1>;
    startingTeam: IUltraCompStateStateful<0 | 1>;
    pot: IUltraCompStateStateful<number>;
    strikes: IUltraCompStateStateful<number>;
    phase: IUltraCompStateStateful<GamePhase>;
    revealed: IUltraCompStateStateful<number[]>;
    roundWinner: IUltraCompStateStateful<0 | 1 | null>;
    answererIndex: IUltraCompStateStateful<[number, number]>;
    missCount: IUltraCompStateStateful<number>;
    isFirstGuessPhase: IUltraCompStateStateful<boolean>;
    firstGuessPoints: IUltraCompStateStateful<{ 0: number; 1: number }>;
    firstGuessAttempts: IUltraCompStateStateful<number>;
    awaitingPlayOrPass: IUltraCompStateStateful<boolean>;
    guess: (text: string) => void;
    awardPot: (teamIndex: 0 | 1) => void;
    nextRound: () => void;
    renameTeam: (teamIndex: 0 | 1, name: string) => void;
    addMember: (teamIndex: 0 | 1, name: string) => void;
    removeMember: (teamIndex: 0 | 1, memberIndex: number) => void;
    renameMember: (teamIndex: 0 | 1, memberIndex: number, name: string) => void;
    advanceAnswerer: (teamIndex: 0 | 1) => void;
    setAnswerer: (teamIndex: 0 | 1, memberIndex: number) => void;
    editPoints: (teamIndex: 0|1, newPoints: number) => void;
}

export const GAME_CONTEXT: IGameCTX = ultraCompState({

    isFirstGuessPhase: true,

    firstGuessPoints: {
        0: 0,
        1: 0
    },

    firstGuessAttempts: 0,

    awaitingPlayOrPass: false,

    teams: [
        { name: 'Gooners', score: 0, members: [] },
        { name: 'Jerkers', score: 0, members: [] }
    ] as ITeam[],

    activeTeam: 0 as 0 | 1,

    startingTeam: 0 as 0 | 1,

    pot: 0,

    strikes: 0,

    phase: 'guessing' as GamePhase,

    revealed: [] as number[],

    roundWinner: null as 0 | 1 | null,

    answererIndex: [0, 0] as [number, number],

    missCount: 0,

    guess: (comp: IGameCTX, text: string) => {

        if (comp.phase.get() === 'round-over') return;
        if (comp.awaitingPlayOrPass.get()) return; //waiting on the play-or-pass decision

        const panel = PANEL_CONTEXT.getPanel();
        const revealed = comp.revealed.get();

        const match = panel.find(a =>
            !revealed.includes(a.position) && isMercifulMatch(text, a.text)
        );

        if (comp.phase.get() === 'steal') {
            if (match) {
                comp.revealed.set([...revealed, match.position]);
                comp.pot.set(comp.pot.get() + match.points);
                comp.awardPot(comp.activeTeam.get());
            } else {
                const otherTeam = comp.activeTeam.get() === 0 ? 1 : 0;
                comp.awardPot(otherTeam);
                comp.missCount.set(comp.missCount.get() + 1);
            }
            SOUND_CTX.playRoundWin();
            return;
        }

        if (comp.isFirstGuessPhase.get()) {
            const guessingTeam = comp.activeTeam.get();
            let pointsEarned = 0;

            if (match) {
                const nextRevealed = [...revealed, match.position];
                comp.revealed.set(nextRevealed);
                comp.pot.set(comp.pot.get() + match.points);
                pointsEarned = match.points;
                SOUND_CTX.playCorrect();
            } else {
                comp.missCount.set(comp.missCount.get() + 1); //trigger the buzzer without counting as a strike
            }

            comp.firstGuessPoints.set({
                ...comp.firstGuessPoints.get(),
                [guessingTeam]: pointsEarned
            });

            const nextAttempts = comp.firstGuessAttempts.get() + 1;

            if (nextAttempts < 2) { //other team still needs their guess
                comp.firstGuessAttempts.set(nextAttempts);
                comp.activeTeam.set(guessingTeam === 0 ? 1 : 0);
            } else { //both teams have guessed, higher score keeps the round
                const firstGuessPoints = comp.firstGuessPoints.get();
                const diff = firstGuessPoints[0] - firstGuessPoints[1];
                const winnerTeam: 0 | 1 = diff === 0
                    ? (Math.random() < 0.5 ? 0 : 1) //tie: coin flip
                    : (diff > 0 ? 0 : 1);
                comp.isFirstGuessPhase.set(false);
                comp.firstGuessAttempts.set(0);
                comp.awaitingPlayOrPass.set(true);
                if (playOrPassTimer) clearTimeout(playOrPassTimer);
                playOrPassTimer = setTimeout(() => {
                    playOrPassTimer = null;
                    CONFIRM_CONTEXT.show({
                        title: 'Play or Pass?',
                        message: `${comp.teams.get()[winnerTeam].name} can either pass or play`,
                        confirmText: 'Play',
                        cancelText: 'Pass',
                        onConfirm: () => {
                            comp.activeTeam.set(winnerTeam);
                            comp.awaitingPlayOrPass.set(false);
                        },
                        onCancel: () => {
                            comp.activeTeam.set(winnerTeam === 0 ? 1: 0);
                            comp.awaitingPlayOrPass.set(false);
                        }
                    })
                }, WRON_BUZZER_DURATION)
            }

            return;
        }

        if (match) {

            const nextRevealed = [...revealed, match.position];
            comp.revealed.set(nextRevealed);
            comp.pot.set(comp.pot.get() + match.points);
            SOUND_CTX.playCorrect();

            if (nextRevealed.length === panel.length) {
                comp.awardPot(comp.activeTeam.get());
                SOUND_CTX.playRoundWin();
            }

        } else {

            const guessingTeam = comp.activeTeam.get();
            comp.advanceAnswerer(guessingTeam);

            const nextStrikes = comp.strikes.get() + 1;
            comp.strikes.set(nextStrikes);
            comp.missCount.set(comp.missCount.get() + 1);

            if (nextStrikes >= 3) {
                comp.activeTeam.set(guessingTeam === 0 ? 1 : 0);
                comp.phase.set('steal');
                SOUND_CTX.playSteal();
            }

        }
    },

    awardPot: (comp: IGameCTX, teamIndex: 0 | 1) => {
        const teams = comp.teams.get();
        comp.teams.set(teams.map((t, i) =>
            i === teamIndex ? { ...t, score: t.score + comp.pot.get() } : t
        ));
        comp.roundWinner.set(teamIndex);
        comp.phase.set('round-over');
    },

    nextRound: (comp: IGameCTX) => {

        if (playOrPassTimer) {
            clearTimeout(playOrPassTimer);
            playOrPassTimer = null;
        }
        comp.awaitingPlayOrPass.set(false);

        const isGameOver = PANEL_CONTEXT.next() === 0;
        if (isGameOver) {
            const winnerTeam = comp.teams
            .get()
            .sort((a, b) => b.score - a.score)[0];
            confetti({
                particleCount: 150,
                spread: 90,
                origin: { y: 0.6 }
            });
            CONFIRM_CONTEXT.show({
                message: `${winnerTeam.name} WINS!`,
                title: 'Game Over'
            })
            return;
        }

        comp.pot.set(0);
        comp.strikes.set(0);
        comp.revealed.set([]);
        comp.roundWinner.set(null);
        comp.isFirstGuessPhase.set(true);
        comp.firstGuessAttempts.set(0);
        comp.firstGuessPoints.set({ 0: 0, 1: 0 });
        comp.phase.set('guessing');
        const nextStarting: 0 | 1 = comp.startingTeam.get() === 0 ? 1 : 0;
        comp.startingTeam.set(nextStarting);
        comp.activeTeam.set(nextStarting);

        const videos = VIDEO_CTX.videos.get();
        if (Object.keys(videos).length === 0) {
            showFirstGuessPrompt();
            return;
        }

        CONFIRM_CONTEXT.show({
            title: 'Sponsored Break',
            message: 'Do you want to run an ad?',
            cancelText: 'Nah',
            onConfirm() {
                const mostRecent = Object.values(videos)
                    .sort((a, b) => b.uploadedAt - a.uploadedAt)[0];
                VIDEO_CTX.playVideo(mostRecent.id);
                showFirstGuessPrompt();
            },
            onCancel() {
                showFirstGuessPrompt();
            }
        })

    },

    renameTeam: (comp: IGameCTX, teamIndex: 0 | 1, name: string) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        const teams = comp.teams.get();
        comp.teams.set(teams.map((t, i) =>
            i === teamIndex ? { ...t, name: trimmed } : t
        ));
    },

    addMember: (comp: IGameCTX, teamIndex: 0 | 1, name: string) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        const teams = comp.teams.get();
        comp.teams.set(teams.map((t, i) =>
            i === teamIndex ? { ...t, members: [...t.members, trimmed] } : t
        ));
    },

    removeMember: (comp: IGameCTX, teamIndex: 0 | 1, memberIndex: number) => {
        const teams = comp.teams.get();
        comp.teams.set(teams.map((t, i) =>
            i === teamIndex ? { ...t, members: t.members.filter((_, mi) => mi !== memberIndex) } : t
        ));
    },

    renameMember: (comp: IGameCTX, teamIndex: 0 | 1, memberIndex: number, name: string) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        const teams = comp.teams.get();
        comp.teams.set(teams.map((t, i) =>
            i === teamIndex
                ? { ...t, members: t.members.map((m, mi) => mi === memberIndex ? trimmed : m) }
                : t
        ));
    },

    advanceAnswerer: (comp: IGameCTX, teamIndex: 0 | 1) => {
        const memberCount = comp.teams.get()[teamIndex].members.length;
        if (memberCount === 0) return;

        const indices = comp.answererIndex.get();
        const nextIndex = (indices[teamIndex] + 1) % memberCount;
        comp.answererIndex.set(
            teamIndex === 0 ? [nextIndex, indices[1]] : [indices[0], nextIndex]
        );
    },

    setAnswerer: (comp: IGameCTX, teamIndex: 0 | 1, memberIndex: number) => {
        const memberCount = comp.teams.get()[teamIndex].members.length;
        if (memberIndex < 0 || memberIndex >= memberCount) return;

        const indices = comp.answererIndex.get();
        comp.answererIndex.set(
            teamIndex === 0 ? [memberIndex, indices[1]] : [indices[0], memberIndex]
        );
    },

    editPoints: (
        comp: IGameCTX, 
        teamIndex: 0 | 1,
        newPoints: number
    ) => {
        const teams = [...comp.teams.get()];
        teams[teamIndex].score = newPoints;
        comp.teams.set(teams);
    }

})

export function teamsReady(): boolean {
    return GAME_CONTEXT.teams.get().every(team => team.members.length > 0);
}

export function currentAnswerer(teamIndex: 0 | 1): string | null {
    const members = GAME_CONTEXT.teams.get()[teamIndex].members;
    if (members.length === 0) return null;

    const index = GAME_CONTEXT.answererIndex.get()[teamIndex] % members.length;
    return members[index];
}
