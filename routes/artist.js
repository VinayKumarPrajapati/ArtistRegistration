const express = require('express');
const router = express.Router();

const { register } = require('../controllers/artist');
const {userRegisterValidator} = require('../validator');

router.post("/register" , register);

module.exports = router;