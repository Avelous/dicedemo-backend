"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.kickPlayer = exports.changePrize = exports.changeGameMode = exports.endGame = exports.resumeGame = exports.pauseGame = exports.createGame = void 0;
var Game_1 = require("../models/Game");
var Invites_1 = require("../models/Invites");
var backend_config_1 = require("../backend.config");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
function generateUniqueInvite(length) {
    return __awaiter(this, void 0, void 0, function () {
        var invites, newInvites, characters, invite, existingCodes, i, randomIndex;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Invites_1.default.findOne()];
                case 1:
                    invites = _a.sent();
                    if (!!invites) return [3 /*break*/, 3];
                    newInvites = new Invites_1.default({
                        codes: [],
                    });
                    return [4 /*yield*/, newInvites.save()];
                case 2:
                    invites = _a.sent();
                    _a.label = 3;
                case 3:
                    characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                    invite = "";
                    existingCodes = (invites === null || invites === void 0 ? void 0 : invites.codes) || [];
                    _a.label = 4;
                case 4:
                    if (!true) return [3 /*break*/, 7];
                    for (i = 0; i < length; i++) {
                        randomIndex = Math.floor(Math.random() * characters.length);
                        invite += characters.charAt(randomIndex);
                    }
                    if (!!existingCodes.includes(invite)) return [3 /*break*/, 6];
                    existingCodes.push(invite);
                    return [4 /*yield*/, Invites_1.default.findByIdAndUpdate(invites === null || invites === void 0 ? void 0 : invites.id, {
                            codes: existingCodes,
                        })];
                case 5:
                    _a.sent();
                    return [2 /*return*/, invite];
                case 6:
                    invite = "";
                    return [3 /*break*/, 4];
                case 7: return [2 /*return*/];
            }
        });
    });
}
var createGame = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, maxPlayers, diceCount, hiddenChars, privateKey, prize, mode, adminAddress, salt, newGame, _b, token, savedGame, err_1;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 4, , 5]);
                _a = req.body, maxPlayers = _a.maxPlayers, diceCount = _a.diceCount, hiddenChars = _a.hiddenChars, privateKey = _a.privateKey, prize = _a.prize, mode = _a.mode, adminAddress = _a.adminAddress;
                return [4 /*yield*/, bcrypt.genSalt()];
            case 1:
                salt = _d.sent();
                _b = Game_1.default.bind;
                _c = {
                    adminAddress: adminAddress,
                    status: "ongoing"
                };
                return [4 /*yield*/, generateUniqueInvite(8)];
            case 2:
                newGame = new (_b.apply(Game_1.default, [void 0, (_c.inviteCode = _d.sent(),
                        _c.maxPlayers = maxPlayers,
                        _c.diceCount = diceCount,
                        _c.mode = mode,
                        _c.privateKey = privateKey,
                        _c.hiddenChars = hiddenChars,
                        _c.prize = prize,
                        _c)]))();
                token = void 0;
                if (backend_config_1.JWT_SECRET)
                    token = jwt.sign({ address: adminAddress }, backend_config_1.JWT_SECRET);
                return [4 /*yield*/, newGame.save()];
            case 3:
                savedGame = _d.sent();
                res.status(201).json({ token: token, game: savedGame });
                return [3 /*break*/, 5];
            case 4:
                err_1 = _d.sent();
                res.status(500).json({ error: err_1.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.createGame = createGame;
var pauseGame = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var gameId, game, updatedGame, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                gameId = req.params.gameId;
                return [4 /*yield*/, Game_1.default.findById(gameId)];
            case 1:
                game = _a.sent();
                if (!game) {
                    return [2 /*return*/, res.status(404).json({ error: "Game not found." })];
                }
                if (game.status !== "ongoing") {
                    return [2 /*return*/, res.status(400).json({ error: "Game is not ongoing." })];
                }
                // Update game status to "paused"
                game.status = "paused";
                return [4 /*yield*/, game.save()];
            case 2:
                updatedGame = _a.sent();
                res.status(200).json(updatedGame);
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                res.status(500).json({ error: err_2.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.pauseGame = pauseGame;
var resumeGame = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var gameId, game, updatedGame, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                gameId = req.params.gameId;
                return [4 /*yield*/, Game_1.default.findById(gameId)];
            case 1:
                game = _a.sent();
                if (!game) {
                    return [2 /*return*/, res.status(404).json({ error: "Game not found." })];
                }
                if (game.status === "finished") {
                    return [2 /*return*/, res.status(400).json({ error: "Game has ended." })];
                }
                if (game.status !== "paused") {
                    return [2 /*return*/, res.status(400).json({ error: "Game is not paused." })];
                }
                // Update game status to "ongoing"
                game.status = "ongoing";
                return [4 /*yield*/, game.save()];
            case 2:
                updatedGame = _a.sent();
                res.status(200).json(updatedGame);
                return [3 /*break*/, 4];
            case 3:
                err_3 = _a.sent();
                res.status(500).json({ error: err_3.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.resumeGame = resumeGame;
var endGame = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, game, winner, updatedGame, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = req.params.id;
                return [4 /*yield*/, Game_1.default.findById(id)];
            case 1:
                game = _a.sent();
                if (!game) {
                    return [2 /*return*/, res.status(404).json({ error: "Game not found." })];
                }
                if (game.status === "finished") {
                    return [2 /*return*/, res.status(400).json({ error: "Game is already finished." })];
                }
                // Update game status to "finished"
                game.status = "finished";
                if (req.body) {
                    winner = req.body.winner;
                    game.winner = winner;
                }
                return [4 /*yield*/, game.save()];
            case 2:
                updatedGame = _a.sent();
                res.status(200).json(updatedGame);
                return [3 /*break*/, 4];
            case 3:
                err_4 = _a.sent();
                res.status(500).json({ error: err_4.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.endGame = endGame;
var changeGameMode = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var gameId, mode, game, updatedGame, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                gameId = req.params.gameId;
                mode = req.body.mode;
                return [4 /*yield*/, Game_1.default.findById(gameId)];
            case 1:
                game = _a.sent();
                if (!game) {
                    return [2 /*return*/, res.status(404).json({ error: "Game not found." })];
                }
                if (game.status !== "paused") {
                    return [2 /*return*/, res.status(400).json({ error: "Game is not paused." })];
                }
                if (mode !== "auto" && mode !== "manual") {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid game mode." })];
                }
                game.mode = mode;
                return [4 /*yield*/, game.save()];
            case 2:
                updatedGame = _a.sent();
                res.status(200).json(updatedGame);
                return [3 /*break*/, 4];
            case 3:
                err_5 = _a.sent();
                res.status(500).json({ error: err_5.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.changeGameMode = changeGameMode;
var changePrize = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var gameId, newPrize, game, updatedGame, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                gameId = req.params.gameId;
                newPrize = req.body.newPrize;
                return [4 /*yield*/, Game_1.default.findById(gameId)];
            case 1:
                game = _a.sent();
                if (!game) {
                    return [2 /*return*/, res.status(404).json({ error: "Game not found." })];
                }
                if (game.status !== "ongoing") {
                    return [2 /*return*/, res.status(400).json({ error: "Game is not ongoing." })];
                }
                game.prize = newPrize;
                return [4 /*yield*/, game.save()];
            case 2:
                updatedGame = _a.sent();
                res.status(200).json(updatedGame);
                return [3 /*break*/, 4];
            case 3:
                err_6 = _a.sent();
                res.status(500).json({ error: err_6.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.changePrize = changePrize;
var kickPlayer = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var gameId, playerAddress, game, playerIndex, updatedGame, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                gameId = req.params.gameId;
                playerAddress = req.body.playerAddress;
                return [4 /*yield*/, Game_1.default.findById(gameId)];
            case 1:
                game = _a.sent();
                if (!game) {
                    return [2 /*return*/, res.status(404).json({ error: "Game not found." })];
                }
                if (game.status !== "ongoing") {
                    return [2 /*return*/, res.status(400).json({ error: "Game is not ongoing." })];
                }
                playerIndex = game.players.indexOf(playerAddress);
                if (playerIndex === -1) {
                    return [2 /*return*/, res.status(404).json({ error: "Player not found in the game." })];
                }
                game.players.splice(playerIndex, 1);
                return [4 /*yield*/, game.save()];
            case 2:
                updatedGame = _a.sent();
                res.status(200).json(updatedGame);
                return [3 /*break*/, 4];
            case 3:
                err_7 = _a.sent();
                res.status(500).json({ error: err_7.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.kickPlayer = kickPlayer;
