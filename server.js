// imports
const bodyParser = require('body-parser');
const cors = require('cors');
const errorhandler = require('errorhandler');
const morgan = require('morgan');
const express = require('express');
const apiRouter = require('./api/api');
const path = require('path');

// create application
const app = express();
const PORT = process.env.PORT || 4000;

//middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors());
app.use('/api', apiRouter);
app.use(express.static(path.join(__dirname, './static')));
app.use(errorhandler());

//routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './static/login.html'));
});


//starting app
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Listening on port: ${PORT}`);
});

//export
module.exports = app;