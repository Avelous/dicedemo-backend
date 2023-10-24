"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.channel = exports.app = void 0;
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
var http = require("http");
var Ably = require("ably");
/* CONFIGURATIONS */
dotenv.config();
exports.app = express();
exports.app.use(express.json());
exports.app.use((0, helmet_1.default)());
exports.app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
exports.app.use(morgan("common"));
exports.app.use(bodyParser.json({ limit: "30mb" }));
exports.app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
exports.app.use(cors());
/**Ably Setup */
var ably = new Ably.Realtime({ key: "6aT3Lw.6ED1lg:VVlpr7VcTHfCwrH82plg2IBPkVzYLj0FQl-4RFls3WY" });
exports.channel = ably.channels.get("gameUpdate");
var server = http.createServer(exports.app);
/* MONGOOSE SETUP */
var PORT = process.env.PORT || 6001;
var MONGO_URL = process.env.MONGO_URL || "";
exports.app.use("/admin", admin_1.default);
exports.app.use("/player", player_1.default);
exports.app.use("/game", game_1.default);
var connectWithRetry = function () {
    console.log("connecting");
    mongoose_1.default
        .connect(MONGO_URL)
        .then(function () {
        // app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
        server.listen(PORT, function () { return console.log("Server Connected, Port: ".concat(PORT)); });
    })
        .catch(function (error) {
        console.log("".concat(error, " did not connect"));
        setTimeout(connectWithRetry, 3000);
    });
};
connectWithRetry();
