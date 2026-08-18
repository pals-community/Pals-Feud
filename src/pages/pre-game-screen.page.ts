import { UltraComponent, ultraNavigate } from "ultra-light-js";
import { TeamSetup } from "@/components/team-setup/team-setup";
import { GAME_CONTEXT, teamsReady } from "@/context/game.context";
import { CONFIRM_CONTEXT } from "@/context/confirm.context";
import styles from './pre-game-screen.module.css';
import { PreGameScreenAvatar } from "@/components/pre-game-screen/avatar";
import { PreGameScreenTitle } from "@/components/pre-game-screen/title";
import { ButtonGen } from "@/components/button-gen/button-gen";
import { CsvUpload } from "@/components/csv-upload/csv-upload";
import { PANEL_CONTEXT } from "@/context/panel.context";
import { DISCORD_ICON } from "@/data";
import { VideoUpload } from "@/components/video-upload/video-upload";

export function PreGameScreen() {

    function handleStartGame() {
        if (!teamsReady()) {
            CONFIRM_CONTEXT.show({
                title: 'Hold on!',
                message: 'Both teams need at least one player before you can start the game.',
                confirmText: 'Got it'
            });
        } else if (PANEL_CONTEXT.getPanelKeys().length === 0) {
            CONFIRM_CONTEXT.show({
                title: 'No Panels Loaded!',
                message: 'Upload a CSV of questions and answers before starting the game.',
                confirmText: 'Got it'
            });
        } else {
            CONFIRM_CONTEXT.show({
                title: 'Ready?',
                message: 'Make sure the teams are properly set.',
                confirmText: 'Got it',
                cancelText: 'Go Back',
                onConfirm: () => {
                    const teams = GAME_CONTEXT.teams.get().map(t => t.name);
                    const onClick = (teamIndex: 0|1) => {
                        GAME_CONTEXT.activeTeam.set(teamIndex);
                        ultraNavigate({ href: '/game' })
                    }
                    CONFIRM_CONTEXT.show({
                        title: 'Who should start?',
                        message: 'Select the starting team',
                        cancelText: teams[0],
                        confirmText: teams[1],
                        onCancel: () => onClick(0),
                        onConfirm: () => onClick(1)
                    })
                }
            });
        }
    }

    return UltraComponent({

        component: '<section></section>',

        className: [styles.screen],

        children: [

            UltraComponent({
                component: '<div></div>',
                className: [styles.hero],
                children: [
                    PreGameScreenAvatar(),
                    PreGameScreenTitle(),
                    PreGameScreenAvatar({
                        src: DISCORD_ICON,
                        alt: 'Discord log' 
                    })
                ]
            }),

            UltraComponent({
                component: '<div></div>',
                className: [styles.teamsRow],
                children: [
                    TeamSetup(0),
                    UltraComponent({ 
                        component: '<span>VS</span>', 
                        className: [styles.vs] 
                    }),
                    TeamSetup(1)
                ]
            }),

            UltraComponent({
                
                component: '<div></div>',
                
                styles: {
                    display: 'flex',
                    gap: '10px'
                },

                children: [
                    
                    ButtonGen({
                        text: 'Start Game',
                        eventHandler: {
                            click: handleStartGame
                        }
                    }),

                    CsvUpload(),

                    VideoUpload()
                    
                ]

            })

        ]

    })

}
