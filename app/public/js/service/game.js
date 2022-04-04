import Socket from "./socket.js";

const MAX_TIME = 12;
export default class Game {
    constructor(eventEmitter) {
        this._eventEmitter = eventEmitter;
        this._timeLeft = MAX_TIME;
        this._timer = null;
        this._board = null;
        this._type = null;
        this._currentPlayer = null;
        this._player = null;
        this._playersData = new Map();
        this._socket = new Socket(
            this._onOponentDefined,
            this._onOponenteMove,
            this._onOponentExitGame
        );
    }

    _definePlayersNames = (type) => {
        let name1 = "";
        let name2 = "";
        if (type === "PVC") {
            name1 = "Jogador";
            name2 = "Computador";
        }
        if (type === "PVP-offline") {
            name1 = "Jogador 1";
            name2 = "Jogador 2";
        }

        return [name1, name2];
    };

    _onOponentDefined = (player) => {
        this._player = player;
        let name1 = "";
        let name2 = "";
        if (this._player === 1) {
            name1 = "Jogador";
            name2 = "Oponente";
        } else {
            name1 = "Oponente";
            name2 = "Jogador";
        }
        this._currentPlayer = 1;
        this._start([name1, name2]);
    };

    startNewGame = async({ type }) => {
        this._type = type;
        if (type === "PVP-online") {
            this._socket.socket.emit("find-oponent");
            this._eventEmitter.emit("waiting-oponent");
            return;
        }
        if (type !== "PVP-online") {
            this._currentPlayer = Math.floor(Math.random() * 2) + 1;
            const names = this._definePlayersNames(type);
            this._start(names);
        }
    };

    _start = async(names) => {
        this._playersData.set(1, { name: names[0], symbol: "❌" });
        this._playersData.set(2, { name: names[1], symbol: "⭕" });

        this._eventEmitter.emit("players-info", {
            playersData: this._playersData,
            currentPlayer: this._currentPlayer,
        });

        this._board = this._cleanBoard();
        this._isFinished = false;

        clearInterval(this._timer);
        this._timer = this._startTimer();

        await this._computerMakeMove(this._currentPlayer);
    };

    onExitGame = () => {
        this._isFinished = true;
        clearInterval(this._timer);
        this._socket.socket.emit("player-exit-game", {
            player: this._player,
            room: this._socket.roomId,
        });
    };

    _onOponentExitGame = (data) => {
        this._isFinished = true;
        clearInterval(this._timer);
        this._eventEmitter.emit("end-game", {
            status: "wo",
            player: this._player,
        });
    };

    _startTimer = () => {
        this._timeLeft = MAX_TIME;
        this._eventEmitter.emit("time-elapsed", { timer: this._timeLeft });

        return setInterval(async() => {
            this._timeLeft--;
            if (this._timeLeft > 0) {
                this._eventEmitter.emit("time-elapsed", { timer: this._timeLeft });
            } else {
                clearInterval(this._timer);
                this._eventEmitter.emit("time-is-over", {
                    player: this._currentPlayer,
                });
                await this._togglePlayer();
            }
        }, 1000);
    };

    _cleanBoard = () => {
        const board = Array.from(Array(3), () => new Array(3));
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                board[i][j] = 0;
            }
        }
        return board;
    };

    _onOponenteMove = ({ cell, player }) => {
        if (this._type === "PVP-online" && player === this._player) {
            return;
        }
        this._makeMove({ cell, player });
    };

    playerMakeMove = async({ cell, player }) => {
        if (this._type === "PVC" && player === 2) {
            return;
        }
        if (this._type === "PVP-online" && player !== this._player) {
            return;
        }
        this._makeMove({ cell, player });
    };

    _makeMove = async({ cell, player }) => {
        clearInterval(this._timer);
        const [row, col] = cell;

        if (!this._isCellAvailable(row, col) || this._isFinished) {
            return;
        }

        this._board[row][col] = player;
        this._eventEmitter.emit("move-is-valid", { player, cell });
        if (this._type === "PVP-online" && this._player === player) {
            this._socket.socket.emit("player-made-a-move", {
                player,
                cell,
                roomId: this._socket.roomId,
            });
        }

        const { status, info } = this.checkGameStatus();
        if (status === "win") {
            this._eventEmitter.emit("end-game", { status, player, info });
            this._isFinished = true;
            return;
        }

        if (status === "tie") {
            this._eventEmitter.emit("end-game", { status: "tie" });
            this._isFinished = true;
            return;
        }

        if (!this._isFinished) {
            await this._togglePlayer();
        }
    };

    _togglePlayer = async() => {
        const player = this._currentPlayer;
        this._currentPlayer = player === 1 ? 2 : 1;
        this._timer = this._startTimer();

        this._eventEmitter.emit("current-player", { player: this._currentPlayer });
        await this._computerMakeMove(2);
    };

    _timeout = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    };

    _computerMakeMove = async(player) => {
        if (this._isComputerTurn()) {
            const time = Math.floor(Math.random() * 4000) + 400;
            await this._timeout(time);
            this._makeMove({...this._computerDecision(), player });
        }
    };

    _isComputerTurn = () => {
        return (
            this._type === "PVC" && this._currentPlayer === 2 && !this._isFinished
        );
    };

    _computerDecision = () => {
        let cell = [];
        do {
            cell = this._getRandomCell();
        } while (this._board[cell[0]][cell[1]] !== 0);
        return { cell };
    };

    _getRandomCell = () => {
        const row = Math.floor(Math.random() * 3);
        const col = Math.floor(Math.random() * 3);
        return [row, col];
    };

    _isCellAvailable = (row, col) => {
        return this._board[row][col] === 0;
    };

    checkGameStatus = () => {
        const player = this._currentPlayer;
        let result = { status: "playing", info: { cells: [] } };
        for (let i = 0; i < 3; i++) {
            const row = this._board[i];
            if (row[0] === player && row[1] === player && row[2] === player) {
                result.status = "win";
                result.info = {
                    cells: [
                        [i, 0],
                        [i, 1],
                        [i, 2],
                    ],
                };
                break;
            }
        }
        for (let j = 0; j < 3; j++) {
            if (
                this._board[0][j] === player &&
                this._board[1][j] === player &&
                this._board[2][j] === player
            ) {
                result.status = "win";
                result.info = {
                    cells: [
                        [0, j],
                        [1, j],
                        [2, j],
                    ],
                };
                break;
            }
        }

        if (
            this._board[0][0] === player &&
            this._board[1][1] === player &&
            this._board[2][2] === player
        ) {
            result.status = "win";
            result.info = {
                cells: [
                    [0, 0],
                    [1, 1],
                    [2, 2],
                ],
            };
        }

        if (
            this._board[0][2] === player &&
            this._board[1][1] === player &&
            this._board[2][0] === player
        ) {
            result.status = "win";
            result.info = {
                cells: [
                    [0, 2],
                    [1, 1],
                    [2, 0],
                ],
            };
        }

        let hasCellLeft = false;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this._board[i][j] === 0) {
                    hasCellLeft = true;
                    break;
                }
            }
            if (hasCellLeft) {
                break;
            }
        }

        if (!hasCellLeft && result.status !== "win") {
            result.status = "tie";
        }

        return result;
    };
}