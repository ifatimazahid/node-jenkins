//***** Modules goes here *****//
const bcrypt = require('bcryptjs');
const express = require('express');
const Joi = require('joi');
const { UserData } = require('../../Models/user.model');
const multer = require("multer");
const auth = require('../../middleware/auth');
const crypto = require('crypto');
//***** ///// *****//
const DIR = './public/images';
//***** Express Router to export in module *****//
const app = express();
//***** ///// *****//
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR); // for folder name
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${new Date().toISOString().replace(/:/g, "-")}-${file.originalname}`
    );
  }
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
var upload = multer({ storage: fileStorage, fileFilter: fileFilter })
//***** Post Request for Login *****//
app.post('/', auth, upload.single('profile_img'), (req, res) => {
  const url = req.protocol + '://' + req.get('host');
  const { error } = validateUserData(req.body);
  if (error) {
    var errors = {
      success: false,
      msg: error.name,
      data: error.details[0].message
    };
    res.send(errors);
    return;
  }

  checkUser(req.body, req.file, url).then((response) => {
    if (response == 500) {
      var errors = {
        success: false,
        msg: 'No User Found',
        data: ''
      };
      res.send(errors);
    }
    else {
      var checkProfile =  response.profile_img.slice(0,response.profile_img.indexOf("/public"))
      if(checkProfile == 'host'){
        response.profile_img =  response.profile_img.slice(response.profile_img.indexOf("public")-1, response.profile_img.length);
        response.profile_img = `${url}${response.profile_img}`
      }
     
      var success = {
        success: true,
        msg: 'updated successfully',
        data: response
      };
      res.send(success);
    }
  });
});
//***** ///// *****//

//***** User login data validation function *****//
function validateUserData(userData) {
  const schema = Joi.object().keys({
    firstName: Joi.string().min(4).max(30).required(),
    lastName: Joi.string().min(4).max(30).required(),
    mobile: Joi.number(),
    profile_img: Joi,
    bio : Joi.string().min(5).max(1000),
    _id: Joi.string()
  });
  return Joi.validate(userData, schema);
}
//***** ///// *****//

//***** Find User and return function *****//
async function checkUser(body, profile, url) {
  console.log(profile, "profile")
  if (profile) {
    body.profile_img = url + 'host/public/images/' + profile.filename
  }
  if(!body.profile_img){
    body.profile_img = 'host/public/images/user.png'
  }
  body.profile_img = body.profile_img.slice(body.profile_img.indexOf("public")-5, body.profile_img.length);
  
  const update = await UserData.findByIdAndUpdate(body._id, {
    $set: body
  });

  const user = await UserData.findById(update._id).select('-password');
  return (user);
}
//***** ///// *****//

module.exports = app;