//imports
const express = require("express");
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 12;
const passport = require("passport");

//create router
const userRouter = express.Router();
const db = new sqlite3.Database("data/database.sqlite");

// request handlers
//GET all users
userRouter.get("/", (req, res, next) => {
  db.all("SELECT * FROM Users", (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    console.log(rows);
    res.status(200).json({ user: rows });
  });
});


// GET userId by email
userRouter.get("/email/:email", (req, res, next) => {
console.log("Requested userId for user email: ", req.params);
db.get(
  "SELECT * FROM Users WHERE email = $email",
  { $email: req.params.email },
  (error, row) => {
    console.log("Returned user with id: ", row);
    res.status(200).json({ user: row });
  }
);
});

// GET user by id
userRouter.get("/id/:id", (req, res, next) => {
console.log("Requested user for id: ", req.params);
db.get(
  "SELECT * FROM Users WHERE id = $id",
  { $id: req.params.id },
  (error, row) => {
    console.log("Returned user with id: ", row);
    res.status(200).json({ user: row });
  }
);
});

//POST a new user
userRouter.post("/", (req, res, next) => {
const name = req.body.first_name;
const surname = req.body.surname;
const gender = req.body.gender;
const email = req.body.email;
const password = req.body.password;
if (!name || !surname || !gender || !email || !password) {
  return res.sendStatus(400);
} else {
  console.log(req.body);


  bcrypt.hash(password, SALT_ROUNDS, function (err, hash) {

    db.run(
      "INSERT INTO Users (first_name, surname, gender, email, password) VALUES ($name, $surname, $gender, $email, $password)",
      {
        $name: name,
        $surname: surname,
        $gender: gender,
        $email: email,
        $password: hash
      },
      function(error) {
        if (error) {
          next(error);
        } else {
          db.get(
            `SELECT * FROM Users WHERE id = ${this.lastID}`,
            (error, row) => {
              res.status(201).json({ user: row });
            }
          );
        }
      }
    );
  })
}
});

//PUT - update user details
userRouter.put("/", (req, res, next) => {
  const id = req.user.id;
  const name = req.body.name;
  const surname = req.body.surname;
  const email = req.body.email;
  const gender = req.body.gender;
  const dob = req.body.dob;
  const weight = req.body.weight;
  if (!id || !name || !surname || !gender || !email || !dob || !weight) {
    console.log("Insufficient data to update account.")
    return res.sendStatus(400);
  } else {
    console.log(req.body);  
    db.run(
      "UPDATE Users SET first_name = $name, surname = $surname, email = $email, gender = $gender, date_of_birth = $dob, weight = $weight WHERE id = $id",
      {
        $id: id,
        $name: name,
        $surname: surname,
        $email: email,
        $gender: gender,
        $dob: dob,
        $weight: weight
      },
      function(error) {
        if (error) {
          next(error);
        } else {
          db.get(
            `SELECT * FROM Users WHERE id = ${req.user.id}`,
            (error, row) => {
              res.status(201).json({ user: row });
            }
          );
        }
      }
    );

  }
  });



//POST - Login as a created user

userRouter.post("/login/", passport.authenticate('local', { 
  session: true,
  successRedirect: '/feed'
  //failureRedirect: '/'
  }
  )); 

//exports
module.exports = userRouter;
