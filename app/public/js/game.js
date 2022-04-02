export default class Game {
    constructor() {
        this.timeLeft = 59;
        this.timer = null;
    }

    setEventEmitter = (eventEmitter) => {
        this._events = eventEmitter;
    };

    startGame = async({ type }) => {
        this.type = type;
        this.currentPlayer = Math.floor(Math.random() * 2) + 1;
        this._events.emit("current-player", this.currentPlayer);
        this.board = this.cleanBoard();
        this.isFinished = false;
        clearInterval(this.timer);
        this.timer = this.startTimer();
        await this.computerMakeMove(this.currentPlayer);
    };

    startTimer = () => {
        this.timeLeft = 12;
        this._events.emit("time-elapsed", this.timeLeft);
        return setInterval(async() => {
            this.timeLeft = this.timeLeft - 1;
            if (this.timeLeft > 0) {
                this._events.emit("time-elapsed", this.timeLeft);
            } else {
                clearInterval(this.timer);
                this._events.emit("time-is-over", this.currentPlayer);
                await this.togglePlayer();
            }
        }, 1000);
    };

    cleanBoard = () => {
        const board = Array.from(Array(3), () => new Array(3));
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                board[i][j] = 0;
            }
        }
        return board;
    };

    playerMakeMove = async({ cell, player }) => {
        if (this.type === "PVC" && player === 2) {
            return;
        }
        this.makeMove({ cell, player });
    };

    makeMove = async({ cell, player }) => {
        clearInterval(this.timer);
        const [row, col] = cell;

        if (!this.isCellAvailable(row, col) || this.isFinished) {
            return;
        }

        this.board[row - 1][col - 1] = player;
        this._events.emit("move-is-valid", { player, cell });

        const { status, info } = this.checkGameStatus();
        if (status === "win") {
            this._events.emit("end-game", { status, player, info });
            this.isFinished = true;
            return;
        }

        if (status === "tie") {
            this._events.emit("end-game", { status: "tie" });
            this.isFinished = true;
            return;
        }

        if (!this.isFinished) {
            await this.togglePlayer();
        }
    };

    togglePlayer = async() => {
        const player = this.currentPlayer;
        this.currentPlayer = player === 1 ? 2 : 1;
        this.timer = this.startTimer();
        this._events.emit("current-player", this.currentPlayer);
        await this.computerMakeMove(2);
    };

    timeout = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    };

    computerMakeMove = async(player) => {
        if (this.isComputerMove()) {
            const time = Math.floor(Math.random() * 3000) + 400;
            await this.timeout(time);
            this.makeMove({...this.computerDecision(), player });
        }
    };

    isComputerMove = () => {
        return this.type === "PVC" && this.currentPlayer === 2 && !this.isFinished;
    };

    computerDecision = () => {
        let cell = [];
        do {
            cell = this.getRandomCell();
        } while (this.board[cell[0] - 1][cell[1] - 1] !== 0);
        return { cell };
    };

    getRandomCell = () => {
        const row = Math.floor(Math.random() * 3) + 1;
        const col = Math.floor(Math.random() * 3) + 1;
        return [row, col];
    };

    isCellAvailable = (row, col) => {
        return this.board[row - 1][col - 1] === 0;
    };

    checkGameStatus = () => {
        const player = this.currentPlayer;
        let result = { status: "playing", info: { cells: [] } };
        for (let i = 0; i < 3; i++) {
            const row = this.board[i];
            if (row[0] === player && row[1] === player && row[2] === player) {
                result.status = "win";
                result.info = {
                    cells: [
                        [i + 1, 1],
                        [i + 1, 2],
                        [i + 1, 3],
                    ],
                };
                break;
            }
        }
        for (let j = 0; j < 3; j++) {
            if (
                this.board[0][j] === player &&
                this.board[1][j] === player &&
                this.board[2][j] === player
            ) {
                result.status = "win";
                result.info = {
                    cells: [
                        [1, j + 1],
                        [2, j + 1],
                        [3, j + 1],
                    ],
                };
                break;
            }
        }

        if (
            this.board[0][0] === player &&
            this.board[1][1] === player &&
            this.board[2][2] === player
        ) {
            result.status = "win";
            result.info = {
                cells: [
                    [1, 1],
                    [2, 2],
                    [3, 3],
                ],
            };
        }

        if (
            this.board[0][2] === player &&
            this.board[1][1] === player &&
            this.board[2][0] === player
        ) {
            result.status = "win";
            result.info = {
                cells: [
                    [1, 3],
                    [2, 2],
                    [3, 1],
                ],
            };
        }

        let hasCellLeft = false;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.board[i][j] === 0) {
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
            console.log(result);
        }

        return result;
    };
}