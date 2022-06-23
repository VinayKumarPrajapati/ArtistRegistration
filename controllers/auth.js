const Artist = require('../models/artist');
const jwt = require('jsonwebtoken');
const { expressJwt } = require('express-jwt');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.register = (req, res) => {
    console.log(req.body);
    const artist = new Artist(req.body);

    artist.save((err, artist) => {
        if(err){
            return res.status(400).json({
                err: errorHandler(err)
            });
        }
        artist.salt = undefined;
        artist.hash_password = undefined;
        res.json({
            artist
        });
    });
};





exports.login  = (req, res) => {
    const {email, password} = req.body;
    Artist.findOne({email},(err, artist) => {
        if(err || !artist){
            return res.status(400).json({
                err: 'User with this email does not exists Please Register'
            });
        }

        if(!artist.authenticate(password)){
            return res.status(401).json({
                error: 'Email and Password do not match'
            });
        }   

        

        const token = jwt.sign({_id: artist._id}, process.env.JWT_SECRET);

        res.cookie('t', token, { expire: new Date() + 9999 } );

        const {_id, name, email, artistType} = artist;

        return res.json({ token, artist: {_id, email, name, artistType}});


    });
}

exports.signout = (req, res) => {
    res.clearCookie('t');
    res.json({message: 'Sign out Successfully'});
};

exports.requireRegister = expressJwt({
    secret: process.env.JWT_SECRET,
    artistProperty: 'auth'
});