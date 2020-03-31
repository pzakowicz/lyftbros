//imports
const express = require('express');
const userRouter = require('./users');


// middleware
const apiRouter = express.Router();
apiRouter.use('/users', userRouter);

//exports
module.exports = apiRouter;

