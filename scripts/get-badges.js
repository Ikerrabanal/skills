const axios = require('axios');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

(async () => {
    const url = 'https://github.com/Obijuan/digital-electronics-with-open-FPGAs-tutorial/wiki#listado-de-rangos';
    const outputFile = path.join(path.dirname(process.argv[1]), '../public/badges/medallas.json');

    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const medallas = [];
        let i = 0;
        $('table[role="table"]').each((index, element) => {
            $(element).find('tr').each((rowIndex, row) => {
                // Extraer el segundo y tercer elemento de cada fila
                const png = $(row).find('td:nth-child(2) img').attr('src'); // Obtener el atributo src de la imagen
                const rango = $(row).find('td:nth-child(3)').text().trim();



                if (rango && png) {
                    medallas.push({
                        rango: rango,
                        bitpoints_min: 10 * i,
                        bitpoints_max: 10 * (i + 1) - 1,
                        png: png.replace(".png", "-min.png")
                    });
                    i += 1;  // Incrementa i para la siguiente medalla
                }
        })});

        // Save the result as a JSON file
        fs.writeFileSync(outputFile, JSON.stringify(medallas, null, 2), 'utf-8');
        console.log('Data extracted and saved to medallas.json');
    } catch (error) {
        console.error('Error al obtener los datos:', error.message);
    }
})();
