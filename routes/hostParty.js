//***** Modules goes here *****//
const express = require('express');
//***** ///// *****//

//***** Express Router to export in module *****//
const app = express.Router();
//***** ///// *****//

//***** Distributing requests *****//

//~~ Get all parties ~~//
const getParties = require('../controllers/party/getParties');
app.use('/getParties', getParties);

//~~ Host a party ~~//
const host = require('../controllers/party/host');
app.use('/host', host);

// ~~ Accept / Reject a party ~~//
const edit = require('../controllers/party/changeStatus');
app.use('/changeStatus', edit);

//~~ Host a party ~~//
const deleteParty = require('../controllers/party/delete');
app.use('/delete', deleteParty);

module.exports = app;