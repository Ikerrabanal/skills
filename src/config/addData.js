const Skill = require('../models/Skill');
const skills = require('../public/electronics/skillsLLM.json');

exports.addSkills = async () => {
    try {
        for (let skill of skills) {
            const existingSkill = await Skill.findOne({ text: skill.text }).exec();

            if (!existingSkill) {
                const newSkill = new Skill({
                    id: skill.taskID,
                    text: skill.text,
                    icon: skill.icon,
                    set: skill.set,
                    tasks: skill.tasks,
                    resources: skill.resources,
                    description: skill.description,
                    score: skill.score,
                });

                await newSkill.save();
                console.log(`Skill añadida: ${skill.text}`);
            }
        }

        console.log('Skills añadidas a la base de datos');
    } catch (error) {
        console.error('Error al añadir skills a la base de datos:', error);
    }
}
