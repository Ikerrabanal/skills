const path = require("node:path");

const Skill = require('../models/UserSkill');

exports.renderIndex = async (req, res, next) => {
    try {
        if(req.session.user) {
            //Hay que pasarle el usuario, las habilidades,...
            userSkills = await Skill.find({user: req.session.user._id});
            res.render('skills', {user: req.session.user, skills: userSkills});
        } else {
            res.redirect('/users/login')
        }
    } catch (error) {
        next(error);
    }
};