const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

async function scrapeSkills() {
  const url = 'https://tinkererway.dev/web_skill_trees/electronics_skill_tree';
  
  try {
    // Solicitud HTTP a la página
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);  // Cargar el HTML en cheerio
    const skills = [];

    // Seleccionar cada elemento .svg-wrapper en el árbol de habilidades
    $('.svg-wrapper').each((i, el) => {
      const id = $(el).attr('data-id');  // Obtener el ID de cada wrapper
      const icon = `/electronics/icons/icon${id}.svg`; // Ruta de icono
      
      // Empujar el objeto de habilidad en el array de skills
      skills.push({ id, icon, text: `Skill ${id}`, description: `Descripción para el skill ${id}` });
    });

    // Asegurarse de que la carpeta 'public/electronics' exista
    const electronicsDir = path.join(__dirname, '../public/electronics');
    if (!fs.existsSync(electronicsDir)) {
      fs.mkdirSync(electronicsDir, { recursive: true });
    }

    // Guardar los datos en skills.json
    fs.writeFileSync(path.join(electronicsDir, 'skills.json'), JSON.stringify(skills, null, 2));
    console.log('Skills guardados en skills.json');
  } catch (error) {
    console.error('Error al obtener los datos:', error.message);
  }
}

scrapeSkills().catch(console.error);
