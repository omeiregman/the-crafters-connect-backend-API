const Validator = require('validator');
const isEmpty = require('./is-empty');


module.exports = function validateEventInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.date = !isEmpty(data.date) ? data.startDate : '';
  data.description = !isEmpty(data.description) ? data.description : '';
  data.location = !isEmpty(data.location) ? data.location : '';
  data.info = !isEmpty(data.info) ? data.info : '';


  if (!Validator.isLength(data.description, { min: 20, max: 50 })) {
    errors.description = 'A short Description needs to be between 20 and 50 Characters';
  }

  if (!Validator.isLength(data.info, { min: 20, max: 500 })) {
    errors.info = 'Event Information needs to be between 20 and 50 Characters';
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Event name is required';
  }

  if (Validator.isEmpty(data.startDate)) {
    errors.date = 'Event date is required';
  }

  if (Validator.isEmpty(data.location)) {
    errors.location = 'Event location is required';
  }

  if (Validator.isEmpty(data.info)) {
    errors.info = 'Event info is required';
  }


  return {
    errors,
    isValid: isEmpty(errors)
    }
}
