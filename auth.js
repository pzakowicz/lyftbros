//import
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./data/database.sqlite");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");


passport.use(new LocalStrategy(/*{ usernameField: 'email' },*/ async (username, password, done) => { //usernameField may not be necessary
  try {
    db.get("SELECT * FROM Users WHERE email = ?", username, (error, row) => {
        if (!row) {
          console.log("User not found");
          return done(null, false, {message: 'Invalid username'});
        }
    bcrypt.compare(password, row.password, function (err, result) {
          if (result === true) {
            console.log("login successful");
            return done(null, row);
          } else if (result === false) {
            console.log("login failed");
            return done(null, false, {message: 'Invalid password'});
          }
        })
      }
    );
  } catch(err) {
    
    return done(err);
  }
}))

passport.serializeUser(function(user, done) {
  console.log("User serialised");
  return done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.get('SELECT * FROM Users WHERE id = ?', id, function(err, row) {
    if (!row) {
      return done(null, false);
    }
    console.log("User deserialised");
    return done(null, row);
  });
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