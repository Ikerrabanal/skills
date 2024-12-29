const path = require("node:path");
const multer = require('multer');
const upload = multer({ dest: '../public/electronics/icons/' })
const Skill = require('../models/Skill');
const UserSkill = require('../models/UserSkill');

exports.renderIndex = async (req, res, next) => {
    try {
        if(req.session.user) {
            //Hay que pasarle el usuario, las habilidades,...
            allSkills = await Skill.find();
            console.log('Usuario en sesión:', req.session.user);
            userSkills = await UserSkill.find({user: req.session.user._id});
            res.render('skills', {user: req.session.user, skills: allSkills});
        } else {
            res.redirect('/users/login')
        }
    } catch (error) {
        next(error);
    }
};

exports.renderSkill = async (req, res, next) => {
    const tree = req.params.skillTree;
    const skillId = parseInt(req.params.id, 10); // Convert skillId to integer
    const skill = await Skill.findOne({ id: skillId });
    if (!skill) {
        return res.status(404).send('Skill not found');
    }

    res.render('edit-skill', { skill: skill, tree: tree });
};



exports.editSkill = async (req, res) => {
    const skillId = req.params.id;
    const { text, description, tasks, resources, score } = req.body;
    console.log(req.body)
    try {
        const skill = await Skill.findOne({ id: skillId });

        if (!skill) {
            return res.status(404).send('Skill no encontrada');
        }
        console.log(text)
        skill.id = skillId;
        skill.text = text;
        skill.description = description;
        skill.tasks = tasks.split('\n');
        skill.resources = resources.split('\n');
        skill.score = score;

        if (icon) {
            skill.icon = icon;
        }

        // Guardar cambios en mongo
        await skill.findOneAndUpdate({ id: skillId }, skill);
        res.redirect('/skills');
    } catch (err) {
        console.log(err);
        res.status(500).send('Error al guardar los cambios');
    }
};