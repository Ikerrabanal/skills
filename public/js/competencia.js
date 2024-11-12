window.onload = async function () {
    // Obtener el ID de la competencia de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const competenciaId = urlParams.get('id');

    // Cargar los detalles de las competencias
    const response = await fetch('../electronics/skills.json');
    const skills = await response.json();
    const competencia = skills.find(skill => skill.id == competenciaId);

    // Mostrar los detalles de la competencia
    document.getElementById('competencia-title').textContent = competencia.title;
    document.getElementById('competencia-description').textContent = competencia.description;
    document.getElementById('competencia-icon').src = `./electronics/icons/icon${competencia.id}.svg`;

    // Renderizar las tareas
    const tareasList = document.getElementById('tareas-list');
    competencia.tareas.forEach(tarea => {
        const tareaItem = document.createElement('li');
        tareaItem.innerHTML = `
            <input type="checkbox" class="tarea-checkbox">
            ${tarea}
        `;
        tareasList.appendChild(tareaItem);
    });

    // Renderizar los recursos
    const recursosList = document.getElementById('recursos-list');
    competencia.recursos.forEach(recurso => {
        const recursoItem = document.createElement('li');
        recursoItem.innerHTML = `<a href="${recurso.url}" target="_blank">${recurso.nombre}</a>`;
        recursosList.appendChild(recursoItem);
    });

    // Controlar el completado de tareas y mostrar el formulario de evidencia
    const checkboxes = document.querySelectorAll('.tarea-checkbox');
    checkboxes.forEach(checkbox => checkbox.addEventListener('change', checkCompletion));

    function checkCompletion() {
        const allCompleted = Array.from(checkboxes).every(checkbox => checkbox.checked);
        if (allCompleted) {
            document.getElementById('evidence-form').style.display = 'block';
            launchConfetti();
        }
    }

    // Función para la animación de confeti
    function launchConfetti() {
        const confettiCanvas = document.getElementById('confetti-canvas');
        const confetti = confettiCanvas.getContext('2d');
        // Implementa la animación de confeti con una librería de tu elección o un código simple de confeti
    }
};
