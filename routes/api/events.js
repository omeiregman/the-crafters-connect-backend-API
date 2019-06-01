const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');


//Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/events/');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  //reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

//Load Validation
const validateEventInput = require('../../validation/event');

//Load Event Model
const Event = require('../../models/Event');
const RegisterEvent = require('../../models/RegisterEvent');


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
router.post('/add', upload.single('eventImage'), (req, res, next) => {
  const { errors, isValid } = validateEventInput;

  //check validation
  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }
  const eventFields = {};
  if (req.body.eventImage) eventFields.eventImage = req.file.path;
  if (req.body.name) eventFields.name = req.body.name;
  if (req.body.description) eventFields.description = req.body.description;
  if (req.body.location) eventFields.location = req.body.location;
  if (req.body.startDate) eventFields.startDate = req.body.startDate;
  if (req.body.endDate) eventFields.endDate = req.body.endDate;
  if (req.body.time) eventFields.time = req.body.time;
  if (req.body.info) eventFields.info = req.body.info;
  if (req.body.url) eventFields.url = req.body.url;
  if (req.body.registration) eventFields.registration = req.body.registration;




  console.log("Event field File Path: ", eventFields.eventImage);
  console.log("File Path: ", req.file.path);


  const event = new Event({
    eventImage: req.file.path,
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
    console.log("Event: ", event);
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


module.exports = router;
