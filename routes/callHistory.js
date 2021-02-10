//***** Modules goes here *****//
const express = require('express');
//***** ///// *****//

//***** Express Router to export in module *****//
const app = express.Router();
//***** ///// *****//

//***** Distributing requests *****//

//~~ Start Driving ~~//
const getCallHistory = require('../controllers/callHistory/getCallHistory');

app.use('/get-call-history', getCallHistory);

module.exports = app;