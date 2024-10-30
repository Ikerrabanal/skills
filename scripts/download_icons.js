const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function downloadIcon(url, iconPath, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.get(url, { responseType: 'stream', timeout: 10000 });
      const writer = fs.createWriteStream(iconPath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      console.log(`Icono descargado con éxito desde ${url}`);
      return;
    } catch (error) {
      console.error(`Intento ${attempt} - Error al descargar el icono desde ${url}: ${error.message}`);
      if (attempt === retries) throw new Error(`Falló la descarga tras ${retries} intentos`);
    }
  }
}

async function downloadIcons() {
  const iconsDir = path.join(__dirname, '../public/electronics/icons');
  
  // Crear la carpeta si no existe
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  const iconCount = 67; // Cambia este valor si tienes un número diferente de íconos
  // Cambiando los espacios a '%20'
  const baseUrl = 'https://tinkererway.dev/web%20skill%20trees%20resources/svg/electronics%20icons'; // URL base

  for (let i = 1; i <= iconCount; i++) {
    const url = `${baseUrl}/icon${i}.svg`; // Construye la URL correctamente
    const iconPath = path.join(iconsDir, `icon${i}.svg`);
    
    try {
      await downloadIcon(url, iconPath);
    } catch (error) {
      console.error(`Error definitivo al descargar el icono ${i}: ${error.message}`);
    }
  }

  console.log("Se han descargado todos los iconos.");
}

downloadIcons().catch(console.error);
