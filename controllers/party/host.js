
//***** Modules goes here *****//
const express = require('express');
const Joi = require('joi');
const { PartyData } = require('../../Models/party.model');
const upload = require("../../constants/multer");
const cloudinary = require("../../constants/cloudinary");
const fs = require("fs");


const app = express();

app.post('/',
  upload.fields([{ name: "image" }]),
  async (req, res) => {
    const { error } = validateApiData(req.body);

    if (error) {
      var errors = {
        success: false,
        msg: error.name,
        data: error.details[0].message
      };
      res.status(403).send(errors);
      return;
    }

    const file = req.files.image;
    if (file == null) {
      var errors = {
        success: false,
        msg: 'Party Image is required'
      };
      res.status(403).send(errors);
      return;
    }

    const image = async (path) => await cloudinary.uploads(path, "partyImage");
    const img = req.files.image[0];
    const { path } = img;
    const imgURL = await image(path);
    fs.unlinkSync(path);
    req.body.image = imgURL.url;
    const hostAParty = await hostParty(req.body)

    var success = {
      success: true,
      msg: 'Party created successfully!',
      data: hostAParty
    };
    res.send(success);
    return;
  })

async function hostParty(body) {
  return new Promise((resolve, reject) => {

    // console.log(body, '//////////')
    try {
      const party = new PartyData(body);
      const result = party.save();
      resolve(result);
    }
    catch (err) {
      reject(err);
    }
  })
}

function validateApiData(body) {
  const schema = Joi.object().keys({
    event_name: Joi.string().required(),
    date: Joi.date().required(),
    from_time: Joi.string().regex(/\b((1[0-2]|0?[1-9]):([0-5][0-9]))/).required(),
    till_time: Joi.string().regex(/\b((1[0-2]|0?[1-9]):([0-5][0-9]))/).required(),
    latitude: Joi.string().required(),
    longitude: Joi.string().required(),
    members: Joi.array().items(
      Joi.object({
        phone: Joi.number().required(),
        isOwner: Joi.boolean().required()
      })
    )
  });
  return Joi.validate(body, schema)
}

module.exports = app;
