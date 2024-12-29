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

router.post('/:skillTree/edit/:id', async (req, res) => {
    const skillId = req.params.id;
    const { name, description, tasks, resources, score, icon } = req.body;

    try {
        const skill = await Skill.findById(skillId);

        if (!skill) {
            return res.status(404).send('Skill no encontrada');
        }

        skill.name = name;
        skill.description = description;
        skill.tasks = tasks.split('\n');
        skill.resources = resources.split('\n');
        skill.score = score;

        if (icon) {
            skill.icon = `/path/to/icons/${icon.filename}`;
        }

        // Guardar cambios en mongo
        await skill.save();

        res.redirect('/skills');
    } catch (err) {
        res.status(500).send('Error al actualizar la habilidad');
    }
});

module.exports = router;
