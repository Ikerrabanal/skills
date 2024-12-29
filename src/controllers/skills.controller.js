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