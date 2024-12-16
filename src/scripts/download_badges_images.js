const axios = require('axios');
const fs = require('fs');
const path = require('path');

const badgesFile = path.join(process.cwd(), './public/badges/medallas.json');
const imagesDir = path.join(process.cwd(), './public/badges/icons');

(async () => {
    if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
    }

    const medallas = JSON.parse(fs.readFileSync(badgesFile, 'utf-8'));

    for (const medalla of medallas) {
        const iconUrl = medalla.png;
        let parts = medalla.png.split('/');
        let iconName = parts[parts.length - 1];
        const iconPath = path.join(imagesDir, iconName);

        try {
            const response = await axios.get(medalla.png, { responseType: 'stream' });
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
