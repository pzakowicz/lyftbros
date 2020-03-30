// imports
const bodyParser = require('body-parser');
const cors = require('cors');
const errorhandler = require('errorhandler');
const morgan = require('morgan');
const express = require('express');
const apiRouter = require('./api/api');

// create application
const app = express();
const PORT = process.env.PORT || 4000;

//middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors());
app.use('/api', apiRouter)
app.use(express.static('public'))
app.use(errorhandler());


//starting app
app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});

//export
module.exports = app;