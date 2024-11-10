const axios = require('axios');
const fs = require('fs');
const path = require('path');

const url = 'https://tinkererway.dev/web_skill_trees/electronics_skill_tree';
const skillsFile = path.join(process.cwd(), './public/electronics/skills.json');
const iconsDir = path.join(process.cwd(), './public/electronics/icons');

(async () => {
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  const skills = JSON.parse(fs.readFileSync(skillsFile, 'utf-8'));

  for (const skill of skills) {
    const iconUrl = skill.icon;
    const iconName = `icon${skill.id}.svg`;
    const iconPath = path.join(iconsDir, iconName);

    try {
      const response = await axios.get(path.join(url, iconUrl), { responseType: 'stream' });
      const writer = fs.createWriteStream(iconPath);

      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      console.log(`Descargado: ${iconName}`);
    } catch (error) {
      console.error(`Error al descargar ${iconName}:`, error.message);
    }
  }

  console.log('Se han descargado todos los iconos');
})();
