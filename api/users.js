//imports
const express = require('express');
const userRouter = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('../database.sqlite')

// middleware


// request handlers
userRouter.post('/users', (req, res, next) => {
    const name = req.body.user.name;
    const surname = req.body.user.surname;
    const gender = req.body.user.gender;
    const email = req.body.user.email;
    const password = req.body.user.password;
    
    if (!name || !surname || !gender || !email || !password ) {
        return res.sendStatus(400);
    } else {
        db.run("INSERT INTO Users (name, surname, gender, email, password) VALUES ($name, $surname, $gender, $email, $password)", {
            $name: name, 
            $surname: surname, 
            $gender: gender, 
            $email: email, 
            $password: password
        }, function(error) {
            if (error) {
                next(error);
            } else {
                db.get(`SELECT * FROM Users WHERE id = ${this.lastID}`, (error, row) => {
                    res.status(201).json({user: row});
                })
            }
        })
    }
});

//exports
module.exports = userRouter;