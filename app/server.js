const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { join } = require("path");
const { randomUUID } = require("crypto");

const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {});
let players = new Array();
const rooms = new Array();
const wantsToPlay = new Array();

app.use("/", express.static(join(__dirname, "public")));

io.engine.generateID = (req) => {
    return randomUUID();
};

io.on("connection", (socket) => {
    console.log(`Client connected ${socket.id}`);
    socket.emit("connected");
    players.push({ id: socket.id, socket });
    console.log("players connected", players.length);
    socket.on("grettings", (data) => {});
    socket.on("disconnecting", () => {
        socket.broadcast.emit("disconnected", { user: socket.id });
        players = players.filter((player) => player.id !== socket.id);
        console.log("players after-disconection", players.length);
    });
    socket.on("player-made-a-move", (data) => {
        console.log("player-made move", data);
        socket.to(data.roomId).emit("oponent-made-a-move", data);
    });
    socket.on("player-exit-game", (data) => {
        console.log("player-exit-game: server", data);
        socket.to(data.room).emit("oponent-exit-game", data);
    });
    socket.on("find-oponent", () => {
        console.log("wants to play", wantsToPlay.length);
        if (wantsToPlay.length > 0) {
            try {
                const player2Id = wantsToPlay.shift();
                const roomId = `room-${randomUUID()}`;
                rooms.push({
                    player1: socket.id,
                    player2: player2Id,
                    active: true,
                    roomId,
                });
                socket.join(roomId);
                const player2 = players.filter((player) => player.id === player2Id);
                player2[0].socket.join(roomId);
                socket.emit("game-started", {
                    player1: socket.id,
                    player2: player2Id,
                    roomId,
                });
                socket.to(roomId).emit("game-started", {
                    player1: socket.id,
                    player2: player2Id,
                    roomId,
                });
                console.log("wants to play", wantsToPlay.length);
            } catch (e) {
                console.log(e.message);
            }
        } else {
            wantsToPlay.push(socket.id);
            socket.emit("waiting-an-oponent");
        }
    });
});

httpServer.listen(PORT, () => {
    console.log(`Tic-tac-toe app listening on PORT ${PORT}`);
});