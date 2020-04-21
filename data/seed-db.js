// imports
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./data/database.sqlite');

//Populate Lifts Table
db.serialize( () => {
  db.run("INSERT INTO Lifts (category, name) VALUES ('Barbell', 'Barbell bench press')");
  db.run("INSERT INTO Lifts (category, name) VALUES ('Barbell', 'Barbell overhead press')");
  db.run("INSERT INTO Lifts (category, name) VALUES ('Barbell', 'Barbell row')");
  db.run("INSERT INTO Lifts (category, name) VALUES ('Barbell', 'Barbell deadlift')");
  db.run("INSERT INTO Lifts (category, name) VALUES ('Barbell', 'Barbell back squat')");
  db.run("INSERT INTO Lifts (category, name) VALUES ('Dumbell', 'Dumbell bench press')");
  db.run("INSERT INTO Lifts (category, name) VALUES ('Dumbell', 'Dumbell chest fly')");
  db.run("INSERT INTO Lifts (category, name) VALUES ('Dumbell', 'Dumbell shoulder press')");
  db.run("INSERT INTO Lifts (category, name) VALUES ('Dumbell', 'Dumbell lateral raise')");
  db.run("INSERT INTO Lifts (category, name) VALUES ('Dumbell', 'Dumbell triceps extension')");
  db.run("INSERT INTO Lifts (category, name) VALUES ('Dumbell', 'Dumbell biceps curl')");
  db.run("INSERT INTO Lifts (category, name) VALUES ('Dumbell', 'Dumbell row')");
  db.run("INSERT INTO Lifts (category, name) VALUES ('Bodyweight', 'Pull up')");
  db.run("INSERT INTO Lifts (category, name) VALUES ('Bodyweight', 'Dip')");
  db.run("INSERT INTO Lifts (category, name) VALUES ('Bodyweight', 'Push up')");
  db.run("INSERT INTO Lifts (category, name) VALUES ('Bodyweight', 'Squat')");
  db.run("INSERT INTO Lifts (category, name) VALUES ('Bodyweight', 'Sit up')");
});