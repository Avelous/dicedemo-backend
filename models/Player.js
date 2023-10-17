"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const playerSchema = new mongoose_1.default.Schema({
    gameId: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["ongoing", "paused", "finished"],
        required: true,
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
    type: {
        key: String,
        value: String,
    },
    prize: {
        type: Number,
        required: true,
    },
}, { timestamps: true });
const Player = mongoose_1.default.model("Player", playerSchema);
exports.default = Player;
