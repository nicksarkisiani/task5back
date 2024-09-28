const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5001
const router = require("./router")
const {client_url} =require("./config")

app.use(express.json());

app.use(cors({
    origin: '*',
    credentials: true,
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization"
}));

app.use("/user", router)


const start = () => {
    app.listen(PORT, () => console.log("server started"));
}

start()

