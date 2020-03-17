var createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const passwordRouter = require('./routes/resetPassword');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cors = require('cors');
//***** ///// *****//
var app = express();
// mongoose.connect('mongodb+srv://mudassir:HP6910pc@smartlybiz-v9pjm.mongodb.net?authSource=admin')
mongoose.connect('mongodb://localhost/gpsApp')
.then(()=> console.log('connected to GPS APP...'))
.catch((err)=> console.error('Could not connect to database...', err));
//***** ///// *****//

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/', indexRouter);
app.use('/api/user', usersRouter);
app.use('/api/password', passwordRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
