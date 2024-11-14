window.onload = async function () {
    // Obtener el ID de la competencia de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const competenciaId = urlParams.get('id');

    // Cargar los detalles de las competencias
    const response = await fetch('../electronics/skills_prueba.json');
    const skills = await response.json();
    const competencia = skills.find(skill => skill.id == competenciaId);

    // Mostrar los detalles de la competencia
    document.getElementById('competencia-title').textContent = competencia.title;
    document.getElementById('competencia-description').textContent = competencia.description;
    document.getElementById('competencia-icon').src = `./electronics/icons/icon${competencia.id}.svg`;

    // Renderizar las tareas
    const tareasList = document.getElementById('tareas-list');
    competencia.tasks.forEach(tarea => {
        const tareaItem = document.createElement('li');
        tareaItem.innerHTML = `
            <input type="checkbox" class="tarea-checkbox">
            ${tarea}
        `;
        tareasList.appendChild(tareaItem);
    });

    // Renderizar los recursos
    const recursosList = document.getElementById('recursos-list');
    competencia.resources.forEach(recurso => {
        const recursoItem = document.createElement('li');
        recursoItem.innerHTML = `◉ ${recurso}`;
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
        } else {
            document.getElementById('evidence-form').style.display = 'none';
        }
    }

    // Función para la animación de confeti
    function launchConfetti() {
        const confettiCanvas = document.getElementById('confetti-canvas');

        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;

        confetti({
            particleCount: 200,
            angle: 90,
            spread: 360,
            origin: { x: 0.5, y: 0.5 },
            colors: ['#ffffff', '#dd2222', '#2c7714'],
            scalar: 1.2
        });
    }

    document.getElementById('submit_button').addEventListener('click', submitted)

    function submitted() {
        var inputValue = document.getElementById('submit_content').value;

        if (inputValue.trim() !== '') {
            var successMessage = document.getElementById('success-message');
            successMessage.classList.add('show');
            document.getElementById('submit_content').value = '';

            setTimeout(function() {
                successMessage.classList.remove('show');
            }, 3000);
        } else {
            alert('Por favor, ingresa una URL, explicación o evidencia válida.');
        }
    }
};
