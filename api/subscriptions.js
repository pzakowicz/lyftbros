//imports
const express = require("express");
const mysql = require("mysql2");
const config = require("../config");
const webPush = require('web-push');

//create router
const subscriptionRouter = express.Router();

//set up variables

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;
webPush.setVapidDetails('mailto:piotr.zakowicz@gmail.com', publicVapidKey, privateVapidKey);


//send a notification
subscriptionRouter.post('/subscribe', (req, res) => {
  const subscription = req.body

  res.status(201).json({});

  const payload = JSON.stringify({
    title: 'Lyftbros',
  });

  webPush.sendNotification(subscription, payload)
    .catch(error => console.error(error));
});

//POST - save a subscription
subscriptionRouter.post("/save", (req, res, next) => {
  const user_id = req.user[0].id;
  const endpoint = req.body.endpoint;
  const expirationTime = req.body.expirationTime;
  const p256dh = req.body.keys.p256dh;
  const auth = req.body.keys.auth;
  if (!endpoint) {
    console.log("Insufficient data to save subscription.")
    return res.sendStatus(400);
  } else {
    console.log(req.body);  

    let connection = mysql.createConnection(config);
    connection.query(`INSERT INTO subscriptions (user_id, endpoint, expirationTime, p256dh, auth) VALUES (?, ?, ?, ?, ?)`, [user_id, endpoint, expirationTime, p256dh, auth], (error, results, fields) => {
      if (error) {
        console.error(error.message);
        return res.sendStatus(400)
      }
      console.log("Subscription saved")
      return res.sendStatus(201);
    });
    connection.end();

  }
  });


//exports
module.exports = subscriptionRouter;