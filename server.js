// imports
const bodyParser = require("body-parser");
const cors = require("cors");
const errorhandler = require("errorhandler");
const morgan = require("morgan");
const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const apiRouter = require("./api/api");


// create application
const app = express();
const db = new sqlite3.Database("./data/database.sqlite");
const PORT = process.env.PORT || 4000;

//setting template engine and middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());
app.use(express.static(path.join(__dirname, "./static")));
app.use(errorhandler());

//ROUTES ----------------------------------

//mounting routers
app.use("/api/", apiRouter);

//GET login page
app.get("/", (req, res) => {
  res.render("login");  
});

//GET feed page
app.get("/feed", (req, res) => {
  let users;
  db.serialize(() => {

    db.all("SELECT * FROM Users", (err, rows) => {
      if (err) {
        return console.error(err.message);
      }
      users = rows;
    });

    db.all("SELECT Workouts.id, Workouts.name as 'workout_name', Workouts.date_time, Users.first_name, Users.surname, Lifts.name as 'lift_name', Sets.weight, 	Sets.reps FROM Sets LEFT JOIN Workouts on Workouts.id = Sets.workout_id LEFT JOIN Lifts on Sets.exercise_id = Lifts.id 	LEFT JOIN Users on Workouts.user_id = Users.id ORDER BY Workouts.date_time DESC LIMIT 30;", (err, rows) => {
      if (err) {
        return console.error(err.message);
      }
      res.render("feed", { model: rows, bros: users });      
    });

  });
});

//GET log-training page
app.get("/log-training", (req, res) => {
  let users;
  let lifts;
  db.serialize(() => {

    db.all("SELECT * FROM Users", (err, rows) => {
      if (err) {
        return console.error(err.message);
      }
      users = rows;
    });

    db.all("SELECT * FROM Lifts", (err, rows) => {
      if (err) {
        return console.error(err.message);
      }
      lifts = rows;
      res.render("training", { users: users, lifts: lifts })     
    });

  })
});

//GET user details page
app.get("/users/:email", (req, res) => {
  let prs;
  db.serialize(() => {

    //get PR data
    db.all("SELECT Sub1.name, Sub1.five_reps, Sub2.ten_reps FROM (SELECT Lifts.name, MAX(Sets.weight) as five_reps, Sets.reps FROM Sets LEFT JOIN Lifts on Sets.exercise_id = Lifts.id LEFT JOIN Workouts on Sets.workout_id = Workouts.id LEFT JOIN Users on Workouts.user_id = Users.id WHERE Users.email = $email AND Sets.reps = 5 GROUP BY Lifts.name) AS Sub1 LEFT JOIN (SELECT Lifts.name, MAX(Sets.weight) as ten_reps, Sets.reps FROM Sets LEFT JOIN Lifts on Sets.exercise_id = Lifts.id LEFT JOIN Workouts on Sets.workout_id = Workouts.id LEFT JOIN Users on Workouts.user_id = Users.id WHERE Users.email = $email AND Sets.reps = 10 GROUP BY Lifts.name) AS Sub2 ON Sub1.name = Sub2.name GROUP BY Sub1.name;", { $email: req.params.email }, (err, rows) => {
      if (err) {
        return console.error(err.message);
      } 
      console.log("Got PRs");
      prs = rows;

    })

    //get workout data
    db.all("SELECT Workouts.id, Workouts.name as 'workout_name', Workouts.date_time, Users.first_name, Users.surname, Users.gender, Lifts.name as 'lift_name', Sets.weight, Sets.reps FROM Sets LEFT JOIN Workouts on Workouts.id = Sets.workout_id LEFT JOIN Lifts on Sets.exercise_id = Lifts.id LEFT JOIN Users on Workouts.user_id = Users.id WHERE Users.email = $email ORDER BY Workouts.date_time DESC LIMIT 30;", { $email: req.params.email }, (err, rows) => {
      if (err) {
        return console.error(err.message);
      } 
      console.log("Got user data");
      res.render("users", { model: rows, prs: prs });
    });
  });
});
    
//starting app
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening on port: ${PORT}`);
});

//export
module.exports = app;
