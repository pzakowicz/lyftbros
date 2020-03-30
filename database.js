// imports
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');

//creat table
db.run("CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY, first_name TEXT NOT NULL, surname TEXT NOT NULL, gender TEXT NOT NULL, email TEXT NOT NULL, password TEXT NOT NULL)");
