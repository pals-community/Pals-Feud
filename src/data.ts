import type { IPersistedSettings } from "./types";

export const COMIC_PALS_LOGO = '/2025LogoPodcastArt.webp';

export const DISCORD_ICON = '/discord.webp';

export const APP_NAME = 'Pals Feud';

export const WRON_BUZZER_DURATION = 1.368033 * 1000

export const WRONG_BUZZER_VIDEO = '/videos/wrong-buzzer_2.mp4';

export const FAMILY_FEUD_MUSIC = '/audio/family-feud-theme.mp3';

export const KILLER_MOTH_LEGO = '/avatars/hayden.png'

export const KILLER_MOTH_CHIBI = '/killer_moth_chibi.png'

export const AMIN_AVATAR = '/avatars/amin.webp'

export const STORAGE_KEY = 'comic-pals-feud:settings';

export const MIN_COVERS = 0;

export const MAX_COVERS = 200;

export const DEFAULTS: IPersistedSettings = {
    musicVolume: 0.4,
    sfxVolume: 0.8,
    muted: false,
    coverCount: 50
};

export const BATCH_SIZE = 200;

export const NUM_BATCHES = 2;