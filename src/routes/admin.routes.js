var express = require('express');
var router = express.Router();
const adminController = require('../controllers/admin.controller');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

/* Manage users*/

router.get('/users', adminController.viewUsers);

router.post('/change-password', adminController.editUsers);

router.get('/manage-badges', adminController.viewBadges);

router.get('/badges/edit/:id', adminController.viewoneBadge);

router.post('/badges/edit/:id', adminController.editBadges);

router.post('/badges/delete/:id', adminController.deleteBadges);

module.exports = router;
