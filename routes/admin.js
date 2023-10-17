"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var Admin_1 = require("../controllers/Admin");
var router = express.Router();
router.post("/create", Admin_1.createGame);
exports.default = router;
