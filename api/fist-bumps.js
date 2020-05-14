//imports
const express = require("express");
const mysql = require("mysql2");
const config = require("../config");

//create router
const fistBumpRouter = express.Router();


//POST a fist-bump
fistBumpRouter.post("/add/", (req, res, next) => {
  const workoutId = req.body.workoutId;
  const userId = req.user[0].id;
  if (!workoutId || !userId) {
    console.log("Insufficient data to post a fist-bump.");
    return res.sendStatus(400);
  } else {
    console.log("Requested to post the fist-bump: ", req.body);

    let connection = mysql.createConnection(config);
    connection.query(`SELECT * FROM Fist_bumps WHERE workout_id = ? AND user_id = ?`, [workoutId, userId], function(error, results, fields) {
      if (results[0]) {
        console.log("Fist-bump already given by this user.")
        return res.sendStatus(400);
      } else {
        let connection = mysql.createConnection(config);
        connection.query(`INSERT INTO Fist_bumps (workout_id, user_id) VALUES (?, ?)`, [workoutId, userId], function(error, results, fields) {
          if (error) {
            return console.error(error.message);
          }
          console.log("Added new fist-bump.");
          return res.sendStatus(201);
          connection.end();
        });
      }
    });
    connection.end();
  }
});

//GET all fist bumps with count
fistBumpRouter.get("/", (req, res, next) => {
  console.log("Requested fist-bumps");

  let connection = mysql.createConnection(config);
  connection.query(`SELECT Sub1.workout_id, Sub1.user_id, Sub3.first_name, Sub3.surname, Sub2.count FROM (SELECT workout_id, user_id FROM Fist_bumps) AS Sub1 JOIN (SELECT workout_id, COUNT(user_id) as 'count' FROM Fist_bumps GROUP BY workout_id) AS Sub2 ON Sub1.workout_id = Sub2.workout_id JOIN (SELECT Users.id, Users.first_name, Users.surname FROM Users) AS Sub3 ON Sub1.user_id = Sub3.id`, [req.params.workoutid], (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    res.status(200).send(results);
  });
  connection.end();

});


//GET fist-bumps and users for workout id
fistBumpRouter.get("/:workoutid", (req, res, next) => {
  console.log("Requested fist-bumps for workout id: ", req.params);

  let connection = mysql.createConnection(config);
  connection.query(`SELECT Sub1.workout_id, Sub1.user_id, Sub3.first_name, Sub3.surname, Sub3.id as user_id, Sub2.count FROM (SELECT workout_id, user_id FROM Fist_bumps) AS Sub1 JOIN (SELECT workout_id, COUNT(user_id) as 'count' FROM Fist_bumps GROUP BY workout_id) AS Sub2 ON Sub1.workout_id = Sub2.workout_id JOIN (SELECT Users.id, Users.first_name, Users.surname, Users.email FROM Users) AS Sub3 ON Sub1.user_id = Sub3.id WHERE Sub1.workout_id = ?;`, [req.params.workoutid], (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    console.log("Returned fist-bumps: ", results);
    res.status(200).json(results);
  });
  connection.end();

});

//exports
module.exports = fistBumpRouter;