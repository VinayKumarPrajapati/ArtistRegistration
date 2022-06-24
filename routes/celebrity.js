const express = require('express');
const router = express.Router();
const {
    create,
    remove,
    update,
    read,
    list,
    getPhoto,
    listSearch,
    listBySearch,
    listRelated,
    listSkills,
    findCelebrityById,
    removeAllCelebrities} = require('../controllers/celebrity');
const {findArtistById} =  require('../controllers/artist');
const {requireLogin, isAuth, isAdmin} =  require('../controllers/auth');

router.post('/celebrity/create/:userId', requireLogin, isAuth, isAdmin, create);
router.get('/celebrity/:productId', read);
router.get('/celebrity', list);
router.get('/celebrity/search', listSearch);
router.get('/celebrity/photo/:celebrityId', getPhoto);
router.post('/celebrities/by/search', listBySearch);
router.get('/celebrities/related/:celebrityId', listRelated);
router.get('/celebrities/categories', listSkills);
router.delete('/celebrity/destroy/:userId', requireLogin, isAuth, isAdmin, removeAllCelebrities);
router.put('/celebrity/:celebrityId/:userId', requireLogin, isAuth, isAdmin, update);
router.delete('/celebrity/:celebrityId/:userId', requireLogin, isAuth, isAdmin, remove);


router.param('celebrityId', findCelebrityById);
router.param('artistId', findArtistById);

module.exports = router;