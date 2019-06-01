const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const cloudinary = require('cloudinary');
const multer = require('multer');
const cloudinaryStorage = require("multer-storage-cloudinary");


//Load Validation

//Load Home Model
const Home = require('../../models/Home');

//Cloudinary config
cloudinary.config({
    cloud_name: 'craftersconnect',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'home',
    allowedFormats: ["jpg", "png", "jpeg"]
});

const upload = multer({
    storage: storage
});

//@route GET api/home/all
//@desc get all Home configs
//@access Public

router.get('/all', (req, res, next) => {
    const errors = {};
    Home.find()
        .then(homeData => {
            if (!homeData) {
                errors.noHomeData = 'Could not load home page data';
                return res.status(404).json(errors);
            }
            res.json({ homeData })
        }).catch(err => {
            res.status(500).json({
                errorMessage: 'An error occured fetching data'
            });
        });
});

//@route POST api/Home
//@desc post new crafter slider
//@access Private
router.post('/slider', upload.single("sliderImage"), (req, res) => {
    console.log("file: ", req.file);
    //const { errors, isValid } = validateHomeInput;

    const homeSlider = {};
    homeSlider.sliderImage = req.file.sliderImage;

    homeSlider.create(homeSlider)
        .then(newImage => res.json(newImage))
        .catch(error => console.log(error));
});




module.exports = router;