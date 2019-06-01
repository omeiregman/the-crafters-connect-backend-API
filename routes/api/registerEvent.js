const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const RegisterEvent = require('../../models/RegisterEvent');


//@route POST api/registerevent/new
//@desc  POST register new event
//@access PUBLIC
router.post('/', (req, res, next) => {
    const registerEvent = new RegisterEvent({
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        email: req.body.email,
        eventId: req.body.eventId,
        eventName: req.body.eventName
    });

    registerEvent.save().then(details => {
        console.log("Save event registration..");
        res.status(201).json({
            message: "You have successfully registered for this event.",
            details
        });
    }).catch(err => {
        console.log(err);
        res.status(404).json({
            error: "There was an error registering for this event."
        });
    });
});

module.exports = router;