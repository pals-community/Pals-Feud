import { UltraActivity, UltraComponent, UltraRouter, ultraNavigate } from "ultra-light-js";
import { PreGameScreen } from "./pages/pre-game-screen.page";
import { teamsReady } from "./context/game.context";
import styles from './App.module.css';
import { GamePage } from "./pages/game.page";
import { PRE_GAME_CTX } from "./context/pre-game.context";
import { Layout } from "./components/layout";
import { ULTRA_COVERS_CTX } from "./hooks/ultraCovers";
import { Loader } from "./components/loader/loader";
import { MUSIC_CTX } from "./context/music.context";

export function App() {

    MUSIC_CTX.arm();

    const isAppVisible = () => {
        return PRE_GAME_CTX.isVisible.get()
        && !ULTRA_COVERS_CTX.isLoading.get()
    }

    const appVisibilitySubscribers = [
        PRE_GAME_CTX.isVisible.subscribe,
        ULTRA_COVERS_CTX.isLoading.subscribe
    ];

    return Layout(

        UltraActivity({
            mode: {
                state: ULTRA_COVERS_CTX.isLoading.get,
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