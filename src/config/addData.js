//Añadir Skills a la base de datos desde el archivo skills.json

const Skill = require('../models/Skill');
const skills = require('../public/electronics/skillsLLM.json');
const badges = require('../public/badges/medallas.json');
const Badge = require('../models/Badge');

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

exports.addBadges = async () => {
    try {
        // Eliminar los rangos existentes antes de añadir los nuevos
        await Badge.deleteMany();

        // Transformar los datos si es necesario, en este caso no es necesario
        const transformedRanks = badges.map(rango => ({
            name: rango.rango,
            bitpoints_min: rango.bitpoints_min,
            bitpoints_max: rango.bitpoints_max,
            image_url: rango.png
        }));

        // Insertar los nuevos rangos en la base de datos
        await Badge.insertMany(transformedRanks);

        console.log('Rangos añadidos a la base de datos');
    } catch (error) {
        console.error('Error al añadir rangos a la base de datos:', error);
    }
}
