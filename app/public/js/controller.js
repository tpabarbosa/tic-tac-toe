export default class Controller {
    constructor({ eventEmitter, game, view }) {
        this.eventEmitter = eventEmitter;
        this.game = game;
        this.view = view;
    }

    static initialize(dependencies) {
        const controller = new Controller(dependencies);
        controller.onLoad();
        return controller;
    }

    setEventListeners = () => {
        // game Events
        this.eventEmitter.addListener("start-game", this.game.startGame);
        this.eventEmitter.addListener(
            "player-has-made-a-move",
            this.game.playerMakeMove
        );

        // view Events
        this.eventEmitter.addListener("current-player", this.view.setCurrentPlayer);
        this.eventEmitter.addListener("time-elapsed", this.view.updateTimer);
        this.eventEmitter.addListener("time-is-over", this.view.lostTurn);
        this.eventEmitter.addListener("move-is-valid", this.view.onValidMove);
        this.eventEmitter.addListener("end-game", this.view.onEndGame);
    };

    onLoad = () => {
        this.setEventListeners();
        this.game.setEventEmitter(this.eventEmitter);
        this.view.setEventEmitter(this.eventEmitter);
        this.view.onLoad();
    };
}