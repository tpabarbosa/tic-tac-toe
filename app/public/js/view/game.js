export default class Game {
    constructor(audioPlayer, eventEmitter) {
        this.element = document.getElementById("game-panel");
        this._audioPlayer = audioPlayer;
        this._eventEmitter = eventEmitter;
        this._status = document.getElementById("status");
        this._timer = document.getElementById("timer");
        this._player1 = {
            area: document.getElementById("player1-area"),
            name: document.getElementById(`player1-name`),
            avatar: document.getElementById(`player1-avatar`),
        };
        this._player2 = {
            area: document.getElementById("player2-area"),
            name: document.getElementById(`player2-name`),
            avatar: document.getElementById(`player2-avatar`),
        };
        this._boardCells = () =>
            Array.from(document.getElementsByClassName("cell"));
        this._gameType = null;
        this._currentPlayer = null;
        this._playersData = null;
    }

    onLoad = () => {
        this._boardCells().forEach((cell) => {
            cell.onclick = this._makeMove.bind(this);
        });
    };

    setPlayersInfo = ({ playersData, currentPlayer }) => {
        this._playersData = playersData;
        this._currentPlayer = currentPlayer;
        this._player1.name.innerText =
            playersData.get(1).name + " " + playersData.get(1).symbol;
        this._player2.name.innerText =
            playersData.get(2).name + " " + playersData.get(2).symbol;
        this._statusMessage(
            `Aguardando ${this._playersData.get(currentPlayer).name} ${
        this._playersData.get(currentPlayer).symbol
      }`
        );
        if (currentPlayer === 1) {
            this._player1.area.classList.add("is-player-turn");
            this._player2.area.classList.remove("is-player-turn");
        } else {
            this._player2.area.classList.add("is-player-turn");
            this._player1.area.classList.remove("is-player-turn");
        }
    };

    setCurrentPlayer = ({ player }) => {
        this._currentPlayer = player;
        this._statusMessage(
            `Aguardando ${this._playersData.get(player).name} ${
        this._playersData.get(player).symbol
      }`
        );
        this._player1.area.classList.toggle("is-player-turn");
        this._player2.area.classList.toggle("is-player-turn");
    };

    onGameStarted = () => {
        this._cleanGameBoard();
    };

    onValidMove = ({ player, cell: [col, row] }) => {
        this._status.TextHTML = " ";
        this._status.style.background = "";
        this._status.style.color = "";
        const cell = document.getElementById(`${col}-${row}`);
        cell.innerText = this._playersData.get(player).symbol;
        this._audioPlayer.playEffect("validMove");
    };

    onEndGame = ({ player, status, info }) => {
        this.currentPlayer = null;
        clearInterval(this.timer);
        if (status === "tie") {
            setTimeout(() => this._statusMessage("Empate!!!"), 200);
            this._audioPlayer.playEffect("endGame", { pauseMusic: true });
            return;
        }

        if (status === "wo") {
            setTimeout(() => {
                this._statusMessage(`Vitória por WO!!!`);
                this._audioPlayer.playEffect("endGame", { pauseMusic: true });
            }, 200);
            return;
        }

        if (status === "win") {
            setTimeout(() => {
                this._statusMessage(`Vitória!!! ${this._playersData.get(player).name}`);
                this._audioPlayer.playEffect("endGame", { pauseMusic: true });
            }, 200);
        }

        info.cells.forEach((item) => {
            const cell = document.getElementById(`${item[0]}-${item[1]}`);
            cell.style.background = "#81e789";
            cell.style.color = "#81e789";
        });
    };

    waitingOponent = () => {
        this._player1.name.innerText = " ";
        this._player2.name.innerText = " ";
        this._statusMessage("Aguardando Oponente");
    };

    _cleanGameBoard = () => {
        this._boardCells().forEach((cell) => {
            cell.style.background = "";
            cell.style.color = "";
            cell.innerHTML = "-";
        });
    };

    updateTimer = ({ timer }) => {
        if (timer > 9) {
            this._timer.innerText = `0:${timer}`;
            return;
        }
        this._timer.innerText = `0:0${timer}`;
    };

    lostTurn = ({ player }) => {
        this._statusMessage(`${this._playersData.get(player).name} passou a vez`);
        this._audioPlayer.playEffect("lostTurn");
    };

    _makeMove = ({ srcElement: { id } }) => {
        const cell = id.split("-");
        const player = this._currentPlayer;
        this._eventEmitter.emit("player-has-made-a-move", { cell, player });
    };

    toggleVisibility = () => {
        this.element.classList.toggle("show-right");
    };

    _statusMessage = (message) => {
        this._status.innerText = message;
        // this._status.style.background = "#afafaf";
        // this._status.style.color = "#262626";
    };
}