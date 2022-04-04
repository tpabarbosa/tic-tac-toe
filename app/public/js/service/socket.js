export default class Socket {
    constructor(onOponentDefined, onOponentMove, onOponentExitGame) {
        this.socket = io();
        this.listenSocket();
        this.isConnected = false;
        this._onOponentDefined = onOponentDefined;
        this._onOponentMove = onOponentMove;
        this._onOponentExitGame = onOponentExitGame;
        this.roomId;
    }

    listenSocket = () => {
        if (!this.isConnected) {
            this.socket.on("connected", () => {
                this.socket.emit("grettings", {
                    message: `I'm in ${this.socket.id}`,
                });
                this.isConnected = true;
            });
        }

        this.socket.on("disconnected", (data) => {});

        this.socket.on("game-started", (data) => {
            this.roomId = data.roomId;
            if (data.player1 === this.socket.id) {
                this._onOponentDefined(1);
            } else {
                this._onOponentDefined(2);
            }
        });

        this.socket.on("waiting-an-oponent", (data) => {});

        this.socket.on("oponent-made-a-move", (data) => {
            this._onOponentMove(data);
        });

        this.socket.on("oponent-exit-game", (data) => {
            this._onOponentExitGame(data);
        });
    };
}