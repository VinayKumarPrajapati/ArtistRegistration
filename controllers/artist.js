const Artist = require('../models/artist');
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