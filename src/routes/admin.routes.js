var express = require('express');
var router = express.Router();
const adminController = require('../controllers/admin.controller');
const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.isAdmin) {
        next();
    } else {
        res.status(403).send('Access Denied. Only admins can perform this action.');
    }
};
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

/* Manage users*/

router.get('/users', isAdmin,adminController.viewUsers);

router.post('/change-password',isAdmin, adminController.editUsers);

router.get('/manage-badges', isAdmin,adminController.viewBadges);

router.get('/badges/edit/:id', isAdmin,adminController.viewoneBadge);

router.post('/badges/edit/:id', isAdmin,adminController.editBadges);

router.post('/badges/delete/:id', isAdmin,adminController.deleteBadges);

module.exports = router;
