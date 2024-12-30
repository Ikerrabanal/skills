window.onload = async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const competenciaId = urlParams.get('id');

    const response = await fetch('../electronics/skills_prueba.json');
    const skills = await response.json();
    const competencia = skills.find(skill => skill.id == competenciaId);


    // Cargar los datos de la skill en el formulario
    document.getElementById('skill-title').textContent = competencia.title;
    document.getElementById('skill-text').value = competencia.text;
    document.getElementById('description').value = competencia.description;


    const svg = `
        <svg width="150" height="150" viewBox="0 0 200 200">
            <polygon id="hexagon-${competencia.id}" points="100,10 190,55 190,145 100,190 10,145 10,55" class="hexagon" />
            <text x="50%" y="15%" text-anchor="middle" fill="black" font-size="16">
                ${competencia.text.split('\n\n\n').map(line => `<tspan x="50%" dy="1.5em" font-weight="bold">${line}</tspan>`).join('')}
            </text>
            <image x="25%" y="40%" width="100" height="100" href="./electronics/icons/icon${competencia.id}.svg" />
        </svg>
    `;
    document.getElementById('skill-icon-container').innerHTML = svg;


    // Guardar los cambios en el formulario
    document.getElementById('edit-skill-form').addEventListener('submit', function(event) {
        event.preventDefault();
        handleSubmit(competenciaId);
    });
};

async function handleSubmit(skillId) {
    const form = document.getElementById('edit-skill-form');
    const formData = new FormData(form);

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            alert('Los cambios se han guardado correctamente.');
            window.location.href = '/skills';
        } else {
            alert('Error al guardar los cambios. Intenta nuevamente.');
        }
    } catch (err) {
        alert('Hubo un error en el envío de los datos.');
    }
}

function deleteSkill() {
    if (confirm('¿Estás seguro de que deseas eliminar esta habilidad?')) {
        const skillId = new URLSearchParams(window.location.search).get('id');
        // Eliminar la skill de la base de datos que estemos utilizando
        alert('Habilidad eliminada');
        window.location.href = '/skills';
    }
}
