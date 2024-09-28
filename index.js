const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5001
const router = require("./router")
const {client_url} =require("./config")

app.use(express.json());

app.use("/user", router)
app.use(cors({
    origin: 'http://localhost:5173', // Разрешить запросы с твоего фронта
    credentials: true, // Если используешь куки или авторизацию
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization"
}));
app.options('*', cors());

const start = () => {
    app.listen(PORT, () => console.log("server started"));
}

start()

