//imports
const express = require("express");
const mysql = require("mysql2");
const config = require("../config");

//create router
const workoutRouter = express.Router();

//GET all workouts for the feed
workoutRouter.get("/", (req, res, next) => {
  
  let connection = mysql.createConnection(config);
  connection.query(`SELECT Workouts.id, Workouts.name as  workout_name, workouts.date_time, Users.first_name, Users.surname, Users.id as user_id, Lifts.name as lift_name, COUNT(Lifts.name) as sets, ROUND(AVG(Sets.reps),1) as avg_reps, AVG(Sets.weight) as avg_weight, MAX(Sets.weight) as max_weight FROM Sets LEFT JOIN Workouts on Workouts.id = Sets.workout_id LEFT JOIN Lifts on Sets.exercise_id = Lifts.id LEFT JOIN Users on Workouts.user_id = Users.id WHERE Workouts.date_time BETWEEN (NOW() - INTERVAL 4 WEEK) AND NOW() GROUP BY Workouts.id, Lifts.name ORDER BY Workouts.date_time DESC;`, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    res.status(200).send(results);
  });
  connection.end();
  
  });

//GET all workouts for a given user
workoutRouter.get("/user/", (req, res, next) => {
  
  let connection = mysql.createConnection(config);
  connection.query(`SELECT Workouts.id, Workouts.name as 'workout_name', Workouts.date_time, Users.email, Lifts.name as 'lift_name', Sets.weight, Sets.reps FROM Sets LEFT JOIN Workouts on Workouts.id = Sets.workout_id LEFT JOIN Lifts on Sets.exercise_id = Lifts.id 	LEFT JOIN Users on Workouts.user_id = Users.id WHERE Users.email = ? ORDER BY Workouts.date_time DESC LIMIT 200;`, [req.user[0].email], (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    res.status(200).json({ workout: results });
  });
  connection.end();
  
  });

//GET workout total leaderboard
workoutRouter.get("/workoutLeader/", (req, res, next) => {
  
  let connection = mysql.createConnection(config);
  connection.query(`SELECT Users.first_name, Users.surname, Users.id, Lifts.name, COUNT(DISTINCT Workouts.id) as workouts FROM Sets LEFT JOIN Workouts on Workouts.id = Sets.workout_id LEFT JOIN Lifts on Sets.exercise_id = Lifts.id LEFT JOIN Users on Workouts.user_id = Users.id WHERE Workouts.date_time BETWEEN (NOW() - INTERVAL 4 WEEK) AND NOW() GROUP BY first_name, surname ORDER BY workouts DESC`, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    res.status(200).send(results);
  });
  connection.end();
  
  });

  //GET workout volume leaderboard
workoutRouter.get("/volumeLeader/", (req, res, next) => {
  
  let connection = mysql.createConnection(config);
  connection.query(`SELECT Users.first_name, Users.surname, Users.id, Lifts.name, SUM(Sets.reps * Sets.weight) as volume FROM Sets LEFT JOIN Workouts on Workouts.id = Sets.workout_id LEFT JOIN Lifts on Sets.exercise_id = Lifts.id LEFT JOIN Users on Workouts.user_id = Users.id WHERE Workouts.date_time BETWEEN (NOW() - INTERVAL 4 WEEK) AND NOW() GROUP BY first_name, surname ORDER BY volume DESC`, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    res.status(200).send(results);
  });
  connection.end();
  
  });

  

//POST new workout
workoutRouter.post("/", (req, res, next) => {
  const name = req.body.name;
  const userId = req.user[0].id;
  if (!name || !userId) {
    console.log("Insufficient data to post a new workout.");
    return res.sendStatus(400);
  } else {
    console.log("Requested to post the workout: ", req.body.name);

    let connection = mysql.createConnection(config);
    
    connection.query(`INSERT INTO Workouts (name, user_id) VALUES (?, ?)`, [name, userId], (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      }
      connection.query(`SELECT * FROM Workouts WHERE id = ${results.insertId}`, function(error, results, fields) {
        if (error) {
          return console.error(error.message);
        }
      res.status(201).json({ workout: results });
      console.log("Added new workout: ", results);
      });
    connection.end();
    })
  }
});

//exports
module.exports = workoutRouter;