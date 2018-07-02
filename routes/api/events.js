const express = require('express');
const router = express.Router();


// @route    GET api/Events/test
// @desc     Tests events routes
// @access   Public
router.get('/test', (req, res) => res.json({ message: "Events work" }));

module.exports = router;
