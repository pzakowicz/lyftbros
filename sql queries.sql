--SELECT * FROM Users
--SELECT * FROM Lifts
--SELECT * FROM Workouts
--INSERT INTO Users (first_name, surname, gender, email, password) VALUES ("Piotr", "Zakowicz", "male", "piotr.zakowicz@gmail.com", "test")
--INSERT INTO Lifts (name, category, body_part, type) VALUES ("Bench press", "Barbell", "Chest", "Weight & reps")
--INSERT INTO Workouts (name, user_id) VALUES ("Lyft session", 1);
CREATE TABLE IF NOT EXISTS Lifts (id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE, measurement TEXT NOT NULL)
--CREATE TABLE IF NOT EXISTS Workouts(id INTEGER PRIMARY KEY, name TEXT NOT NULL, date_time DATE DEFAULT (datetime('now','localtime')),	user_id INTEGER NOT NULL, FOREIGN KEY(user_id) REFERENCES Users(id));
--DELETE FROM Lifts WHERE id=2
--DROP TABLE Lifts
