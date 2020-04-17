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
db.all("SELECT Workouts.id, Workouts.name as 'workout_name', Workouts.date_time, Users.first_name, Users.surname, Users.email, Lifts.name as 'lift_name', Sets.weight, 	Sets.reps FROM Sets LEFT JOIN Workouts on Workouts.id = Sets.workout_id LEFT JOIN Lifts on Sets.exercise_id = Lifts.id 	LEFT JOIN Users on Workouts.user_id = Users.id ORDER BY Workouts.date_time DESC;", (err, rows) => {
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
apiRouter.post("/workouts/fist-bumps/add/", (req, res, next) => {
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
              console.log("Added new fist-bump.");
              return res.sendStatus(201);
            }
          }
        );

      }
    })

  }
  });

//GET fist-bumps and users
apiRouter.get("/workouts/fist-bumps/:workoutid", (req, res, next) => {
    console.log("Requested fist-bumps for workout id: ", req.params);
    db.all(
      "SELECT Sub1.workout_id, Sub1.user_id, Sub3.first_name, Sub3.surname, Sub3.email, Sub2.count FROM (SELECT workout_id, user_id FROM Fist_bumps) AS Sub1 JOIN (SELECT workout_id, COUNT(user_id) as 'count' FROM Fist_bumps GROUP BY workout_id) AS Sub2 ON Sub1.workout_id = Sub2.workout_id JOIN (SELECT Users.id, Users.first_name, Users.surname, Users.email FROM Users) AS Sub3 ON Sub1.user_id = Sub3.id WHERE Sub1.workout_id = $workoutId",
      { $workoutId: req.params.workoutid }, 
      (error, rows) => {
        console.log("Returned fist-bumps: ", rows);
        res.status(200).json({ bumps: rows });
      }
    );
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

