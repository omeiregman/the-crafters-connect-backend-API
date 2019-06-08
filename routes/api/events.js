const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const fs = require('fs');
const fileType = require('file-type');
const bluebird = require('bluebird');
const multiparty = require('multiparty');
const mongoose = require('mongoose');



//Multer configuration

//Load Validation
const validateEventInput = require('../../validation/event');

//Load Event Model
const Event = require('../../models/Event');
const RegisterEvent = require('../../models/RegisterEvent');

//Configure the keys for accessing AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

//configure AWS to work with promises
AWS.config.setPromisesDependency(bluebird);

//create S3 instance
const s3 = new AWS.S3();

//abstract function to upload a file returning a promise
const uploadFile = (buffer, name, type) => {
  console.log("upload file");
  const params = {
    ACL: 'public-read',
    Body: buffer,
    Bucket: process.env.S3_BUCKET_NAME,
    ContentType: type.mime,
    key: `${name}.${type.ext}`
  };
  return s3.upload(params).promise();
};




// @route    GET api/Events
// @desc     get all events
// @access   Public
router.get('/all', (req, res, next) => {
  const errors = {};
  Event.find()
    .then(events => {
      if (!events) {
        errors.noevent = 'There are currently no events to display at the moment';
        return res.status(404).json(errors);
      }
      res.json({ events: events });
    }).catch(err => {
      res.status(404).json({
        event: 'There are currently no events to display at the moment'
      });
    })
});

// @route    GET api/events/:event
// @desc     GET single event by ID
// @access   Public

router.get('/:event', (req, res, next) => {
  //const name = req.params.name;
  Event.findById(req.params.event)
    .exec().then(event => {
      if (event) {
        res.status(200).json({
          message: "Event Found",
          event: event
        });
      } else {
        res.status(404).json({
          message: "This event is not available anymore"
        });
      }
    }).catch(err => {
      res.status(404).json({
        event: "There was a problem fetching this event"
      })
    })
})



// @route    POST api/Events/new
// @desc     POST new events
// @access   Private
router.post('/add', (req, res, next) => {
  const { errors, isValid } = validateEventInput;

  //check validation
  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }
  const eventFields = {};
  if (req.body.eventBanner) eventFields.eventBanner = req.body.eventBanner;
  if (req.body.eventThumbnail) eventFields.eventThumbnail = req.body.eventThumbnail;
  if (req.body.name) eventFields.name = req.body.name;
  if (req.body.description) eventFields.description = req.body.description;
  if (req.body.location) eventFields.location = req.body.location;
  if (req.body.startDate) eventFields.startDate = req.body.startDate;
  if (req.body.endDate) eventFields.endDate = req.body.endDate;
  if (req.body.time) eventFields.time = req.body.time;
  if (req.body.info) eventFields.info = req.body.info;
  if (req.body.url) eventFields.url = req.body.url;
  if (req.body.registration) eventFields.registration = req.body.registration;


  const event = new Event({
    eventBanner: eventFields.eventBanner,
    eventThumbnail: eventFields.eventThumbnail,
    name: eventFields.name,
    description: eventFields.description,
    location: eventFields.location,
    startDate: eventFields.startDate,
    endDate: eventFields.endDate,
    time: eventFields.time,
    info: eventFields.info,
    url: eventFields.url,
    registration: eventFields.registration
  });

  event.save().then(event => {
    res.status(201).json({
      message: "New Event has been added",
      event: event
    });
  }).catch(err => {
    res.status(404).json({
      error: 'There was an error creating this event'
    })
  });
});


router.post('/test-upload', (req, res, next) => {
  console.log("inside router");

  const form = new multiparty.Form();

  form.parse(req, async (error, fields, files) => {
    if (error) {
      console.log("Error: ", error);
      throw new Error(error);
    }
    try {
      console.log("inside try block");
      const path = files.file[0].path;
      const buffer = fs.readFileSync(path);
      const type = fileType(buffer);
      const timestamp = Date.now().toString();
      const fileName = `bucketFolder/${timestamp}-lg`;
      const data = await uploadFile(buffer, fileName, type);
      return res.status(201).send(data)
    } catch (error) {
      console.log("Catch: ", error);
      return res.status(400).send(error);
    }
  });
});

// @route    DELETE api/Events/remove
// @desc     DELETE events
// @access   Private

router.delete('/:eventId', (req, res, next) => {
  const id = req.params.eventId;
  Event.remove({
    _id: id
  }).exec().then(event => {
    res.status(200).json({
      message: "successfully deleted",
      event: id
    });
  }).catch(err => {
    res.status(500).json(err);
  });
});


//@route POST api/registerevent/new
//@desc  POST register new event
//@access PUBLIC
router.post('/register', (req, res, next) => {
  const registerEvent = new RegisterEvent({
    name: req.body.name,
    address: req.body.address,
    phone: req.body.phone,
    email: req.body.email,
    eventId: req.body.eventId,
    eventName: req.body.eventName
  });

  registerEvent.save().then(details => {
    res.status(201).json({
      message: "You have successfully registered for this event.",
      details
    });
  }).catch(err => {
    res.status(404).json({
      error: "There was an error registering for this event."
    });
  });
});

module.exports = router;
