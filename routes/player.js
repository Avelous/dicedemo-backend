"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var Player_1 = require("../controllers/Player");
var router = express.Router();
router.patch("/join", Player_1.join);
exports.default = router;
