//import
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const mysql = require("mysql2");
const config = require("./data/db-config-cloud");


passport.use(new LocalStrategy( async (username, password, done) => { 
  try {

    let connection = mysql.createConnection(config);
    connection.query(`SELECT * FROM Users WHERE email = ?`, [username], (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      } else if (!results) {
        console.log("User not found");
        return done(null, false, {message: 'Invalid username'});
      }
      bcrypt.compare(password, results[0].password, function (err, result) {
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
  return done(null, user[0].id);
});

passport.deserializeUser(function(id, done) {
  let connection = mysql.createConnection(config);
  connection.query(`SELECT * FROM Users WHERE id = ?`, [id], function(error, results, fields) {
    if (error) {
      return console.error(error.message);
    } else if (!results) {
      return done(null, false);
    }
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