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
/*--query for the feed
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
	LEFT JOIN Users on Workouts.user_id = Users.id;*/	
-- query for PRs
/*SELECT Sub1.name, Sub1.five_reps, Sub2.ten_reps 
FROM (SELECT Lifts.name, MAX(Sets.weight) as five_reps, Sets.reps FROM Sets LEFT JOIN Lifts on Sets.exercise_id = Lifts.id LEFT JOIN Workouts on Sets.workout_id = Workouts.id LEFT JOIN Users on Workouts.user_id = Users.id WHERE Users.email = "piotr.zakowicz@gmail.com" AND Sets.reps = 5 GROUP BY Lifts.name) AS Sub1
JOIN (SELECT Lifts.name, MAX(Sets.weight) as ten_reps, Sets.reps FROM Sets LEFT JOIN Lifts on Sets.exercise_id = Lifts.id LEFT JOIN Workouts on Sets.workout_id = Workouts.id LEFT JOIN Users on Workouts.user_id = Users.id WHERE Users.email = "piotr.zakowicz@gmail.com" AND Sets.reps = 10 GROUP BY Lifts.name) AS Sub2
ON Sub1.name = Sub2.name
GROUP BY Sub1.name*/
--query for fist bumps
/*SELECT Sub1.workout_id, Sub1.user_id, Sub3.first_name, Sub3.surname, Sub2.count as "fist_bump_count"
FROM (SELECT workout_id, user_id FROM Fist_bumps) AS Sub1
JOIN (SELECT workout_id, COUNT(user_id) as "count" FROM Fist_bumps GROUP BY workout_id) AS Sub2 ON Sub1.workout_id = Sub2.workout_id 
JOIN (SELECT Users.id, Users.first_name, Users.surname FROM Users) AS Sub3 ON Sub1.user_id = Sub3.id
ORDER BY Sub1.workout_id ASC;*/
--query for the leaderboard
/* SELECT Users.first_name, Users.surname, Lifts.name, COUNT(DISTINCT Workouts.id) as "workouts", SUM(Sets.reps * Sets.weight) as volume
FROM Sets
LEFT JOIN Workouts on Workouts.id = Sets.workout_id
LEFT JOIN Lifts on Sets.exercise_id = Lifts.id
LEFT JOIN Users on Workouts.user_id = Users.id
WHERE Workouts.date_time BETWEEN datetime('now', '-1 month') AND datetime('now', 'localtime')
GROUP BY first_name, surname */
	
	