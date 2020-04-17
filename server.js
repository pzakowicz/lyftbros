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
  cookie : { secure : false, maxAge : (24 * 60 * 60 * 1000) }
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
  let users;
  let fistBumps;
  db.serialize(() => {

    db.all("SELECT * FROM Users", (err, rows) => {
      if (err) {
        return console.error(err.message);
      }
      users = rows;
    });

    db.all("SELECT Sub1.workout_id, Sub1.user_id, Sub3.first_name, Sub3.surname, Sub2.count FROM (SELECT workout_id, user_id FROM Fist_bumps) AS Sub1 JOIN (SELECT workout_id, COUNT(user_id) as 'count' FROM Fist_bumps GROUP BY workout_id) AS Sub2 ON Sub1.workout_id = Sub2.workout_id JOIN (SELECT Users.id, Users.first_name, Users.surname FROM Users) AS Sub3 ON Sub1.user_id = Sub3.id", (err, rows) => {
      if (err) {
        return console.error(err.message);
      }

      fistBumps = rows;
    });

    db.all("SELECT Workouts.id, Workouts.name as 'workout_name', Workouts.date_time, Users.first_name, Users.surname, Lifts.name as 'lift_name', Sets.weight, 	Sets.reps FROM Sets LEFT JOIN Workouts on Workouts.id = Sets.workout_id LEFT JOIN Lifts on Sets.exercise_id = Lifts.id 	LEFT JOIN Users on Workouts.user_id = Users.id ORDER BY Workouts.date_time DESC LIMIT 30;", (err, rows) => {
      if (err) {
        return console.error(err.message);
      }
      res.render("feed", { model: rows, bros: users, user: req.user, bumps: fistBumps });      
    });

  });
});

//GET log-training page
app.get("/log-training", redirectToLogin, (req, res) => {
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
app.get("/users/:email", redirectToLogin, (req, res) => {
  let prs;
  let user;
  db.serialize(() => {

    //get user data
    db.get("SELECT first_name, surname, gender FROM Users WHERE email = $email;", { $email: req.params.email }, (err, row) => {
      if (err) {
        return console.error(err.message);
      } 
      console.log("Got User data");
      console.log(row);
      user = row;
    });

    //get PR data
    db.all("SELECT Sub1.name, Sub1.five_reps, Sub2.ten_reps FROM (SELECT Lifts.name, MAX(Sets.weight) as five_reps, Sets.reps FROM Sets LEFT JOIN Lifts on Sets.exercise_id = Lifts.id LEFT JOIN Workouts on Sets.workout_id = Workouts.id LEFT JOIN Users on Workouts.user_id = Users.id WHERE Users.email = $email AND Sets.reps = 5 GROUP BY Lifts.name) AS Sub1 LEFT JOIN (SELECT Lifts.name, MAX(Sets.weight) as ten_reps, Sets.reps FROM Sets LEFT JOIN Lifts on Sets.exercise_id = Lifts.id LEFT JOIN Workouts on Sets.workout_id = Workouts.id LEFT JOIN Users on Workouts.user_id = Users.id WHERE Users.email = $email AND Sets.reps = 10 GROUP BY Lifts.name) AS Sub2 ON Sub1.name = Sub2.name GROUP BY Sub1.name;", { $email: req.params.email }, (err, rows) => {
      if (err) {
        return console.error(err.message);
      } 
      console.log("Got PRs");

      prs = rows;

    });

    //get user and workout data
    db.all("SELECT Workouts.id, Workouts.name as 'workout_name', Workouts.date_time, Users.first_name, Users.surname, Lifts.name as 'lift_name', Sets.weight, Sets.reps FROM Sets LEFT JOIN Workouts on Workouts.id = Sets.workout_id LEFT JOIN Lifts on Sets.exercise_id = Lifts.id LEFT JOIN Users on Workouts.user_id = Users.id WHERE Users.email = $email ORDER BY Workouts.date_time DESC LIMIT 30;", { $email: req.params.email }, (err, rows) => {
      if (err) {
        return console.error(err.message);
      } 
      console.log("Got workout data");

      res.render("users", { model: rows, prs: prs, user: user });
    });
  });
});

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
