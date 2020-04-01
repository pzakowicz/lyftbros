//imports
const express = require('express');
const userRouter = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite')

// middleware


// request handlers
const response = { 
    user: {}
};

userRouter.post('/users', (req, res, next) => {
    const name = req.query.name;
    const surname = req.query.surname;
    //const gender = req.params.gender;
    const email = req.query.email;
    const password = req.query.password;
    
    if (!name || !surname || !email || !password ) {
        return res.sendStatus(400);
    } else {
        db.run("INSERT INTO Users (name, surname, email, password) VALUES ($name, $surname, $email, $password)", {
            $name: name, 
            $surname: surname, 
            $email: email, 
            $password: password
        }, function(error) {
            if (error) {
                next(error);
            } else {
                db.get(`SELECT * FROM Users WHERE id = ${this.lastID}`, (error, row) => {
                    response.user = row
                    res.status(201).send(response)
                    //res.status(201).json({user: row});
                })
            }
        })
    }
});

//exports
module.exports = userRouter;