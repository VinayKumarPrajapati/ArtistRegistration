const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/artist');
const {userRegisterValidator} = require('../validator');

router.post("/register" , userRegisterValidator , register);
router.post("/login" , userRegisterValidator , login);


module.exports = router;