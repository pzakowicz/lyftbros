-- individual queries
--SELECT * FROM Users
--SELECT * FROM Lifts
--SELECT * FROM Workouts
--SELECT * FROM Sets
--INSERT INTO Users (first_name, surname, gender, email, password) VALUES ("Piotr", "Zakowicz", "male", "piotr.zakowicz@gmail.com", "test")
--INSERT INTO Lifts (name, category, body_part, type) VALUES ("Bench press", "Barbell", "Chest", "Weight & reps")
--INSERT INTO Workouts (name, user_id) VALUES ("Lyft session", 1);
--INSERT INTO Sets (exercise_id, weight, reps, workout_id) VALUES (?, ?, ?, ?), (?, ?, ?, ?)
--CREATE TABLE IF NOT EXISTS Lifts (id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE, measurement TEXT NOT NULL)
--CREATE TABLE IF NOT EXISTS Workouts(id INTEGER PRIMARY KEY, name TEXT NOT NULL, date_time DATE DEFAULT (datetime('now','localtime')),	user_id INTEGER NOT NULL, FOREIGN KEY(user_id) REFERENCES Users(id));
--DELETE FROM Lifts
--DROP TABLE Lifts
/* query for the feed
SELECT
	Workouts.id,
	Workouts.name,
	Workouts.date_time,
	Users.first_name,
	Users.surname,
	Lifts.name,
	Sets.weight,
	Sets.reps
FROM
	Sets
	LEFT JOIN Workouts on Workouts.id = Sets.workout_id
	LEFT JOIN Lifts on Sets.exercise_id = Lifts.id
	LEFT JOIN Users on Workouts.user_id = Users.id;
	*/
	

	
	