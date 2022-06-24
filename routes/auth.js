const express = require('express');
const router = express.Router();

const { register, login, signout, requireLogin } = require('../controllers/auth');
const {userRegisterValidator} = require('../validator');

router.post("/register" , userRegisterValidator , register);
router.post("/login" , login);
router.get("/sign-out", signout);




module.exports = router;