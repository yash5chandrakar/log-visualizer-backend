const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();
const startLogGenerator = require("./utils/logController.js");

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const app = express();
app.use(bodyParser.raw());
app.use(bodyParser.json({ limit: "20mb" }));
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(cors({
    origin: "*", // or '*' for all, or use an array
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.get("/", (req, res) => {
    return res.status(200).send("Log Visualizer App by Yash Chandrakar")
})

let routes = require("./routes/index");

app.use("/api", routes);

const port = process.env.PORT || 8000

startLogGenerator()

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});