const Validator = require('validator');
const isEmpty = require('./is-empty');


module.exports = function validateCrafterInput(data) {
  let errors = {};

  data.handle = !isEmpty(data.handle) ? data.handle : '';
  data.status = !isEmpty(data.status) ? data.status : '';
  data.crafts = !isEmpty(data.crafts) ? data.crafts : '';


  if (!Validator.isLength(data.handle, { min: 2, max: 10 })) {
    errors.handle = 'Handle needs to be between 2 and 10 Characters';
  }

  if (!Validator.isLength(data.bio, { min: 50, max: 150 })) {
    errors.bio = 'Bio needs to be between 20 and 150 Characters';
  }

  if (Validator.isEmpty(data.handle)) {
    errors.handle = 'Crafters Handle is required';
  }


  if (Validator.isEmpty(data.status)) {
    errors.status = 'Crafters Status is required';
  }

  if(!isEmpty(data.website)) {
    if(!Validator.isURL(data.website)) {
      errors.website = 'Not a valid URL';
    }
  }

  if(!isEmpty(data.youtube)) {
    if(!Validator.isURL(data.youtube)) {
      errors.youtube = 'Not a valid URL';
    }
  }

  if(!isEmpty(data.twitter)) {
    if(!Validator.isURL(data.twitter)) {
      errors.twitter = 'Not a valid URL';
    }
  }

  if(!isEmpty(data.facebook)) {
    if(!Validator.isURL(data.facebook)) {
      errors.facebook = 'Not a valid URL';
    }
  }

  if(!isEmpty(data.instagram)) {
    if(!Validator.isURL(data.instagram)) {
      errors.instagram = 'Not a valid URL';
    }
  }


  return {
    errors,
    isValid: isEmpty(errors)
    }
}
