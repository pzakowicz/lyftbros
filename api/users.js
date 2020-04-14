//imports
const express = require("express");
const userRouter = express.Router();

const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("../data/database.sqlite");

// middleware

// request handlers

//exports
module.exports = userRouter;
