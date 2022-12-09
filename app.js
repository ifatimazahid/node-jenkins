var createError = require("http-errors");
const express = require("express");
const http = require("http");
const https = require("https");
const mongoose = require("mongoose");
const dotenv = require('dotenv').config();
const fs = require('fs')

var app = express();
app.use(express.static(__dirname + '/public'));
app.use(express.json());
const router = require("./routes/index");

// mongoose
//   .connect(
//     process.env.MONGO_CONNECT_STRING,
//     { useNewUrlParser: true }
//   ).catch((err) => console.error("Could not connect to database...", err));

const SERVICE_PORT = process.env.PORT;
http.createServer(app).listen(SERVICE_PORT)

// const options = {
//   cert: fs.readFileSync('./certificate/certificate.crt', 'utf8'),
//   key: fs.readFileSync('./certificate/privateKey.key', 'utf8'),
// }

// https.createServer(options, app).listen(SERVICE_PORT)

console.log('HTTP server is listening on ', SERVICE_PORT)

app.use("/api", router);
app.use(function (req, res, next) {
  next(createError(404));
});


app.use(function (err, req, res, next) {
  res.status(err.status || 500);
});

module.exports = app;
