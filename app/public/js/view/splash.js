export default class Splash {
    constructor() {
        this.startBtn = document.getElementById("start-btn");
        this.element = document.getElementById("splash");
    }

    onLoad = () => {
        this.startBtn.onclick = this.fadeOut.bind(this);
        this.element.ontransitionend = this.close.bind(this);
    };

    fadeOut = () => {
        this.element.classList.add("fade-out");
    };

    close = () => {
        this.element.remove();
    };
}