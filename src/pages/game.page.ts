import { QuestionPanel } from "@/components/question-panel/question-panel";
import { RoundBanner } from "@/components/round-banner/round-banner";
import { Scoreboard } from "@/components/scoreboard/scoreboard";
import { Strikes } from "@/components/strikes/strikes";
import { WrongBuzzer } from "@/components/wrong-buzzer/wrong-buzzer";
import { UltraComponent } from "ultra-light-js";

export function GamePage() {

    const warnBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = '';
    }

    const onMount = () => {
        window.addEventListener('beforeunload', warnBeforeUnload);
        return () => window.removeEventListener(
            'beforeunload', warnBeforeUnload
        );
    }

    return UltraComponent({
        component: '<div></div>',
        children: [
            Scoreboard(),
            QuestionPanel(),
            Strikes(),
            RoundBanner(),
            WrongBuzzer()
        ],
        onMount: [onMount]
    });

}
