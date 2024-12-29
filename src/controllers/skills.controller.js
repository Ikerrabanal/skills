const path = require("node:path");

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


exports.renderAddSkill = (req, res) => {
    const { skillTree } = req.params;
    res.render('add-skill', { skillTree });
};

exports.saveNewSkill = async (req, res) => {
    try {
        const { skillTree } = req.params;
        const { text, description, score, tasks, resources, icon } = req.body;

        // Generar un ID único para la skill
        const lastSkill = await Skill.findOne().sort({ id: -1 }).exec();
        const newId = lastSkill ? lastSkill.id + 1 : 1;

        const newSkill = new Skill({
            id: newId,
            text,
            icon: icon || null, // Icono opcional
            set: skillTree,
            tasks: tasks ? tasks.split('\n') : [], // Dividir en líneas
            resources: resources ? resources.split('\n') : [], // Dividir en líneas
            description,
            score: parseInt(score, 10) || 1, // Puntuación con valor predeterminado
        });

        await newSkill.save();

        res.redirect('/skills'); // Redirigir a la lista de skills
    } catch (error) {
        console.error('Error al guardar la nueva skill:', error);
        res.status(500).send('Error interno del servidor');
    }
};