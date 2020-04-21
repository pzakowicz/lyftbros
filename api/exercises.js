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

  //GET exercise name by category
exerciseRouter.get("/category/:category", (req, res, next) => {
  console.log("Requested exercises for category: ", req.params);
  db.all("SELECT * FROM Lifts WHERE category = $category", { $category: req.params.category }, (error, rows) => {
      console.log("Returned exercises for category: ", rows);
      res.status(200).json({ exercises: rows });
    }
  );
  });
  
  //POST new exercise
  exerciseRouter.post("/", (req, res, next) => {
  const category = req.body.category;
  const name = req.body.name;
  if (!name || !category) {
    return res.sendStatus(400);
  } else {
    console.log(req.body);
    db.run(
      "INSERT INTO Lifts (category, name) VALUES ($category, $name)",
      {
        $category: category,
        $name: name
      },
      function(error) {
        if (error) {
          next(error);
        } else {
        res.status(201).render("/log-workout");
        }
      }
    );
  }
  });

  //exports
module.exports = exerciseRouter;