const path = require("node:path");
const multer = require('multer');
const upload = multer({ dest: '../public/electronics/icons/' })
const Skill = require('../models/Skill');
const UserSkill = require('../models/UserSkill');
const User = require('../models/User');
const mongoose = require('mongoose');

exports.renderIndex = async (req, res, next) => {
    try {
        if(req.session.user) {
            //Hay que pasarle el usuario, las habilidades,...
            allSkills = await Skill.find();
            console.log('Usuario en sesión:', req.session.user);
            userSkills = await UserSkill.find().exec();
            res.render('skills', {user: req.session.user, skills: allSkills, userSkills: userSkills});
        } else {
            res.redirect('/users/login')
        }
    } catch (error) {
        next(error);
    }
};

exports.renderEditSkill = async (req, res, next) => {
    const tree = req.params.skillTree;
    const skillId = parseInt(req.params.id, 10);
    const skill = await Skill.findOne({ id: skillId });
    if (!skill) {
        return res.status(404).send('Skill not found');
    }

    res.render('edit-skill', {user: req.session.user, skill: skill, tree: tree });
};



//exports.renderEditSkill = async (req, res) => {
//  try {
//      const { id } = req.params;
//
//      const skill = await Skill.findOne({ id }).exec();
////      if (!skill) {
//        return res.status(404).send('Skill no encontrada');
//      }
//
//      res.render('edit-skill', { skill });
//  } catch (error) {
//      console.error('Error al renderizar la página de edición:', error);
//      res.status(500).send('Error interno del servidor');
//  }
//};

exports.updateSkill = async (req, res) => {
    try {
        const { id } = req.params;

        const { text, description, score, tasks, resources, icon } = req.body;


        const parsedScore = parseInt(score, 10);
        if (isNaN(parsedScore)) {
            throw new Error('El campo "score" debe ser un número válido.');
        }

        const updatedSkill = await Skill.findOneAndUpdate(
            { id },
            {
                text,
                description,
                score: parseInt(score, 10),
                tasks: tasks ? tasks.split('\n') : [],
                resources: resources ? resources.split('\n') : [],
                icon: icon || null,
            },
            { new: true }
        );

        if (!updatedSkill) {
            return res.status(404).send('Skill no encontrada');
        }

        res.redirect('/skills');
    } catch (error) {
        console.error('Error al guardar la skill:', error);
        res.status(500).send('Error interno del servidor');
    }
};

// Parte de boton de add

exports.renderAddSkill = (req, res) => {
    const { skillTree } = req.params;
    res.render('add-skill', {user: req.session.user, skillTree });
};

exports.saveNewSkill = async (req, res) => {
    try {
        const { skillTree } = req.params;
        const { text, description, score, tasks, resources, icon } = req.body;

        const lastSkill = await Skill.findOne().sort({ id: -1 }).exec();
        const newId = lastSkill ? lastSkill.id + 1 : 1;

        const newSkill = new Skill({
            id: newId,
            text,
            icon: icon || null, // Icono opcional
            set: skillTree,
            tasks: tasks ? tasks.split('\n') : [],
            resources: resources ? resources.split('\n') : [],
            description,
            score: parseInt(score, 10) || 1,
        });

        await newSkill.save();

        res.redirect('/skills');
    } catch (error) {
        console.error('Error al guardar la nueva skill:', error);
        res.status(500).send('Error interno del servidor');
    }
};

// Para eliminar una skill

exports.deleteSkill = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Skill.deleteOne({ id: id });

        if (result.deletedCount === 0) {
            return res.status(404).send('Skill no encontrada');
        }

        res.redirect(`/skills`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al eliminar la habilidad');
    }
};

exports.viewCompetencia = async(req, res) => {
    try {
        const skillID = req.params.skillID;
        const skill = await Skill.findOne({ _id: skillID}).exec(); //aparezcan los competados y no verificados
        const userSkills = await UserSkill.find({skill: skillID}).populate('user').exec();

        if (!skill) {
            return res.status(404).send('Skill no encontrada');
        }

        res.render('competencia', { skill, userSkills, user: req.session.user });
    } catch (error) {
        console.error('Error al renderizar la página de edición:', error);
        res.status(500).send('Error interno del servidor');
    }
}

exports.addEvidence = async(req, res) => {
    const {skillID, userID, evidence} = req.body;
    const newUserSkill = new UserSkill({
        user: userID,
        skill: skillID,
        evidence: evidence,
        completedAt: new Date(),
        completed: true //se ha completado de momento
    })

    newUserSkill.save()
        .then(savedUserSkill => {
            console.log('UserSkill saved:', savedUserSkill);
        })
        .catch(error => {
            console.error('Error saving UserSkill:', error);
        });
}

exports.verifyEvidence = async (req, res) => {
    const user = req.session.user;
    const skillID = req.params.skillID;
    const { userSkillID, approved} = req.body; // Necesitamos saber si es admin o no

    try {
        const updatedUserSkill = await UserSkill.findByIdAndUpdate(
            userSkillID,
            {
                $push: {
                    verifications: {
                        user: user._id,
                        approved: approved,
                        verifiedAt: new Date()
                    },
                },
            },
            { new: true }
        );

        const approvedCount = updatedUserSkill.verifications.filter(
            (verification) => verification.approved
        ).length;
        if ((user.isAdmin && approved) || approvedCount >= 3){
            await UserSkill.findByIdAndUpdate(
                userSkillID,
                { verified: true },
                { new: true }
            );
            await User.findByIdAndUpdate(
                user._id,
                {
                    $push: { completedSkills: skillID } // Si quieres almacenar más información
                },
                { new: true }
            );
            res.status(200).send({ success: true, message: "Evidence verified successfully." });
        } else if (user.isAdmin && !approved){
            await UserSkill.findByIdAndDelete(userSkillID);
            res.status(200).send({ success: true, message: "Evidence removed." });
        }
    } catch (error) {
        console.error("Error verifying evidence:", error);
        res.status(500).send({ success: false, message: "Internal server error." });
    }
};