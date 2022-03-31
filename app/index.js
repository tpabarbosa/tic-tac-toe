const express = require("express");
const { join } = require("path");
const app = express();
const port = 3000;

app.use("/", express.static(join(__dirname, "public")));

app.listen(port, () => {
    console.log(`Tic-tac-toe app listening on port ${port}`);
});