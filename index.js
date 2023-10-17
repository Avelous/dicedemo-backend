"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var mongoose_1 = require("mongoose");
var cors = require("cors");
var dotenv = require("dotenv");
var helmet_1 = require("helmet");
var morgan = require("morgan");
var admin_1 = require("./routes/admin");
var player_1 = require("./routes/player");
var game_1 = require("./routes/game");
/* CONFIGURATIONS */
dotenv.config();
var app = express();
app.use(express.json());
app.use((0, helmet_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
/* MONGOOSE SETUP */
var PORT = process.env.PORT || 6001;
var MONGO_URL = process.env.MONGO_URL || "";
app.use("/admin", admin_1.default);
app.use("/player", player_1.default);
app.use("/game", game_1.default);
var connectWithRetry = function () {
    console.log("connecting");
    mongoose_1.default
        .connect(MONGO_URL)
        .then(function () {
        app.listen(PORT, function () { return console.log("Server Port: ".concat(PORT)); });
    })
        .catch(function (error) {
        console.log("".concat(error, " did not connect"));
        setTimeout(connectWithRetry, 3000);
    });
};
connectWithRetry();
