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
const changeStatus = require('../controllers/party/changeStatus');
app.use('/changeStatus', changeStatus);

//~~ Get party details ~~//
const details = require('../controllers/party/details');
app.use('/details', details);

// ~~ Edit a party ~~//
const edit = require('../controllers/party/edit');
app.use('/edit', edit);

// ~~ Remove a member ~~//
const removeMember = require('../controllers/party/removeMember');
app.use('/removeMember', removeMember);

//~~ Host a party ~~//
const deleteParty = require('../controllers/party/delete');
app.use('/delete', deleteParty);

module.exports = app;
