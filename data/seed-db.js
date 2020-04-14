// imports
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');

//Populate Lifts Table
db.serialize( () => {
  db.run("INSERT INTO Lifts (name, measurement) VALUES ('Barbell bench press', 'Weight & reps')");
  db.run("INSERT INTO Lifts (name, measurement) VALUES ('Barbell overhead press', 'Weight & reps')");
  db.run("INSERT INTO Lifts (name, measurement) VALUES ('Barbell row', 'Weight & reps')");
  db.run("INSERT INTO Lifts (name, measurement) VALUES ('Barbell deadlift', 'Weight & reps')");
  db.run("INSERT INTO Lifts (name, measurement) VALUES ('Barbell back squat', 'Weight & reps')");
  db.run("INSERT INTO Lifts (name, measurement) VALUES ('Pull up', 'Weight & reps')");
  db.run("INSERT INTO Lifts (name, measurement) VALUES ('Dip', 'Weight & reps')");
  db.run("INSERT INTO Lifts (name, measurement) VALUES ('Push up', 'Weight & reps')");
});