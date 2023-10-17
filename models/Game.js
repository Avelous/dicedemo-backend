"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var gameSchema = new mongoose_1.default.Schema({
    adminAddress: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["lobby", "ongoing", "paused", "finished"],
        required: true,
    },
    inviteCode: {
        type: String,
        required: true,
    },
    maxPlayers: {
        type: Number,
        required: true,
        min: 5,
        max: 30,
    },
    diceCount: {
        type: Number,
        required: true,
        min: 1,
        max: 64,
    },
    mode: {
        type: String,
        enum: ["auto", "manual"],
        required: true,
    },
    privateKey: {
        type: String,
        required: true,
    },
    hiddenChars: {
        type: Object,
        required: true,
    },
    prize: {
        type: Number,
        required: true,
    },
    players: {
        type: [String],
        default: [],
        validate: {
            validator: function (value) {
                var uniqueStrings = [];
                value.forEach(function (item) {
                    if (!uniqueStrings.includes(item)) {
                        uniqueStrings.push(item);
                    }
                });
                return uniqueStrings.length === value.length;
            },
            message: "The players array must contain unique strings.",
        },
    },
    winner: {
        type: String,
    },
}, { timestamps: true });
var Game = mongoose_1.default.model("Game", gameSchema);
exports.default = Game;
