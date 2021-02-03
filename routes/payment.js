//***** Modules goes here *****//
const express = require('express');
//***** ///// *****//

//***** Express Router to export in module *****//
const app = express.Router();
//***** ///// *****//

//***** Distributing requests *****//

//~~ Get Payment ~~//
// const getPayment = require('../controllers/payment/get');
// app.use('/getPayment', getPayment);

//~~ Execute Payment ~~//
const execute = require('../controllers/payment/execute');
app.use('/execute', execute);

module.exports = app;