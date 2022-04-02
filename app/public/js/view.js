export default class View {
    constructor() {
        this.mainPanel = document.getElementById("main-panel");
        this.gamePanel = document.getElementById("game-panel");
        this.exitGameBtn = document.getElementById("exit-game");
        this.status = document.getElementById("status");
        this.player1Avatar = document.getElementById(`player1-avatar`);
        this.player2Avatar = document.getElementById(`player2-avatar`);
        this.player1 = document.getElementById(`player1-name`);
        this.player2 = document.getElementById(`player2-name`);
        this.timer1 = document.getElementById("player1-timer");
        this.timer2 = document.getElementById("player2-timer");
        this.title = document.getElementById("title");
        this.startPVPLocal = document.getElementById("PVP-local");
        this.startPVPOnline = document.getElementById("PVP-online");
        this.startPVC = document.getElementById("PVC");
        this.boardCells = () => Array.from(document.getElementsByClassName("cell"));
        this.gameType = null;
        this.currentPlayer = null;
        this.name = new Map();
    }

    setEventEmitter = (eventEmitter) => {
        this._events = eventEmitter;
    };

    onLoad = () => {
        this.startPVPLocal.onclick = this.startGame.bind(this);
        this.startPVPOnline.onclick = this.startGame.bind(this);
        this.startPVC.onclick = this.startGame.bind(this);
        this.exitGameBtn.onclick = this.exitGame.bind(this);
        this.boardCells().forEach((cell) => {
            cell.onclick = this.makeMove.bind(this);
        });
    };

    startGame = ({ srcElement: { id } }) => {
        this.setPanels(false);
        this.cleanGameBoard();
        this.gameType = id;
        this.name.set(1, "Jogador 1");
        this.name.set(2, id === "PVC" ? "Computador" : "Jogador 2");
        console.log(this.name);
        this.setCurrentPlayer(2);
        this._events.emit("start-game", { type: id });
    };

    lostTurn = (player) => {
        this.statusMessage(`${this.name.get(player)} passou a vez`);
    };

    statusMessage = (message) => {
        this.status.innerText = message;
        this.status.style.background = "#afafaf";
        this.status.style.color = "#262626";
    };

    updateTimer = (time) => {
        if (time > 9) {
            this.timer1.innerHTML = `0:${time}`;
            this.timer2.innerHTML = `0:${time}`;
            return;
        }
        this.timer1.innerHTML = `0:0${time}`;
        this.timer2.innerHTML = `0:0${time}`;
    };

    exitGame = () => {
        this.setPanels(true);
        this.gameType = null;
        this.currentPlayer = null;
    };

    cleanGameBoard = () => {
        this.boardCells().forEach((cell) => {
            cell.style.background = "";
            cell.style.color = "";
            cell.innerHTML = "-";
        });
    };

    makeMove = ({ srcElement: { id } }) => {
        const cell = id.split("-");
        const player = this.currentPlayer;
        this._events.emit("player-has-made-a-move", { cell, player });
    };

    onValidMove = ({ player, cell: [col, row] }) => {
        this.status.innerHTML = " ";
        this.status.style.background = "";
        this.status.style.color = "";
        const cell = document.getElementById(`${col}-${row}`);
        cell.innerHTML = player === 1 ? "❌" : "⭕";
    };

    setCurrentPlayer = (player) => {
        this.currentPlayer = player;
        const name = this.name.get(player);
        console.log(player);
        if (player === 1) {
            this.player1.innerHTML = `${name} ❌`;
            this.timer1.style.background = "#afafaf";
            this.timer2.style.background = "";
        } else {
            this.player2.innerHTML = `${name} ⭕`;
            if (this.gameType === "PVC") {
                this.player2Avatar.innerHTML = "🤖";
            } else {
                this.player2Avatar.innerHTML = "🐱";
            }
            this.timer2.style.background = "#afafaf";
            this.timer1.style.background = "";
        }
    };

    onEndGame = ({ player, status, info }) => {
        this.currentPlayer = null;
        clearInterval(this.timer);
        if (status === "tie") {
            setTimeout(() => this.statusMessage("Empate"), 200);
            return;
        }

        if (status === "win") {
            setTimeout(
                () => this.statusMessage(`Vitória do ${this.name.get(player)}`),
                200
            );
        }

        info.cells.forEach((item) => {
            const cell = document.getElementById(`${item[0]}-${item[1]}`);
            cell.style.background = "#81e789";
            cell.style.color = "#81e789";
        });
    };

    setPanels = (showMain = true) => {
        if (showMain) {
            this.mainPanel.classList.remove("hidden");
            this.gamePanel.classList.add("hidden");
            this.title.classList.remove("hidden");
            this.exitGameBtn.classList.add("hidden");
            this.status.classList.add("hidden");
            return;
        }
        this.mainPanel.classList.add("hidden");
        this.gamePanel.classList.remove("hidden");
        this.title.classList.add("hidden");
        this.exitGameBtn.classList.remove("hidden");
        this.status.classList.remove("hidden");
        this.status.innerHTML = " ";
        this.status.style.background = "";
        this.status.style.color = "";
    };
}