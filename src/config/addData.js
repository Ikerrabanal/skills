//Añadir Skills a la base de datos desde el archivo skills.json

const Skill = require('../models/Skill');
const skills = require('../public/electronics/skills.json');

exports.addSkills = async () => {
    try {
        await Skill.deleteMany();
        const transformedSkills = skills.map(skill => ({
            id: skill.id,
            text: skill.text.trim(),
            icon: skill.icon.includes('http') ? skill.icon : null,
            set: "default",
            tasks: [],
            resources: [],
            description: "",
            score: 1,
        }));
        await Skill.insertMany(skills);
        console.log('Skills añadidas a la base de datos');
    } catch (error) {
        console.error('Error al añadir skills a la base de datos:', error);
    }
}
