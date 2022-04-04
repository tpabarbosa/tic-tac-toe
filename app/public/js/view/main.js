export default class Main {
    constructor(audioPlayer) {
        this.element = document.getElementById("main-panel");
        this.startPVPOfflineBtn = document.getElementById("PVP-offline");
        this.startPVPOnlineBtn = document.getElementById("PVP-online");
        this.startPVCBtn = document.getElementById("PVC");
        this.audioPlayer = audioPlayer;
        this.onChoseGameType = null;
    }

    bindOnChoseGameType = (cb) => {
        this.onChoseGameType = cb;
    };

    onLoad = () => {
        this.startPVPOfflineBtn.onclick = this.startGame.bind(this);
        this.startPVPOnlineBtn.onclick = this.startGame.bind(this);
        this.startPVCBtn.onclick = this.startGame.bind(this);
    };

    startGame = ({ srcElement: { id } }) => {
        this.audioPlayer.playEffect("button");
        if (!this.onChoseGameType) {
            return;
        }
        this.onChoseGameType(id);
    };

    toggleVisibility = () => {
        this.element.classList.toggle("hide-left");
    };

    fadeIn = () => {
        this.element.classList.add("fade-in");
    };
}