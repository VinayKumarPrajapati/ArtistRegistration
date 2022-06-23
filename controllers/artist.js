const Artist = require('../models/artist');

exports.userById = () => (req, res, next, id) => {
    Artist.findById(id).exec((err, artist) => {
        if(err || !artist){
            return res.send(400).json({
                error: 'Artist Not Found';
            });
        }
        req.profile = artist;
        next();
    });
};