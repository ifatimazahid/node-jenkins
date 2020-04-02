var express = require('express');
const usersRouter = require('./users');
const placesRouter = require('./places');
const passwordRouter = require('./resetPassword');
var app = express();
/* GET home page. */

app.use('/user', usersRouter);
app.use('/password', passwordRouter);
app.use('/places', placesRouter);
module.exports = app;
