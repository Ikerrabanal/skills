var express = require('express');
var router = express.Router();
const skillsController = require('../controllers/skills.controller');
const userController = require('../controllers/users.controller');


/* GET home page. */
router.get('/', skillsController.renderIndex);

// Mostrar edición
router.get('/:skillTree/edit/:id', userController.isAdmin, (req, res) => {
    const { skillTree, id } = req.params;

    const skill = skills.find(s => s.id === id && s.skillTree === skillTree);

    if (!skill) {
        return res.status(404).send('Skill no encontrada');
    }

    res.render('edit-skill', { skill });
});

module.exports = router;
