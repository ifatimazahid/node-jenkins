//***** Modules goes here *****//
const express = require('express');
//***** ///// *****//

//***** Express Router to export in module *****//
const app = express.Router();
//***** ///// *****//

//***** Distributing requests *****//

//~~ Start Driving ~~//
const helpSection = require('../controllers/help/helpSection');
app.use('/create-section', helpSection);


module.exports = app;