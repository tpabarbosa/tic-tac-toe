const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { join } = require("path");
const { randomUUID } = require("crypto");

const PORT = 3000;
const HOST = "0.0.0.0";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {});

app.use("/", express.static(join(__dirname, "public")));

io.engine.generateID = (req) => {
    return randomUUID();
};

io.on("connection", (socket) => {
    console.log(`Client connected ${socket.id}`);
    socket.emit("connected");
    socket.on("grettings", (data) => {
        console.log(data.message);
    });
    socket.on("disconnecting", () => {
        socket.broadcast.emit("disconnected", { user: socket.id });
        console.log(`Disconnected ${socket.id}`);
    });
});

httpServer.listen(PORT, HOST, () => {
    console.log(`Tic-tac-toe app listening on PORT ${PORT}`);
});