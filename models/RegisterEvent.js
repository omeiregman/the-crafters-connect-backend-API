const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const RegisterEventSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    eventId: {
        type: String,
        required: true
    },
    eventName: {
        type: String,
        require: true
    }
});

module.exports = RegisterEvent = mongoose.model('RegisterEvent', RegisterEventSchema);