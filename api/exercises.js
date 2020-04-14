//imports
const express = require("express");
const sqlite3 = require("sqlite3");

//create router
const exerciseRouter = express.Router();
const db = new sqlite3.Database("data/database.sqlite");

// request handlers
//GET all exercises
exerciseRouter.get("/", (req, res, next) => {
  db.all("SELECT * FROM Lifts", (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.status(200).json({ exercises: rows });
    console.log(rows);
  });
});


//GET exerciseId by name
exerciseRouter.get("/:name", (req, res, next) => {
  console.log("Requested exerciseId for name: ", req.params);
  db.get(
    "SELECT id FROM Lifts WHERE name = $name",
    { $name: req.params.name },
    (error, row) => {
      console.log("Returned exercise with id: ", row);
      res.status(200).json({ exercise: row });
    }
  );
  });
  
  //POST new exercise
  exerciseRouter.post("/", (req, res, next) => {
  const name = req.body.name;
  const measurement = req.body.measurement;
  if (!name || !measurement) {
    return res.sendStatus(400);
  } else {
    console.log(req.body);
    db.run(
      "INSERT INTO Lifts (name, measurement) VALUES ($name, $measurement)",
      {
        $name: name,
        $measurement: measurement,
      },
      function(error) {
        if (error) {
          next(error);
        } else {
        res.status(201).send("Lyft added successfully");
        }
      }
    );
  }
  });

  //exports
module.exports = exerciseRouter;