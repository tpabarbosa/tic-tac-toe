const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { join } = require("path");
const IO = require("./src/socket.js");

const PORT = process.env.PORT || 3000;

const app = express();
const httpServer = createServer(app);
const ioServer = new Server(httpServer, {});

app.use("/", express.static(join(__dirname, "public")));

const myIo = new IO(ioServer);

httpServer.listen(PORT, () => {
    console.log(`Tic-tac-toe app listening on PORT ${PORT}`);
});