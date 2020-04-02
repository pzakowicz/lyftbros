// imports
const bodyParser = require("body-parser");
const cors = require("cors");
const errorhandler = require("errorhandler");
const morgan = require("morgan");
const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./database.sqlite");

// create application
const app = express();
const PORT = process.env.PORT || 4000;

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(cors());
app.use(express.static(path.join(__dirname, "./static")));
app.use(errorhandler());

//ROUTES

//GET login page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./static/login.html"));
});

//GET users page
app.get("/users", (req, res) => {
  res.sendFile(path.join(__dirname, "./static/users.html"));
});

//GET all users
app.get("/api/users", (req, res, next) => {
  db.all("SELECT * FROM Users", (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    console.log(rows);
    res.status(200).json({ user: rows });
  });
});

//GET user by first_name
app.get("/api/users/:first_name", (req, res, next) => {
  console.log(req.params);
  db.get(
    "SELECT * FROM Users WHERE first_name = $first_name",
    { $first_name: req.params.first_name },
    (error, row) => {
      res.status(200).json({ user: row });
    }
  );
});

//POST a new user
app.post("/", (req, res, next) => {
  const name = req.query.name;
  const surname = req.query.surname;
  //const gender = req.params.gender;
  const email = req.query.email;
  const password = req.query.password;

  if (!name || !surname || !email || !password) {
    return res.sendStatus(400);
  } else {
    console.log(req.body);
    db.run(
      "INSERT INTO Users (name, surname, email, password) VALUES ($name, $surname, $email, $password)",
      {
        $name: name,
        $surname: surname,
        $email: email,
        $password: password
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
  }
});

//starting app
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening on port: ${PORT}`);
});

//export
module.exports = app;
