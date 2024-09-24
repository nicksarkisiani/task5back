const express = require('express');

const app = express();
const PORT = 5000
const router = require("./router")

app.use(express.json());

app.use("/user", router)

const start = () => {
    app.listen(PORT, () => console.log("server started"));
}

start()

