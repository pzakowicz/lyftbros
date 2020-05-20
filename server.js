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
  res.render("logged-in");   
});


//Render user details page
app.get("/users/:id", redirectToLogin, (req, res) => {
  res.render("logged-in"); 
});

//Render workout details page
app.get("/workouts/:id", redirectToLogin, (req, res) => {
    res.render("logged-in");  
})

//Render account page
app.get("/account", redirectToLogin, (req, res) => {
  res.render("logged-in");  
})

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
