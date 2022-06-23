exports.userRegisterValidator = (req, res, next) => {
    req.check('name','Name is required').notEmpty()
    req.check('email','Email must be atleast 7 character long')
       .matches(/.+\@.+\..+/)
       .withMessage('Email must contain @')
       .isLength({
        min: 7,
        max: 64
       });
    req.check('password','Password is required').notEmpty()
    req.check('password')
       .isLength({min: 7})
       .withMessage('Password Must contain at least 7 Character')
       .matches(/\d/)
       .withMessage("Password must contain digit")
       const errors = req.validationErrors();
       if(errors){
        const firstError = errors.map(error => error.msg)[0]
        return res.status(400).json({ error: firstError });
       }
       next();
};