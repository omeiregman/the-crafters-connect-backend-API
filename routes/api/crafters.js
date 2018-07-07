const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load Validation
const validateCrafterInput = require('../../validation/crafter');

//Load Crafter model
const Crafter = require('../../models/Crafter');

//Load User model
const User = require('../../models/User');


// @route    GET api/crafters/test
// @desc     Tests crafters routes
// @access   Public
router.get('/test', (req, res) => res.json({ message: "Crafters work" }));


// @route    GET api/crafter
// @desc     Get current crafters profile
// @access   Private

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};

    Crafter.findOne({ user: req.user.id }).
    then(crafter => {
      if(!crafter) {
        errors.noprofile = 'This User is not a registered crafter';
        return res.status(404).json(errors);
      }
      res.json(crafter);
    }).catch(err => res.status(404).json(err));
});

// @route    GET api/profile/handle/:handle
// @desc     GET Profile by handle
// @access   Public

router.get('/handle/:handle', (req, res) => {
  Crafter.findOne({ handle: req.params.handle })
  .populate('user', ['name', 'avatar'])
  .then(crafter => {
    if(!crafter) {
      errors.nocrafter = 'There is no Crafter with this handle';
      res.status(404).json(err);
    }
    res.json(crafter);
  }).catch(err => res.status(404).json(err));
});


// @route    GET api/profile/user/:user_id
// @desc     GET Profile by userID
// @access   Public

router.get('/user/:user_id', (req, res) => {
  Crafter.findOne({ user: req.params.user_id })
  .populate('user', ['name', 'avatar'])
  .then(crafter => {
    if(!crafter) {
      errors.nocrafter = 'There is no Crafter with this handle';
      res.status(404).json(err);
    }
    res.json(crafter);
  }).catch(err => res.status(404).json({ profile: 'There is no profile for this user' }));
});


// @route    GET api/crafter/all
// @desc     GET all Profile
// @access   Public

router.get('/all', (req, res) => {
  const errors = {};
  Crafter.find()
  .populate('user', ['name', 'avatar'])
  .then(crafters => {
    if(!crafters) {
      errors.nocrafter = 'There are no Crafters to Display';
      return res.status(404).json(errors);
    }
    res.json(crafters);
  }).catch(err => {
    res.status(404).json({ crafter: 'There are no crafters to Display'})
  })
})



// @route    POST api/crafter
// @desc     Create Crafters profile
// @access   Private

router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {

  const { errors, isValid } = validateCrafterInput(req.body);

  // Check Validation
  if(!isValid) {
    //Return any errors with 400 Statusr
    return res.status(400).json(errors);
  }
  // Get fields
  const crafterFields = {};
  crafterFields.user = req.user.id;
  if(req.body.handle) crafterFields.handle = req.body.handle;
  if(req.body.company) crafterFields.company = req.body.company;
  if(req.body.website) crafterFields.website = req.body.website;
  if(req.body.location) crafterFields.location = req.body.location;
  if(req.body.bio) crafterFields.bio = req.body.bio;
  if(req.body.status) crafterFields.status = req.body.status;
  //Skills split into array
  if (typeof req.body.crafts != 'undefined') {
    crafterFields.crafts = req.body.crafts.split(',');
  }

  //social
  crafterFields.social = {};
  if(req.body.youtube) crafterFields.social.youtube = req.body.youtube;
  if(req.body.twitter) crafterFields.social.twitter = req.body.twitter;
  if(req.body.facebook) crafterFields.social.facebook = req.body.facebook;
  if(req.body.instagram) crafterFields.social.instagram = req.body.instagram;

  Crafter.findOne({ user: req.user.id })
  .populate('user', ['name', 'avatar', 'email'])
  .then(crafter => {
    if(crafter) {
      //update
      Crafter.findOneAndUpdate({
        user: req.user.id },
        { $set: crafterFields },
        { new: true }).then(crafter => res.json(crafter));
    } else {
      //Create

      //Check if handle exists
      Crafter.findOne({ handle: crafterFields.handle }).then(crafter => {
        if (crafter) {
          errors.hanlde = 'That handle already exists';
          res.status(400).json(errors);
        }
        //Save Profile
        new Crafter(crafterFields).save().then(crafter => res.json(crafter));
      });
    }
  });
});



module.exports = router;
