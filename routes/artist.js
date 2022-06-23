const express = require('express');
const router = express.Router();

const {enquireArtist} = require('../controllers/artist');

router.get("/" , enquireArtist);

module.exports = router;