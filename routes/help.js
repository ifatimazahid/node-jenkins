//***** Modules goes here *****//
const express = require('express');
//***** ///// *****//

//***** Express Router to export in module *****//
const app = express.Router();
//***** ///// *****//

//***** Distributing requests *****//

//~~ Start Driving ~~//
const helpSection = require('../controllers/help/helpSection');
const getHelpSection = require('../controllers/help/getHelpSection');
app.use('/create-section', helpSection);
app.use('/get-section', getHelpSection);


module.exports = app;