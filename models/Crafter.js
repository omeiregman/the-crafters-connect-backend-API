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
    required: true,
    max: 40
  },
  experience: [
    {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
      },
    from: {
      type: Date,
      required: true
      },
    to: {
      type: Date
      },
    current: {
      type: Boolean,
      default: false
      }
    }
  ],
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


module.exports = Crafter = mongoose.model('crafters', CrafterSchema);
