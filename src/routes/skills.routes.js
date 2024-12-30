var express = require('express');
var router = express.Router();
const skillsController = require('../controllers/skills.controller');

const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.isAdmin) {
        next();
    } else {
        res.status(403).send('Access Denied. Only admins can perform this action.');
    }
};

const isLogin = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(403).send('Access Denied. Only users can perform this action.');
    }
};

/* GET home page. */
router.get('/', isLogin, (req, res) => {
    res.redirect(`/skills/electronics`);
});

router.get('/:skillTree', isLogin, skillsController.renderIndex)

//Añadir una skill

router.get('/:skillTree/add', isAdmin, skillsController.renderAddSkill);
router.post('/:skillTree/add', isAdmin, skillsController.saveNewSkill);

//visualizar skill
router.get('/:skillTree/view/:skillID', isLogin, skillsController.viewCompetencia);

//verify
router.post('/:skillTreeName/:skillID/verify', isLogin, skillsController.verifyEvidence);

// Mostrar edición
router.get('/:skillTree/edit/:id', isAdmin, skillsController.renderEditSkill);

router.post('/:skillTree/edit/:id', isAdmin, skillsController.updateSkill);

//crear evidencia
router.post('/:skillTreeName/submit-evidence', isLogin, skillsController.addEvidence);

//eliminar skill
router.get('/delete/:id', isAdmin, skillsController.deleteSkill);

module.exports = router;
