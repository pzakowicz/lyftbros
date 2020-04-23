//imports
const express = require("express");
const userRouter = require("./users");
const exerciseRouter = require("./exercises");
const mysql = require("mysql2");
const config = require("../data/db-config");

// create router
const apiRouter = express.Router();

//mount other routers
apiRouter.use("/users", userRouter);
apiRouter.use("/exercises", exerciseRouter);

//REQUEST HANDLERS -------------------------------

//GET all workouts for the feed
apiRouter.get("/feed", (req, res, next) => {

let connection = mysql.createConnection(config);
connection.query(`SELECT Workouts.id, Workouts.name as 'workout_name', Workouts.date_time, Users.first_name, Users.surname, Users.email, Lifts.name as 'lift_name', Sets.weight, 	Sets.reps FROM Sets LEFT JOIN Workouts on Workouts.id = Sets.workout_id LEFT JOIN Lifts on Sets.exercise_id = Lifts.id 	LEFT JOIN Users on Workouts.user_id = Users.id ORDER BY Workouts.date_time DESC;`, (error, results, fields) => {
  if (error) {
    return console.error(error.message);
  }
  res.status(200).json({ workout: results });
});
connection.end();

});


//POST new workout
apiRouter.post("/workouts/", (req, res, next) => {
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

//POST a fist-bump
apiRouter.post("/workouts/fist-bumps/add/", (req, res, next) => {
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

//GET fist-bumps and users
apiRouter.get("/workouts/fist-bumps/:workoutid", (req, res, next) => {
  console.log("Requested fist-bumps for workout id: ", req.params);

  let connection = mysql.createConnection(config);
  connection.query(`SELECT Sub1.workout_id, Sub1.user_id, Sub3.first_name, Sub3.surname, Sub3.email, Sub2.count FROM (SELECT workout_id, user_id FROM Fist_bumps) AS Sub1 JOIN (SELECT workout_id, COUNT(user_id) as 'count' FROM Fist_bumps GROUP BY workout_id) AS Sub2 ON Sub1.workout_id = Sub2.workout_id JOIN (SELECT Users.id, Users.first_name, Users.surname, Users.email FROM Users) AS Sub3 ON Sub1.user_id = Sub3.id WHERE Sub1.workout_id = ?;`, [req.params.workoutid], (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    console.log("Returned fist-bumps: ", results);
    res.status(200).json({ bumps: results });
  });
  connection.end();

});

//POST sets 
apiRouter.post("/sets/", (req, res, next) => {
const exerciseArray = req.body.sets
if (!req.body.sets) {
  console.log("Insufficient data to post sets.");
  return res.sendStatus(400);
} else {
  console.log("Requested to post sets: ", req.body.sets);
  let placeholders = exerciseArray.map(() => "(?, ?, ?, ?)").join(', ');
  let query = `INSERT INTO Sets(exercise_id, weight, reps, workout_id) VALUES${placeholders}`;
  console.log(query);
  let flatExerciseArray = [];
  exerciseArray.forEach((arr) => { arr.forEach((item) => { flatExerciseArray.push(item) }) });

  let connection = mysql.createConnection(config);
  connection.query(query, flatExerciseArray, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    res.status(201).send("Sets added correctly");
    console.log(`Sets inserted correctly`);
  });
  connection.end();

}
});

//exports
module.exports = apiRouter;

