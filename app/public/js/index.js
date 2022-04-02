import View from "./view.js";
import Game from "./game.js";
import Controller from "./controller.js";
import EventEmitter from "./eventEmitter.js";

Controller.initialize({
    eventEmitter: new EventEmitter(),
    game: new Game(),
    view: new View(),
});