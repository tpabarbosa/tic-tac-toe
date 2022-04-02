const socket = io();
const panelEl = document.getElementById("panel");
const gameEl = document.getElementById("game");

socket.on("connected", () => {
    socket.emit("grettings", { message: "I'm in..." });
    console.log(`Socket connected ${socket.id}`);
});

socket.on("disconnected", (data) => {
    console.log(`User disconnected ${data.user}`);
});

const startGame = (type) => {
    switch (type.id) {
        case "PVP-local":
            panelEl.classList.add("hidden");
            gameEl.classList.remove("hidden");
            break;
        case "PVP-online":
            panelEl.classList.add("hidden");
            gameEl.classList.remove("hidden");
            break;
        case "PVC":
            panelEl.classList.add("hidden");
            gameEl.classList.remove("hidden");
            break;
        default:
    }
};