const express = require('express');
const router = express.Router();


// @route    GET api/profiles/test
// @desc     Tests profile routes
// @access   Public
router.get('/test', (req, res) => res.json({ message: "Profiles works" }));

module.exports = router;
