// imports
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const errorhandler = require("errorhandler");
const morgan = require("morgan");
const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const apiRouter = require("./api/api");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
const auth = require("./auth");
const mysql = require("mysql2");
const config = require("./data/db-config");

// create application
const app = express();
const db = new sqlite3.Database("./data/database.sqlite");
const PORT = process.env.PORT || 4000;

//setting template engine and middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: "some secret 1234",
  resave: true,
  saveUninitialized: false,
  store: new SQLiteStore,
  cookie : { secure : false }
}));
app.use(auth.initialize);
app.use(auth.session);
app.use(auth.setUser);
app.use(morgan("dev"));
app.use(cors());
app.use(express.static(path.join(__dirname, "./static")));
app.use(errorhandler());

//helper functions
function redirectToLogin(req, res, next) {
  if (req.user) return next();
  return res.redirect('/');
}

//ROUTES ----------------------------------

//mounting routers
app.use("/api/", apiRouter);

//GET login page
app.get("/", (req, res) => {
  res.render("login");  
});

//GET feed page
app.get("/feed", redirectToLogin, (req, res) => {
  let fistBumps;
  let totalLeaderboard;
  let volumeLeaderboard;
  db.serialize(() => {

    //get list and count of fist bumps
    db.all("SELECT Sub1.workout_id, Sub1.user_id, Sub3.first_name, Sub3.surname, Sub2.count FROM (SELECT workout_id, user_id FROM Fist_bumps) AS Sub1 JOIN (SELECT workout_id, COUNT(user_id) as 'count' FROM Fist_bumps GROUP BY workout_id) AS Sub2 ON Sub1.workout_id = Sub2.workout_id JOIN (SELECT Users.id, Users.first_name, Users.surname FROM Users) AS Sub3 ON Sub1.user_id = Sub3.id", (err, rows) => {
      if (err) {
        return console.error(err.message);
      }
      fistBumps = rows;
    });

    //get workout total leader
    db.all("SELECT Users.first_name, Users.surname, Users.email, Lifts.name, COUNT(DISTINCT Workouts.id) as workouts FROM Sets LEFT JOIN Workouts on Workouts.id = Sets.workout_id LEFT JOIN Lifts on Sets.exercise_id = Lifts.id LEFT JOIN Users on Workouts.user_id = Users.id WHERE Workouts.date_time BETWEEN datetime('now', '-1 month') AND datetime('now', 'localtime')   GROUP BY first_name, surname ORDER BY workouts DESC", (err, rows) => {
      if (err) {
        return console.error(err.message);
      }
      totalLeaderboard = rows;
    });

    //get workout volume leader
    db.all("SELECT Users.first_name, Users.surname, Users.email, Lifts.name, SUM(Sets.reps * Sets.weight) as volume FROM Sets LEFT JOIN Workouts on Workouts.id = Sets.workout_id LEFT JOIN Lifts on Sets.exercise_id = Lifts.id LEFT JOIN Users on Workouts.user_id = Users.id WHERE Workouts.date_time BETWEEN datetime('now', '-1 month') AND datetime('now', 'localtime') GROUP BY first_name, surname ORDER BY volume DESC", (err, rows) => {
      if (err) {
        return console.error(err.message);
      }
      volumeLeaderboard = rows;
    });

    //get list of workouts and send response
    db.all("SELECT Workouts.id, Workouts.name as  workout_name, Workouts.date_time, Users.first_name, Users.surname, Users.email, Lifts.name as lift_name, COUNT(Lifts.name) as sets, ROUND(AVG(Sets.reps),1) as avg_reps, AVG(Sets.weight) as avg_weight, MAX(Sets.weight) as max_weight FROM Sets LEFT JOIN Workouts on Workouts.id = Sets.workout_id LEFT JOIN Lifts on Sets.exercise_id = Lifts.id LEFT JOIN Users on Workouts.user_id = Users.id WHERE Workouts.date_time BETWEEN datetime('now', '-1 month') AND datetime('now', 'localtime') GROUP BY Workouts.id, Lifts.name ORDER BY Workouts.date_time DESC;", (err, rows) => {
      if (err) {
        return console.error(err.message);
      }
      res.render("feed", { model: rows, user: req.user, bumps: fistBumps, totalLeaderboard: totalLeaderboard, volumeLeaderboard: volumeLeaderboard });      
    });

  });
});

//GET log-workout page
app.get("/log-workout", redirectToLogin, (req, res) => {

  let connection = mysql.createConnection(config);
  connection.query(`SELECT * FROM lifts`, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    res.render("log-workout", { user: req.user, lifts: results })     
  });
  connection.end();

});








//GET user details page
app.get("/users/:email", redirectToLogin, (req, res) => {
  let prs;
  let bro;
  let fistBumps;
  db.serialize(() => {

    //get user data
    db.get("SELECT first_name, surname, gender, email FROM Users WHERE email = $email;", { $email: req.params.email }, (err, row) => {
      if (err) {
        return console.error(err.message);
      } 
      console.log("Got User data");
      console.log(row);
      bro = row;
    });

    //get PR data
    db.all("SELECT Sub1.name, Sub1.five_reps, Sub2.ten_reps FROM (SELECT Lifts.name, MAX(Sets.weight) as five_reps, Sets.reps FROM Sets LEFT JOIN Lifts on Sets.exercise_id = Lifts.id LEFT JOIN Workouts on Sets.workout_id = Workouts.id LEFT JOIN Users on Workouts.user_id = Users.id WHERE Users.email = $email AND Sets.reps = 5 GROUP BY Lifts.name) AS Sub1 LEFT JOIN (SELECT Lifts.name, MAX(Sets.weight) as ten_reps, Sets.reps FROM Sets LEFT JOIN Lifts on Sets.exercise_id = Lifts.id LEFT JOIN Workouts on Sets.workout_id = Workouts.id LEFT JOIN Users on Workouts.user_id = Users.id WHERE Users.email = $email AND Sets.reps = 10 GROUP BY Lifts.name) AS Sub2 ON Sub1.name = Sub2.name GROUP BY Sub1.name;", { $email: req.params.email }, (err, rows) => {
      if (err) {
        return console.error(err.message);
      } 
      console.log("Got PRs", rows);
      prs = rows;
    });

    //get list and count of fist bumps
    db.all("SELECT Sub1.workout_id, Sub1.user_id, Sub3.first_name, Sub3.surname, Sub2.count FROM (SELECT workout_id, user_id FROM Fist_bumps) AS Sub1 JOIN (SELECT workout_id, COUNT(user_id) as 'count' FROM Fist_bumps GROUP BY workout_id) AS Sub2 ON Sub1.workout_id = Sub2.workout_id JOIN (SELECT Users.id, Users.first_name, Users.surname FROM Users) AS Sub3 ON Sub1.user_id = Sub3.id", (err, rows) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("got fist bumps:", rows);
      fistBumps = rows;
    });

    //get user and workout data and render page
    db.all("SELECT Workouts.id, Workouts.name as workout_name, Workouts.date_time, Users.first_name, Users.surname, Users.email, Lifts.name as lift_name, COUNT(Lifts.name) as sets, ROUND(AVG(Sets.reps),1) as avg_reps, AVG(Sets.weight) as avg_weight, MAX(Sets.weight) as max_weight FROM Sets LEFT JOIN Workouts on Workouts.id = Sets.workout_id LEFT JOIN Lifts on Sets.exercise_id = Lifts.id LEFT JOIN Users on Workouts.user_id = Users.id WHERE Users.email = $email AND Workouts.date_time BETWEEN datetime('now', '-1 month') AND datetime('now', 'localtime') GROUP BY Workouts.id, Lifts.name ORDER BY Workouts.date_time DESC;", { $email: req.params.email }, (err, rows) => {
      if (err) {
        return console.error(err.message);
      } 
      console.log("Got workout data", rows);

      res.render("user-details", { model: rows, prs: prs, bro: bro, bumps: fistBumps, user: req.user });
    });
  });
});

//GET workout details page
app.get("/workouts/:id", redirectToLogin, (req, res) => {
  let fistBumps;
  db.serialize(() => {

    db.all("SELECT Sub1.workout_id, Sub1.user_id, Sub3.first_name, Sub3.surname, Sub2.count FROM (SELECT workout_id, user_id FROM Fist_bumps) AS Sub1 JOIN (SELECT workout_id, COUNT(user_id) as 'count' FROM Fist_bumps GROUP BY workout_id) AS Sub2 ON Sub1.workout_id = Sub2.workout_id JOIN (SELECT Users.id, Users.first_name, Users.surname FROM Users) AS Sub3 ON Sub1.user_id = Sub3.id WHERE Sub1.workout_id = $id", {$id: req.params.id}, (err, rows) => {
      if (err) {
        return console.error(err.message);
      }
      fistBumps = rows;
      console.log("Fist bumps: ", fistBumps);
    });

    db.all("SELECT Workouts.id, Workouts.name as workout_name, Workouts.date_time, Users.first_name, Users.surname, Users.email, Lifts.category, Lifts.name as lift_name, Sets.weight, Sets.reps FROM Sets JOIN Workouts ON Workouts.id = Sets.workout_id JOIN Lifts ON Sets.exercise_id = Lifts.id JOIN Users ON Workouts.user_id = Users.id WHERE Workouts.id = $id", { $id: req.params.id }, (err, rows) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Workout details: ", rows);
      res.render("workout-details", { user: req.user, model: rows, bumps: fistBumps });  
    });
    
  });

  })



//GET account page
app.get("/account", redirectToLogin, (req, res) => {
  return res.render("account", { user: req.user });  
});

//GET logout page
app.get("/logout", (req, res) => {
  req.logout();
  console.log("User logged out");
  return res.render("logout");  
});
    
//starting app
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening on port: ${PORT}`);
});

//export
module.exports = app;
