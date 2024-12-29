var express = require('express');
var router = express.Router();
const skillsController = require('../controllers/skills.controller');
const userController = require('../controllers/users.controller');


/* GET home page. */
router.get('/', skillsController.renderIndex);

// Mostrar edición
router.get('/:skillTree/edit/:id', skillsController.renderSkill);

router.post('/:skillTree/edit/:id', skillsController.editSkill);

const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.isAdmin) {
        next();
    } else {
        res.status(403).send('Access Denied. Only admins can perform this action.');
    }
};

router.get('/:skillTree/add', isAdmin, skillsController.renderAddSkill);

router.post('/:skillTree/add', isAdmin, skillsController.saveNewSkill);

module.exports = router;
