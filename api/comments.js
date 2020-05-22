//imports
const express = require("express");
const mysql = require("mysql2");
const config = require("../config");

//create router
const commentRouter = express.Router();


//POST a comment
commentRouter.post("/add/", (req, res, next) => {
  const workoutId = req.body.workoutId;
  const userId = req.user[0].id;
  const content = req.body.content;
  if (!workoutId || !userId || !content) {
    console.log("Insufficient data to post a comment.");
    return res.sendStatus(400);
  } else {
    console.log("Requested to post the comment: ", req.body);

    let connection = mysql.createConnection(config);
    connection.query(`INSERT INTO comments (content, workout_id, user_id) VALUES (?, ?, ?)`, [content, workoutId, userId], function(error, results, fields) {
      if (error) {
        return console.error(error.message);
      }
        console.log("Added new comment.");
        return res.sendStatus(201);
    });
    
    connection.end();
  }
});

//GET all comments
commentRouter.get("/", (req, res, next) => {
  console.log("Requested comments");

  let connection = mysql.createConnection(config);
  connection.query(`SELECT comments.id, comments.content, comments.workout_id, comments.user_id, comments.date_time, users.first_name, users.surname FROM comments LEFT JOIN users on comments.user_id = users.id;;`, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    res.status(200).send(results);
  });
  connection.end();

});


//exports
module.exports = commentRouter;