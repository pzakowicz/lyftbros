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

//GET feed page
app.get("/feed", (req, res) => {
  res.sendFile(path.join(__dirname, "./static/feed.html"));
});

//get exercises page
app.get("/exercises", (req, res) => {
  res.sendFile(path.join(__dirname, "./static/exercises.html"));
});

//get log-training page
app.get("/log-training", (req, res) => {
  res.sendFile(path.join(__dirname, "./static/training.html"));
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
app.post("/api/users/", (req, res, next) => {
  const name = req.body.first_name;
  const surname = req.body.surname;
  const gender = req.body.gender;
  const email = req.body.email;
  const password = req.body.password;

  if (!name || !surname || !gender || !email || !password) {
    return res.sendStatus(400);
  } else {
    console.log(req.body);
    db.run(
      "INSERT INTO Users (first_name, surname, gender, email, password) VALUES ($name, $surname, $gender, $email, $password)",
      {
        $name: name,
        $surname: surname,
        $gender: gender,
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

//GET login as a created user
app.get("/api/users/login/:email-:password", (req, res, next) => {
  console.log(req.params);
  db.get(
    "SELECT * FROM Users WHERE email = $email AND password = $password",
    {
      $email: req.params.email,
      $password: req.params.password
    },
    (error, row) => {
      console.log(row);
      res.status(200).json({ user: row });
    }
  );
});

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

//GET all exercises
app.get("/api/exercises", (req, res, next) => {
  db.all("SELECT * FROM Lifts", (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    console.log(rows);
    res.status(200).json({ exercise: rows });
  });
});

//POST new exercise
app.post("/api/exercises/", (req, res, next) => {
  const name = req.body.name;
  const equipment = req.body.equipment;
  const measurement = req.body.measurement;
  if (!name || !equipment || !measurement) {
    return res.sendStatus(400);
  } else {
    console.log(req.body);
    db.run(
      "INSERT INTO Lifts (name, equipment, measurement) VALUES ($name, $equipment, $measurement)",
      {
        $name: name,
        $equipment: equipment,
        $measurement: measurement,
      },
      function(error) {
        if (error) {
          next(error);
        } else {
          db.get(
            `SELECT * FROM Lifts WHERE id = ${this.lastID}`,
            (error, row) => {
              res.status(201).json({ exercise: row });
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
