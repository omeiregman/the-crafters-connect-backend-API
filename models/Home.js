const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const HomeSchema = new Schema({
    craftStar: {
        type: String,
        length: 25
    },
    craftStarInfo: {
        type: String,
        length: 100
    },
    craftVideo: {
        type: String
    },
    sliderImage: {
        type: String
    },
    sliderText: {
        type: String
    }
});

module.exports = Home = mongoose.model('home', HomeSchema);