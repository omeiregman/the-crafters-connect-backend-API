const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

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


// @route    POST api/crafter
// @desc     Create Crafters profile
// @access   Private

router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
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
  if (typeof req.body.skills != 'undefined') {
    crafterFields.skills = req.body.skills.split(',');
  }

  //social
  crafterFields.social = {};
  if(req.body.youtube) crafterFields.social.youtube = req.body.youtube;
  if(req.body.twitter) crafterFields.social.twitter = req.body.twitter;
  if(req.body.facebook) crafterFields.social.facebook = req.body.facebook;
  if(req.body.instagram) crafterFields.social.instagram = req.body.instagram;

  Crafter.findOne({ user: req.user.id })
  .then(crafter => {
    if(crafter) {
      //update
      Crafter.findOneAndUpdate({
        user: req.user.id },
        { $set: crafterFields },
        { new: true }).then(crafter => res.json(crater));
    } else {
      //Create

      //Check if handle exists
      Crafter.findOne({ handle: crafterFields.handle }).then(crafter => {
        if (profile) {
          errors.hanlde = 'That handle already exists';
          res.status(400).json(errors);
        }
        //Save Profile
        new Crafter(crafterFields).save().then(crafter => res.json(profile));
      });
    }
  });
});



module.exports = router;
