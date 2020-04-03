// imports
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');

//Create User Table
db.run("CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY, first_name TEXT NOT NULL, surname TEXT NOT NULL, gender TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL)");

//Create Lifts Table
db.run("CREATE TABLE IF NOT EXISTS Lifts (id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE, equipment TEXT NOT NULL, measurement TEXT NOT NULL)");

//Populate Lifts Table
db.serialize( () => {
    db.run("INSERT INTO Lifts (name, equipment, measurement) VALUES ('Bench press', 'Barbell', 'Weight & reps')");
    db.run("INSERT INTO Lifts (name, equipment, measurement) VALUES ('Overhead press', 'Barbell', 'Weight & reps')");
    db.run("INSERT INTO Lifts (name, equipment, measurement) VALUES ('Row', 'Barbell', 'Weight & reps')");
    db.run("INSERT INTO Lifts (name, equipment, measurement) VALUES ('Deadlift', 'Barbell', 'Weight & reps')");
    db.run("INSERT INTO Lifts (name, equipment, measurement) VALUES ('Squat', 'Barbell', 'Weight & reps')");
    db.run("INSERT INTO Lifts (name, equipment, measurement) VALUES ('Pull up', 'Bodyweight', 'Weight & reps')");
    db.run("INSERT INTO Lifts (name, equipment, measurement) VALUES ('Dip', 'Bodyweight', 'Weight & reps')");
    db.run("INSERT INTO Lifts (name, equipment, measurement) VALUES ('Push up', 'Bodyweight', 'Weight & reps')");
});
