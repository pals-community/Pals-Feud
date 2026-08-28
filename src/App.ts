import { UltraActivity, UltraComponent, UltraRouter, ultraNavigate } from "ultra-light-js";
import { PreGameScreen } from "./pages/pre-game-screen.page";
import { GAME_CONTEXT, teamsReady } from "./context/game.context";
import styles from './App.module.css';
import { GamePage } from "./pages/game.page";
import { PRE_GAME_CTX } from "./context/pre-game.context";
import { Layout } from "./components/layout";
import { COVERS_CTX } from "./context/covers.context";
import { Loader } from "./components/loader/loader";
import { MUSIC_CTX } from "./context/music.context";

export function App() {

    MUSIC_CTX.arm();

    void GAME_CONTEXT.loadTeamIcons();

    const isAppVisible = () => {
        return PRE_GAME_CTX.isVisible.get()
        && !COVERS_CTX.isLoading.get()
    }

    const appVisibilitySubscribers = [
        PRE_GAME_CTX.isVisible.subscribe,
        COVERS_CTX.isLoading.subscribe
    ];

    return Layout(

        UltraActivity({
            mode: {
                state: COVERS_CTX.isLoading.get,
                subscriber: appVisibilitySubscribers
            },
            component: '<div></div>',
            children: [Loader()]
        }),

        UltraActivity({

            mode: {
                state: isAppVisible,
                subscriber: appVisibilitySubscribers
            },

            component: '<section></section>',

            className: [styles.app],

            children: [

                UltraComponent({
                    component: '<div></div>',
                    className: [styles.appContent],
                    children: [
                        UltraRouter(
                            { path: '/', component: PreGameScreen },
                            {
                                path: '/game',
                                component: () => {
                                    return !teamsReady()
                                        ? UltraComponent({
                                            component: '<div></div>',
                                            onMount: [
                                                () => ultraNavigate({ href: '/' })
                                            ]
                                        }) : GamePage()
                                }
                            }
                        )
                    ]
                })
            ]
        })
        
    )

}