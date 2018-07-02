const express = require('express');
const router = express.Router();


// @route    GET api/crafters/test
// @desc     Tests crafters routes
// @access   Public
router.get('/test', (req, res) => res.json({ message: "Crafters work" }));

module.exports = router;
