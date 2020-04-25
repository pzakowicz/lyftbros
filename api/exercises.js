//imports
const express = require("express");
const mysql = require("mysql2");
const config = require("../data/db-config-cloud");

//create router
const exerciseRouter = express.Router();

// request handlers
//GET all exercises
exerciseRouter.get("/", (req, res, next) => {

  let connection = mysql.createConnection(config);
  connection.query(`SELECT * FROM Lifts`, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    res.status(200).json({ exercises: results });
    console.log(results);
  });
  connection.end();

});

//GET exerciseId by name
exerciseRouter.get("/:name", (req, res, next) => {
  console.log("Requested exerciseId for name: ", req.params);

  let connection = mysql.createConnection(config);
  connection.query(`SELECT id FROM lifts WHERE name = ?`, [req.params.name], (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    console.log("Returned exercise with id: ", results);
    res.status(200).json({ exercise: results });
  });
  connection.end();

  });

//GET exercise name by category
exerciseRouter.get("/category/:category", (req, res, next) => {
  console.log("Requested exercises for category: ", req.params);

  let connection = mysql.createConnection(config);
  connection.query(`SELECT * FROM lifts WHERE category = ?`, [req.params.category], (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    console.log("Returned exercises for category: ", results);
    res.status(200).json({ exercises: results });
  });
  connection.end();
  });
  
//POST new exercise
exerciseRouter.post("/", (req, res, next) => {
  const category = req.body.category;
  const name = req.body.name;
  if (!name || !category) {
    return res.sendStatus(400);
  } else {
    console.log(req.body);

  let connection = mysql.createConnection(config);
  connection.query(`INSERT INTO lifts (category, name) VALUES (?, ?)`, [category, name], (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    res.status(201).render("log-workout");
  });
  connection.end();

  }
});

//exports
module.exports = exerciseRouter;