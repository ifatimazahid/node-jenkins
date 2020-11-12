var express = require('express');
const usersRouter = require('./users');
const placesRouter = require('./places');
const helpRouter = require('./help');
const passwordRouter = require('./resetPassword');
const callHistoryRouter = require('./callHistory');
var app = express();
/* GET home page. */

app.use('/user', usersRouter);
app.use('/password', passwordRouter);
app.use('/places', placesRouter);
app.use('/help', helpRouter);
app.use('/callHistory', callHistoryRouter);
module.exports = app;
