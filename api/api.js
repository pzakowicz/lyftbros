//imports
const express = require("express");
const userRouter = require("./users");
const exerciseRouter = require("./exercises");
const sqlite3 = require("sqlite3");

// create router
const db = new sqlite3.Database("./data/database.sqlite");
const apiRouter = express.Router();

//mount other routers
apiRouter.use("/users", userRouter);
apiRouter.use("/exercises", exerciseRouter);

//REQUEST HANDLERS -------------------------------

//GET all workouts for the feed
apiRouter.get("/feed", (req, res, next) => {
db.all("SELECT Workouts.id, Workouts.name as 'workout_name', Workouts.date_time, Users.first_name, Users.surname, Lifts.name as 'lift_name', Sets.weight, 	Sets.reps FROM Sets LEFT JOIN Workouts on Workouts.id = Sets.workout_id LEFT JOIN Lifts on Sets.exercise_id = Lifts.id 	LEFT JOIN Users on Workouts.user_id = Users.id ORDER BY Workouts.date_time DESC;", (err, rows) => {
  if (err) {
    return console.error(err.message);
  }
  res.status(200).json({ workout: rows });
});
});



//POST new workout
apiRouter.post("/workouts/", (req, res, next) => {
const name = req.body.name;
const userId = req.user.id;
if (!name || !userId) {
  console.log("Insufficient data to post a new workout.");
  return res.sendStatus(400);
} else {
  console.log("Requested to post the workout: ", req.body);
  db.run("INSERT INTO Workouts (name, user_id) VALUES ($name, $userId)", {
      $name: name,
      $userId: userId
    },
    function(error) {
      if (error) {
        next(error);
      } else {
        db.get(
          `SELECT * FROM Workouts WHERE id = ${this.lastID}`,
          (error, row) => {
            res.status(201).json({ workout: row });
            console.log("Added new workout: ", row);
          }
        );
      }
    }
  );
}
});

//POST a fist-bump
apiRouter.post("/workouts/fist-bump/", (req, res, next) => {
  const workoutId = req.body.workoutId;
  const userId = req.user.id;
  if (!workoutId || !userId) {
    console.log("Insufficient data to post a fist-bump.");
    return res.sendStatus(400);
  } else {
    console.log("Requested to post the fist-bump: ", req.body);
    db.get("SELECT * FROM Fist_bumps WHERE workout_id = $workoutId AND user_id = $userId", {
      $workoutId: workoutId,
      $userId: userId
    }, function(error, row) {
      if (row) {
        console.log("Fist-bump already given by this user.")
        return res.sendStatus(400);
      } else {
        db.run("INSERT INTO Fist_bumps (workout_id, user_id) VALUES ($workoutId, $userId)", {
          $workoutId: workoutId,
          $userId: userId
          },
          function(error) {
            if (error) {
              next(error);
            } else {
              db.get(
                `SELECT * FROM Fist_bumps WHERE id = ${this.lastID}`,
                (error, row) => {
                  res.status(201).json({ fist_bump: row });
                  console.log("Added new fist-bump: ", row);
                }
              );
            }
          }
        );

      }
    })

  }
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
  db.run(query, flatExerciseArray, function(error) {
      if (error) {
        next(error);
      } else {
        res.status(201).send("Sets added correctly");
        console.log(`Sets inserted ${this.changes}`);
      }
  }
  );
}
});

//exports
module.exports = apiRouter;

