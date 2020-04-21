// imports
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/database.sqlite');

//Create Users Table
db.run("CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY, first_name TEXT NOT NULL, surname TEXT NOT NULL, gender TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL, date_of_birth DATE, weight INTEGER)");

//Create Lifts Table
db.run("CREATE TABLE IF NOT EXISTS Lifts (id INTEGER PRIMARY KEY, category TEXT NOT NULL, name TEXT NOT NULL UNIQUE)");

//Create Workouts Table 
db.run("CREATE TABLE IF NOT EXISTS Workouts(id INTEGER PRIMARY KEY, name TEXT NOT NULL, date_time DATE DEFAULT (datetime('now','localtime')), user_id INTEGER NOT NULL, FOREIGN KEY(user_id) REFERENCES Users(id))");

//Create Sets Table
db.run("CREATE TABLE IF NOT EXISTS Sets(id INTEGER PRIMARY KEY, exercise_id INTEGER NOT NULL, weight INTEGER NOT NULL, reps INTEGER NOT NULL, workout_id INTEGER NOT NULL, FOREIGN KEY(exercise_id) REFERENCES Lifts(id), FOREIGN KEY(workout_id) REFERENCES Workouts(id))");

//Create Fist Bumps Table
db.run("CREATE TABLE IF NOT EXISTS Fist_bumps(id INTEGER PRIMARY KEY, workout_id INTEGER NOT NULL, user_id INTEGER NOT NULL, FOREIGN KEY(workout_id) REFERENCES Workouts(id))");



