//import
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./data/database.sqlite");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const mysql = require("mysql2");
const config = require("./data/db-config");


passport.use(new LocalStrategy( async (username, password, done) => { 
  try {

    let connection = mysql.createConnection(config);
    connection.query(`SELECT * FROM Users WHERE email = ?`, [username], (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      } else if (!result) {
        console.log("User not found");
        return done(null, false, {message: 'Invalid username'});
      }
      bcrypt.compare(password, results.password, function (err, result) {
        if (result === true) {
          console.log("login successful");
          return done(null, results);
        } else if (result === false) {
          console.log("login failed");
          return done(null, false, {message: 'Invalid password'});
        }
      })
    });
    connection.end();

  } catch(err) {
    return done(err);
  }
}))

passport.serializeUser(function(user, done) {
  console.log("User serialised");
  return done(null, user.id);
});

passport.deserializeUser(function(id, done) {

  let connection = mysql.createConnection(config);
  connection.query(`SELECT * FROM Users WHERE id = ?`, [id], function(error, results, fields) {
    if (error) {
      return console.error(error.message);
    } else if (!results) {
      return done(null, false);
    }
    console.log("User deserialised");
    return done(null, results);
  });
  connection.end();

});


//exports
module.exports = {
  initialize: passport.initialize(),
  session: passport.session(),
  setUser: (req, res, next) => {
    res.locals.user = req.user;
    return next();
  },
};