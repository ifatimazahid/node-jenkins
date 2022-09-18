var express = require('express');
var app = express();

const getCourses = require('../controllers/courses/get');
app.use('/courses', getCourses);

const addCourse = require('../controllers/courses/add');
app.use('/course', addCourse);

module.exports = app;
