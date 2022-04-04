import View from "./view/view.js";
import Game from "./service/game.js";
import Controller from "./controller.js";
import EventEmitter from "./service/eventEmitter.js";

const eventEmitter = new EventEmitter();
Controller.initialize({
    eventEmitter,
    game: new Game(eventEmitter),
    view: View.initialize(eventEmitter),
});