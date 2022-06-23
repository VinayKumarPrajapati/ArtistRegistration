const express = require('express');
const router = express.Router();

const {register} = require('../controllers/artist');

router.post("/register" , register);

module.exports = router;