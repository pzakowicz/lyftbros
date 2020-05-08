//imports
const express = require("express");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 12;
const passport = require("passport");
const mysql = require("mysql2");
const config = require("../config");

//create router
const userRouter = express.Router();

// request handlers
//GET all users
userRouter.get("/", (req, res, next) => {

  let connection = mysql.createConnection(config);
  connection.query(`SELECT * FROM users`, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    res.status(200).json({ users: results });
  });
  connection.end();

});


// GET userId by email
userRouter.get("/email/:email", (req, res, next) => {
console.log("Requested userId for user email: ", req.params);

let connection = mysql.createConnection(config);
  connection.query(`SELECT * FROM Users WHERE email = ?`, [req.params.email], (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    console.log("Returned user with id: ", results);
    res.status(200).json({ user: results });
  });
  connection.end();

});

// GET user by id
userRouter.get("/id/:id", (req, res, next) => {
console.log("Requested user for id: ", req.params);

let connection = mysql.createConnection(config);
  connection.query(`SELECT * FROM Users WHERE id = ?`, [req.params.id], (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    console.log("Returned user with id: ", results);
    res.status(200).json({ user: results });
  });
  connection.end();

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

    let connection = mysql.createConnection(config);
    connection.query(`INSERT INTO Users (first_name, surname, gender, email, password) VALUES (?, ?, ?, ?, ?)`, [name, surname, gender, email, hash], (error, results, fields) => {
      if (error) {
        console.error(error.message);
        return res.sendStatus(400);
      }
      res.status(201).json({ user: results.insertId });
    });
    connection.end();

  })
}
});

//PUT - update user details
userRouter.put("/", (req, res, next) => {
  const id = req.user[0].id;
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

    let connection = mysql.createConnection(config);
    connection.query(`UPDATE Users SET first_name = ?, surname = ?, email = ?, gender = ?, date_of_birth = ?, weight = ? WHERE id = ?`, [name, surname, email, gender, dob, weight, id], (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      }
      res.status(201).json({ user: results.affectedRows });
    });
    connection.end();

  }
  });



//POST - Login as a created user
userRouter.post("/login/", passport.authenticate('local', { 
  session: true,
  successRedirect: '/feed'
  }
  )); 

//exports
module.exports = userRouter;

//GET logged in user details
userRouter.get("/session/", (req, res, next) => {
  console.log("Requested logged in user details ");
  console.log("Returned logged in user details: ", req.user[0]);
  res.status(200).send(req.user[0]);

 
  
  });