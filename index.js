const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5001
const router = require("./router")
const {client_url} =require("./config")

app.use(express.json());

app.use("/user", router)
app.user(cors({
    credentials: true,
    origin: client_url
}))

const start = () => {
    app.listen(PORT, () => console.log("server started"));
}

start()

