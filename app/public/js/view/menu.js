export default class Menu {
    constructor(audioPlayer) {
        this.element = document.getElementById("menu");
        this.exitGame = document.getElementById("exit-game");
        this.playAgainBtn = document.getElementById("play-again-game");
        this.configBtn = document.getElementById("config");
        this.musicBtn = document.getElementById("music");
        this.soundFxBtn = document.getElementById("sound-fx");
        this.audioPlayer = audioPlayer;
        this.onExitGame = null;
        this.onPlayAgain = null;
    }

    onLoad = () => {
        // this.configBtn.onclick = this.toggleConfig.bind(this);
        this.playAgainBtn.onclick = this.playAgain.bind(this);
        this.exitGame.onclick = this.exit.bind(this);
        this.musicBtn.onclick = this.toggleMusic.bind(this);
        this.soundFxBtn.onclick = this.toggleSoundFx.bind(this);
    };

    playAgain = () => {
        this.onPlayAgain();
        this.audioPlayer.playEffect("button");
    };

    exit = () => {
        this.onExitGame();
        this.playAgainBtn.classList.add("hidden");
        this.audioPlayer.playEffect("button");
    };

    fadeIn = () => {
        this.element.classList.add("fade-in");
    };

    toggleMusic = () => {
        const el = document.getElementById("music-off");
        el.classList.toggle("hidden");
        this.audioPlayer.toggleMusic();
        this.audioPlayer.playEffect("button");
    };

    toggleSoundFx = () => {
        const el = document.getElementById("sound-fx-off");
        el.classList.toggle("hidden");
        this.audioPlayer.toggleSoundFx();
        this.audioPlayer.playEffect("button");
    };

    toggleExitBtnVisibility = () => {
        this.exitGame.classList.toggle("hidden");
    };

    togglePlayAgainBtnVisibility = () => {
        this.playAgainBtn.classList.toggle("hidden");
    };

    bindOnClickExit = (cb) => {
        this.onExitGame = cb;
    };

    bindOnPlayAgain = (cb) => {
        this.onPlayAgain = cb;
    };
}