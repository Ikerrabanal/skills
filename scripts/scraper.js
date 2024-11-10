const axios = require('axios');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

(async () => {
  const url = 'https://tinkererway.dev/web_skill_trees/electronics_skill_tree';
  const outputFile = path.join(path.dirname(process.argv[1]), '../public/electronics/skills.json');

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const skills = [];

    $('.svg-wrapper').each((_, element) => {
        const id = parseInt($(element).attr('data-id'), 10); // Extract ID
      const text = $(element)
          .find('text tspan')
          .map((_, tspan) => $(tspan).text().trim())
          .get()
          .join('\n\n\n'); // Combine text with the specified line breaks
      const icon = $(element).find('image').attr('href'); // Extract icon path

      // Push the extracted data into the skills array
      skills.push({
        id,
        text,
        icon: icon,
      });
    });

    // Save the result as a JSON file
    fs.writeFileSync(outputFile, JSON.stringify(skills, null, 2), 'utf-8');
    console.log('Data extracted and saved to skills.json');
  } catch (error) {
    console.error('Error al obtener los datos:', error.message);
  }
})();
