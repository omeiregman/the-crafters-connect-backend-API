const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

//Load User model
const Userr = require('../../models/User');


// @route    GET api/users/test
// @desc     Tests users routes
// @access   Public
router.get('/test', (req, res) => res.json({ message: "Users works" }));


// @route    POST api/users/register
// @desc     Register user
// @access   Public
router.post('/register', (req, res) => {
  User.findOne({ email: req.body.email })
  .then(user => {
    if(user) {
      return res.status(400).json({ email: 'Email already exists' });
    } else {
      const avatar = gravatar.url(req.body.url, {
        s: 200, //Size
        r: 'pg', // Rating
        default: 'mm' //Default
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if(err) throw err;
          newUser.password = hash;
          newUser.save()
          .then(user => res.status(201).json(user))
          .catch(err => console.log(err));
        })
      })
    }
  })
});

module.exports = router;
