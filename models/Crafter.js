const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const CrafterSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  handle: {
    type: String,
    max: 40
  },
  company: {
    type: String
  },
  website: {
    type: String
  },
  location: {
    type: String
  },
  status: {
    type: String,
    required: true
  },
  crafts: {
    type: [String]
  },
  bio: {
    type: String
  },
  experience: [
    {
    title: {
      type: String
    },
    description: {
      type: String
      }
    }
  ],
  social: {
    youtube: {
      type: String
    },
    twitter: {
      type: String
    },
    instagram: {
      type: String
    },
    facebook: {
      type: String
    },
    linkedin: {
      type: String
    },
  },
  date: {
    type: Date,
    default: Date.now
  }
});


module.exports = Crafters = mongoose.model('crafters', CrafterSchema);
