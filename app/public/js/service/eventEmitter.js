export default class EventEmitter {
    constructor() {
        this.events = new Map();
    }

    addListener = (name, listener) => {
        if (typeof listener !== "function") {
            throw new TypeError(`The listener must be a function.`);
        }

        if (!this.events.has(name)) {
            this.events.set(name, [listener]);
            return;
        }

        const listeners = this.events.get(name);
        this.events.set(name, [...listeners, listener]);
    };

    on = (name, listener) => {
        return this.addListener(name, listener);
    };

    removeListener = (name, listenerToRemove) => {
        if (!this.events.has(name)) {
            throw new Error(`Can't remove listener, event ${name} doesn't exist`);
        }

        const listeners = this.events.get(name).filter((listener) => {
            return listener != listenerToRemove;
        });

        this.events.set(name, [...listeners]);
    };

    off = (name, listenerToRemove) => {
        return this.removeListener(name, listenerToRemove);
    };

    // once = (name, listener) => {}

    emit = (name, ...data) => {
        if (!this.events.has(name)) {
            throw new Error(`Can't emit an event. Event ${name} does not exist.`);
        }

        this.events.get(name).forEach((cb) => {
            cb(...data);
        });
    };

    listenerCount = (name) => {
        if (!this.events.has(name)) {
            return 0;
        }
        return this.events.get(name).length;
    };

    rawListeners = (name) => {
        if (!this.events.has(name)) {
            return [];
        }
        return this.events.get(name);
    };
}