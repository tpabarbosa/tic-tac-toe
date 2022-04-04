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

    onLoad = () => {
        const events = [
            ["start-new-game", this.game.startNewGame],
            ["players-info", this.view.setPlayersInfo],
            // ["game-started", this.view.onGameStarted],
            ["current-player", this.view.setCurrentPlayer],
            ["player-has-made-a-move", this.game.playerMakeMove],
            ["time-elapsed", this.view.updateTimer],
            ["time-is-over", this.view.lostTurn],
            ["move-is-valid", this.view.onValidMove],
            ["end-game", this.view.onEndGame],
            ["exit-game", this.game.onExitGame],
            ["waiting-oponent", this.view.waitingOponent],
        ];

        events.forEach((event) => {
            this.eventEmitter.addListener(event[0], event[1]);
        });
        // this.game.onLoad();
    };
}