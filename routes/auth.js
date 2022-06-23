const express = require('express');
const router = express.Router();

const { register, login, signout, requireRegister } = require('../controllers/auth');
const {userRegisterValidator} = require('../validator');

router.post("/register" , userRegisterValidator , register);
router.post("/login" , login);
router.get("/sign-out", signout);

router.get('/hello', requireRegister ,(req, res) => {
    res.send('hello there');
});


module.exports = router;