const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Celebrity = require('../models/celebrity');
const bodyParser = require('body-parser');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();

    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded' + err
            });
        } else {
            let celebrity = new Celebrity(fields);
            let { name, description, price, category, quantity, shipping } = fields;
            let photo = files.photo;

            if (photo) {
                if (files.photo.size > 10000000) {
                    return res.status(400).json({
                        error: 'Image should be less than 10mb in size'
                    });
                }

                celebrity.photo.data = fs.readFileSync(photo.path);
                celebrity.photo.contentType = photo.type;
            }

            if (!name || !description || !price || !category || !quantity || !shipping) {
                return res.status(400).json({
                    error: 'All fields are required'
                });
            }

            celebrity.save((err, data) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                } else {
                    res.json(data);
                }
            });
        }
    })
};

exports.findCelebrityById = (req, res, next, id) => {
    Celebrity.findById(id)
        .populate('category')
        .exec((err, celebrity) => {
            if (err || !celebrity) {
                res.status(400).json({
                    error: `Celebrity Associated with ID ${id} not found`
                })
            } else {
                req.celebrity = celebrity;
            }

            next();
        });
};

exports.read = (req, res) => {
    let celebrity = req.celebrity;

    if (celebrity) {
        celebrity.photo = undefined;

        return res.json({
            celebrity
        });
    }
};

exports.remove = (req, res) => {
    let celebrity = req.celebrity;

    celebrity.remove((err, deletedCelebrity) => {
        if (err) {
            res.status(400).json({
                error: errorHandler(err)
            })
        } else {
            res.json({
                
                message: 'celebrity successfully removed from the list'
            })
        }
    });
};

exports.removeAllCelebrities = (req, res) => {
    Celebrity.deleteMany({}, (err) => {

        if (err) {
            res.status(400).json({
                error: errorHandler(err)
            });
        } else {
            res.status(200).json({
                message: 'All celebrity removed from the list'
            })
        }
    })
};

exports.update = (req, res) => {
    let form = new formidable.IncomingForm();

    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded' + err
            });
        } else {
            let celebrity = req.celebrity;
            let { name, description, price, category, quantity, shipping } = fields;
            let photo = files.photo;

            celebrity = _.extend(celebrity, fields);

            if (photo) {
                if (files.photo.size > 1000000) {
                    return res.status(400).json({
                        error: 'Image should be less than 1mb in size'
                    });
                }

                celebrity.photo.data = fs.readFileSync(photo.path);
                celebrity.photo.contentType = photo.type;
            }

            if (!name || !description || !price || !category || !quantity || !shipping) {
                return res.status(400).json({
                    error: 'All files are required'
                });
            }

            celebrity.save((err, data) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                } else {
                    res.json(data);
                }
            });
        }
    })
};

exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Celebrity.find()
        .select('-photo')
        .populate('category')
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, celebrities) => {
            if (err) {
                return res.status(400).json({
                    error: 'celebrity not found'
                })
            } else {
                res.send(celebrities);
            }
        })
};

exports.listRelated = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Celebrity.find({
        _id: {$ne: req.celebrity},
        category: req.celebrity.category
    })
        .limit(limit)
        .populate('category', '_id name')
        .exec((err, celebrities) => {
            if (err) {
                return res.status(400).json({
                    error: 'Celebrity not found'
                });
            } else {
                res.json(celebrity);
            }
        });
};

exports.listSkills = (req, res) => {
    Celebrity.distinct('category', {}, (err, categories) => {
        if (err) {
            return res.status(400).json({
                error: 'Categories not found'
            });
        } else {
            res.json(categories);
        }
    });
};

exports.listBySearch = (req, res) => {
    var order = req.body.order ? req.body.order : 'desc';
    var sortBy = req.body.sortBy ? req.body.sortBy : '_id';
    var limit = req.body.limit ? parseInt(req.body.limit) : 100;
    var skip = parseInt(req.body.skip);
    var findArgs = {};

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) { 
            if (key === 'price') {
                findArgs[key] = {

                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]

                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    console.log('findArgs:', findArgs);

    Celebrity.find(findArgs)
        .select('-photo')
        .populate('category')
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: 'Celebrities not found'
                });
            } else {
                res.json({
                    size: data.length,
                    celebrities: data
                });
            }
        })
};

exports.getPhoto = (req, res, next) => {
    if (req.celebrity.photo.data) {
        res.set('Content-Type', req.celebrity.photo.contentType)

        return res.send(req.celebrity.photo.data);
    }

    next();
};

exports.listSearch = (req, res) => {
 
    const query = {};

    if (req.query.search) {
        query.name = {
            $regex: req.query.search,
            $options: 'i'
        }
    }

    if (req.query.category && req.query.category != 'All') {
        query.category = req.query.category
    }

    if(query.name || query.category) {
        console.log('here 2', query);

        Celebrity.find(query, (err, celebrities) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            } else {
                res.json(celebrities);
            }
        }).select('-photo');    
    }
};

exports.decreaseCelebrityQuantity = (req, res, next) => {
    let bulkOps = req.body.order.celebrities.map((item) => {
        return{
            updateOne: {
                filter: {_id: item._id},
                update: {$inc: {
                    quantity: -item.count,
                    sold: +item.count
                }}
            }
        };
    });

    Celebrity.bulkWrite(bulkOps, {}, (error, celebrities) => {
        if (error) {
            return res.status(400).json({
                error: 'Could not update details related to celebrity'
            });
        }

        next();
    })
};