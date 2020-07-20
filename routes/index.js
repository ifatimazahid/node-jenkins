var express = require('express');
const usersRouter = require('./users');
const placesRouter = require('./places');
const helpRouter = require('./help');
const passwordRouter = require('./resetPassword');
var app = express();
/* GET home page. */

app.use('/user', usersRouter);
app.use('/password', passwordRouter);
app.use('/places', placesRouter);
app.use('/help', helpRouter);
module.exports = app;
