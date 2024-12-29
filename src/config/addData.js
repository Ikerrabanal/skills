//Añadir Skills a la base de datos desde el archivo skills.json

const Skill = require('../models/Skill');
const skills = require('../public/electronics/skillsLLM.json');

exports.addSkills = async () => {
    try {
        await Skill.deleteMany();
        const transformedSkills = skills.map(skill => ({
            id: skill.taskID,
            text: skill.text,
            icon: skill.icon,
            set: skill.set,
            tasks: skill.tasks,
            resources: skill.resources,
            description: skill.description,
            score: skill.score,
        }));
        await Skill.insertMany(transformedSkills);
        console.log('Skills añadidas a la base de datos');
    } catch (error) {
        console.error('Error al añadir skills a la base de datos:', error);
    }
}
