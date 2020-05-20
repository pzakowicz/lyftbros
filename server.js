// imports
require('dotenv').config()
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const errorhandler = require("errorhandler");
const morgan = require("morgan");
const express = require("express");
const path = require("path");
const apiRouter = require("./api/api");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const auth = require("./auth");
const mysql = require("mysql2");
const config = require("./config");

// create application
const app = express();
const PORT = process.env.PORT || 4000;

// setup session store
const sessionStore = new MySQLStore(config);

//setting template engine and middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: false,
  store: sessionStore,
  cookie : { 
    secure : false,
    maxAge: 1000*60*60*24*365*10
  }
}));
app.use(auth.initialize);
app.use(auth.session);
app.use(auth.setUser);
app.use(morgan("dev"));
app.use(cors());
app.use(express.static(path.join(__dirname, "/public")));
app.use(errorhandler());

//HELPER FUNCTIONS ----------------------------------

//if user not logged in, redirect to login
function redirectToLogin(req, res, next) {
  if (req.user) return next();
  return res.redirect('/');
}

//if user logged in, redirect to feed
function redirectToFeed(req, res, next) {
  if (!req.user) return next();
  return res.redirect('feed');
}

//ROUTES ----------------------------------

//mounting API router
app.use("/api/", apiRouter);

//Render login page
app.get("/", redirectToFeed, (req, res) => {
  res.render("login");  
});

//Render feed page
app.get("/feed", redirectToLogin, (req, res) => {
  res.render("logged-in");      
});
    



//Render log-workout page
app.get("/log-workout", redirectToLogin, (req, res) => {

  let connection = mysql.createConnection(config);
  connection.query(`SELECT * FROM lifts`, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    res.render("log-workout", { user: req.user[0], lifts: results })     
  });
  connection.end();

});


//Render user details page
app.get("/users/:id", redirectToLogin, (req, res) => {
  let prs;
  let bro;
  let fistBumps;
  let connection = mysql.createConnection(config);

    //get user data
    connection.query(`SELECT * FROM Users WHERE id = ?;`, [ req.params.id ], (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      }
      
      bro = results;
    });


    //get PR data
    connection.query(`SELECT Sub1.name, Sub1.five_reps, Sub2.ten_reps FROM (SELECT Lifts.name, MAX(Sets.weight) as five_reps, Sets.reps FROM Sets LEFT JOIN Lifts on Sets.exercise_id = Lifts.id LEFT JOIN Workouts on Sets.workout_id = Workouts.id LEFT JOIN Users on Workouts.user_id = Users.id WHERE Users.email = ? AND Sets.reps = 5 GROUP BY Lifts.name) AS Sub1 LEFT JOIN (SELECT Lifts.name, MAX(Sets.weight) as ten_reps, Sets.reps FROM Sets LEFT JOIN Lifts on Sets.exercise_id = Lifts.id LEFT JOIN Workouts on Sets.workout_id = Workouts.id LEFT JOIN Users on Workouts.user_id = Users.id WHERE Users.email = ? AND Sets.reps = 10 GROUP BY Lifts.name) AS Sub2 ON Sub1.name = Sub2.name GROUP BY Sub1.name UNION ALL SELECT Sub1.name, Sub2.five_reps, Sub1.ten_reps FROM (SELECT Lifts.name, MAX(Sets.weight) as ten_reps, Sets.reps FROM Sets LEFT JOIN Lifts on Sets.exercise_id = Lifts.id LEFT JOIN Workouts on Sets.workout_id = Workouts.id LEFT JOIN Users on Workouts.user_id = Users.id WHERE Users.email = ? AND Sets.reps = 10 GROUP BY Lifts.name) AS Sub1 LEFT JOIN (SELECT Lifts.name, MAX(Sets.weight) as five_reps, Sets.reps FROM Sets LEFT JOIN Lifts on Sets.exercise_id = Lifts.id LEFT JOIN Workouts on Sets.workout_id = Workouts.id LEFT JOIN Users on Workouts.user_id = Users.id WHERE Users.email = ? AND Sets.reps = 5 GROUP BY Lifts.name) AS Sub2 ON Sub1.name = Sub2.name GROUP BY Sub1.name;`, [ req.params.email, req.params.email, req.params.email, req.params.email ], (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      }
      console.log("Got PRs", results);
      prs = results;
    });

    //get list and count of fist bumps
    connection.query(`SELECT Sub1.workout_id, Sub1.user_id, Sub3.first_name, Sub3.surname, Sub2.count FROM (SELECT workout_id, user_id FROM Fist_bumps) AS Sub1 JOIN (SELECT workout_id, COUNT(user_id) as 'count' FROM Fist_bumps GROUP BY workout_id) AS Sub2 ON Sub1.workout_id = Sub2.workout_id JOIN (SELECT Users.id, Users.first_name, Users.surname FROM Users) AS Sub3 ON Sub1.user_id = Sub3.id;`, (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      }
      
      fistBumps = results;
    });

    //get user and workout data and render page
    connection.query(`SELECT Workouts.id, Workouts.name as workout_name, Workouts.date_time, Users.first_name, Users.surname, Users.email, Lifts.name as lift_name, COUNT(Lifts.name) as sets, ROUND(AVG(Sets.reps),1) as avg_reps, AVG(Sets.weight) as avg_weight, MAX(Sets.weight) as max_weight FROM Sets LEFT JOIN Workouts on Workouts.id = Sets.workout_id LEFT JOIN Lifts on Sets.exercise_id = Lifts.id LEFT JOIN Users on Workouts.user_id = Users.id WHERE Users.email = ? AND Workouts.date_time BETWEEN (NOW() - INTERVAL 4 WEEK) AND NOW() GROUP BY Workouts.id, Lifts.name ORDER BY Workouts.date_time DESC;`, [req.params.email], (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      }
      
      res.render("user-details", { model: results, prs: prs, bro: bro[0], bumps: fistBumps, user: req.user[0] });
    });

    connection.end();

});

//Render workout details page
app.get("/workouts/:id", redirectToLogin, (req, res) => {
    res.render("workout-details");  
})



//Render account page
app.get("/account", redirectToLogin, (req, res) => {
  return res.render("account", { user: req.user[0] });  
});

//Render logout page
app.get("/logout", (req, res) => {
  req.logout();
  console.log("User logged out");
  return res.render("logout");  
});
    
//starting app
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening on port: ${PORT} in ${process.env.NODE_ENV} environment.`);
});

//export
module.exports = app;
