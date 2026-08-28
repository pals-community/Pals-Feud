import { UltraComponent, UltraFragment, type UltraLightElement } from "ultra-light-js";
import { SettingsButton } from "./settings-button/settings-button";
import { VisibilityButton } from "./visibility-button/visibility-button";
import { SettingsModal } from "./settings-modal/settings-modal";
import { ConfirmModal } from "./confirm-modal/confirm-modal";
import { HostedBy } from "./hosted-by/hosted-by";
import { SETTINGS_CONTEXT } from "../context/settings.context";
import { Lane } from "./floating-covers/lane";
import { COVERS_CTX } from "../context/covers.context";
import floatingCoversStyles from "./floating-covers/floating-covers.module.css";
import { TeamEditor } from "./team-editor/team-editor";
import { DevBy } from "./dev-by/dev-by";
import { AdModal } from "./ad-modal/ad-modal";
import { EmojiModal } from "./emoji-modal/emoji-modal";

export function Layout(
    ...children: UltraLightElement[]
) {

    const onCoversChange = ($div: HTMLElement) => {
        $div.replaceChildren(
            ...COVERS_CTX.pick(SETTINGS_CONTEXT.coverCount.get())
                .map((src, index) => Lane({ src, index }))
        );
    };

    return UltraFragment(

        UltraComponent({
            component: '<div></div>',
            className: [floatingCoversStyles.layer],
            onMount: [() => void COVERS_CTX.load()],
            trigger: [
                { subscriber: COVERS_CTX.pool.subscribe, triggerFunction: onCoversChange },
                { subscriber: SETTINGS_CONTEXT.coverCount.subscribe, triggerFunction: onCoversChange }
            ]
        }),

        TeamEditor(),

        SettingsButton(),

        VisibilityButton(),

        SettingsModal(),

        ConfirmModal(),

        AdModal(),

        EmojiModal(),

        HostedBy(),

        DevBy(),

        ...children

    )

}
