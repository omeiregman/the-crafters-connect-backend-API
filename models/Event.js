const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema

const EventSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  startDate: {
    type: String,
    required: true
  },
  endDate: {
    type: String
  },
  time: {
    type: String
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  eventImage: {
    type: String
  },
  createdDate: {
    type: Date,
    default: Date.now()
  },
  info: {
    type: String,
    required: true
  }
});

module.exports = Event = mongoose.model('events', EventSchema);
