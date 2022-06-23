const express = require('express');
const router = express.Router();


const { requireLogin } = require('../controllers/auth');
const { userById } = requrie('../controllers/artist');

router.get('/secret/:userId', requireLogin, (req, res) => {
    res.json({
        artist: req.profile
    });
});

router.param('userId',userById);

module.exports = router;