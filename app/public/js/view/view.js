import Splash from "./splash.js";
import Main from "./main.js";
import Menu from "./menu.js";
import Game from "./game.js";
import AudioPlayer from "../service/audioPlayer.js";

export default class View {
    constructor({ eventEmitter, splash, main, menu, audioPlayer, game }) {
        this._eventEmitter = eventEmitter;
        this._splash = splash;
        this._main = main;
        this._menu = menu;
        this._game = game;
        this._audioPlayer = audioPlayer;
        this._gameType = null;
    }

    static initialize(eventEmitter) {
        const player = new AudioPlayer();
        const view = new View({
            eventEmitter,
            splash: new Splash(),
            main: new Main(player),
            menu: new Menu(player),
            game: new Game(player, eventEmitter),
            audioPlayer: player,
        });
        view._onLoad();
        return view;
    }

    _onLoad = () => {
        this._splash.onLoad();
        this._main.onLoad();
        this._menu.onLoad();
        this._game.onLoad();
        this._menu.bindOnClickExit(this._handleGameToMainTransition);
        this._menu.bindOnPlayAgain(this._handleOnPlayAgain);
        this._splash.element.ontransitionstart =
            this._handleSplashToMainTransition.bind(this);
        this._main.bindOnChoseGameType(this._handleMainToGameTransition);
    };

    setPlayersInfo = (data) => {
        this._game.setPlayersInfo(data);
    };

    onGameStarted = () => {
        this._game.onGameStarted();
    };

    onValidMove = (data) => {
        this._game.onValidMove(data);
    };

    onEndGame = (data) => {
        this._game.onEndGame(data);
        this._menu.togglePlayAgainBtnVisibility();
    };

    setCurrentPlayer = (data) => {
        this._game.setCurrentPlayer(data);
    };

    updateTimer = (data) => {
        this._game.updateTimer(data);
    };

    lostTurn = (data) => {
        this._game.lostTurn(data);
    };

    waitingOponent = () => {
        this._game.waitingOponent();
    };

    _handleOnPlayAgain = () => {
        this._eventEmitter.emit("start-new-game", { type: this._gameType });
        this._menu.togglePlayAgainBtnVisibility();
        this._game.onGameStarted();
    };

    _handleSplashToMainTransition = () => {
        this._main.fadeIn();
        this._menu.fadeIn();
        this._audioPlayer.toggleMusic();
    };

    _handleMainToGameTransition = (type) => {
        this._setElementsVisibility();
        this._gameType = type;
        this._game.onGameStarted();
        this._eventEmitter.emit("start-new-game", { type });
    };

    _handleGameToMainTransition = () => {
        this._setElementsVisibility();
        this._eventEmitter.emit("exit-game");
    };

    _setElementsVisibility = () => {
        this._main.toggleVisibility();
        this._game.toggleVisibility();
        this._menu.toggleExitBtnVisibility();
    };
}