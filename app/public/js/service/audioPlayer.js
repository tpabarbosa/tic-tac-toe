const DEFAULT_PLAY_EFFECTS_OPTIONS = { pauseMusic: false };

export default class AudioPlayer {
    _audios = {
        musics: {
            menu: "/audios/menu_music.mp3",
            game: "/audios/game_music.mp3",
        },
        effects: {
            button: "/audios/button_pressed.mp3",
            validMove: "/audios/magic.mp3",
            endGame: "/audios/victory.mp3",
            lostTurn: "/audios/lost_turn.mp3",
        },
    };

    constructor() {
        this.currentMusic = this._audios.musics.menu;
        this.music = new Audio(this.currentMusic);
        this.effects = new Audio();
        this.isMusicPlaying = false;
        this.isEffectsOn = true;
        this.music.loop = true;
        this.music.volume = 0.6;
        this.effects.volume = 0.3;
        this.effects.loop = false;
    }

    changeMusicTo(music) {
        this.currentMusic = this._audios.musics[music];
        this.audio.setAttribute("src", this.currentMusic);
    }

    toggleMusic() {
        if (this.isMusicPlaying) {
            this.music.pause();
            this.isMusicPlaying = false;
            return;
        }
        this.music.play();
        this.isMusicPlaying = true;
    }

    toggleSoundFx() {
        this.isEffectsOn = !this.isEffectsOn;
    }

    playEffect(effect, options = DEFAULT_PLAY_EFFECTS_OPTIONS) {
        const opt = {...DEFAULT_PLAY_EFFECTS_OPTIONS, ...options };
        if (!this.isEffectsOn) {
            return;
        }
        if (opt.pauseMusic && this.isMusicPlaying) {
            this.music.pause();
            this.effects.onended = () => {
                this.music.play();
                this.effects.onended = () => {
                    return;
                };
            };
        }
        this.effects.setAttribute("src", this._audios.effects[effect]);
        this.effects.play();
    }
}