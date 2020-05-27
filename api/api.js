//imports
const express = require("express");
const userRouter = require("./users");
const exerciseRouter = require("./exercises");
const fistBumpRouter = require("./fist-bumps");
const workoutRouter = require("./workouts");
const commentRouter = require("./comments");
const subscriptionRouter = require("./subscriptions");
const mysql = require("mysql2");
const config = require("../config");

// create router
const apiRouter = express.Router();

//mount other routers
apiRouter.use("/users", userRouter);
apiRouter.use("/exercises", exerciseRouter);
apiRouter.use("/fist-bumps", fistBumpRouter);
apiRouter.use("/workouts", workoutRouter);
apiRouter.use("/comments", commentRouter);
apiRouter.use("/subscriptions", subscriptionRouter);


//REQUEST HANDLERS -------------------------------



//POST sets 
apiRouter.post("/sets/", (req, res, next) => {
const exerciseArray = req.body.sets
if (!req.body.sets) {
  console.log("Insufficient data to post sets.");
  return res.sendStatus(400);
} else {
  console.log("Requested to post sets: ", req.body.sets);
  let placeholders = exerciseArray.map(() => "(?, ?, ?, ?, ?)").join(', ');
  let query = `INSERT INTO Sets(exercise_id, weight, reps, workout_id, pr) VALUES${placeholders}`;
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

