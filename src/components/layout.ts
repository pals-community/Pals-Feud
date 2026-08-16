import { UltraComponent, UltraFragment, type UltraLightElement } from "ultra-light-js";
import { SettingsButton } from "./settings-button/settings-button";
import { VisibilityButton } from "./visibility-button/visibility-button";
import { SettingsModal } from "./settings-modal/settings-modal";
import { ConfirmModal } from "./confirm-modal/confirm-modal";
import { HostedBy } from "./hosted-by/hosted-by";
import { SETTINGS_CONTEXT } from "../context/settings.context";
import { pickRandom } from "../utils";
import { Lane } from "./floating-covers/lane";
import { ultraCovers } from "../hooks/ultraCovers";
import floatingCoversStyles from "./floating-covers/floating-covers.module.css";
import { TeamEditor } from "./team-editor/team-editor";
import { DevBy } from "./dev-by/dev-by";

export function Layout(
    ...children: UltraLightElement[]

) {

    const { covers, subsCovers, getCovers } = ultraCovers();

    const onCoversChange = ($div: HTMLElement) => {
        $div.replaceChildren(
            ...pickRandom(covers(), SETTINGS_CONTEXT.coverCount.get())
                .map((src, index) => Lane({ src, index }))
        );
    };
    
    return UltraFragment(

        UltraComponent({
            component: '<div></div>',
            className: [floatingCoversStyles.layer],
            onMount: [getCovers],
            trigger: [
                { subscriber: subsCovers, triggerFunction: onCoversChange },
                { subscriber: SETTINGS_CONTEXT.coverCount.subscribe, triggerFunction: onCoversChange }
            ]
        }),

        TeamEditor(),

        SettingsButton(),

        VisibilityButton(),

        SettingsModal(),

        ConfirmModal(),

        HostedBy(),

        DevBy(),

        ...children

    )

}
