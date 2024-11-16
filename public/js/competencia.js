window.onload = async function () {

    const urlParams = new URLSearchParams(window.location.search);
    const competenciaId = urlParams.get('id');

    const response = await fetch('../electronics/skills_prueba.json');
    const skills = await response.json();
    const competencia = skills.find(skill => skill.id == competenciaId);

    document.getElementById('competencia-title').textContent = competencia.title;
    document.getElementById('competencia-description').textContent = competencia.description;
    document.getElementById('competencia-icon').src = `./electronics/icons/icon${competencia.id}.svg`;

    const tareasList = document.getElementById('tareas-list');
    competencia.tasks.forEach(tarea => {
        const tareaItem = document.createElement('li');
        tareaItem.innerHTML = `
            <input type="checkbox" class="tarea-checkbox">
            ${tarea}
        `;
        tareasList.appendChild(tareaItem);
    });

    const recursosList = document.getElementById('recursos-list');
    competencia.resources.forEach(recurso => {
        const recursoItem = document.createElement('li');
        recursoItem.innerHTML = `◉ ${recurso}`;
        recursosList.appendChild(recursoItem);
    });

    const checkboxes = document.querySelectorAll('.tarea-checkbox');
    checkboxes.forEach(checkbox => checkbox.addEventListener('change', checkCompletion));

    //hacer submit si se pulsa boton o enter
    document.getElementById('submit_button').addEventListener('click', submitted);

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            submitted();
        }
    });

    updateEvidencesTable();

    function submitted() {
        var inputValue = document.getElementById('submit_content').value;

        if (inputValue.trim() !== '') {
            showMessage('Evidencia enviada correctamente.', 'green')
            document.getElementById('submit_content').value = '';

            addEvidence(competenciaId, "me", inputValue);
            updateEvidencesTable();
        } else {
            showMessage('Por favor, ingresa una URL, explicación o evidencia válida.', 'red')
        }
    }

    function checkCompletion() {
        const allCompleted = Array.from(checkboxes).every(checkbox => checkbox.checked);
        if (allCompleted) {
            document.getElementById('evidence-form').style.display = 'block';
            launchConfetti();
        } else {
            document.getElementById('evidence-form').style.display = 'none';
        }
    }

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

    function updateEvidencesTable() {
        const tableBody = document.querySelector("#table-evidences tbody");

        while (tableBody.rows.length > 0) {
            tableBody.deleteRow(0);
        }

        let evidences = getEvidencesBySkill(competenciaId);

        evidences.forEach(evidence => {
            const row = document.createElement("tr");

            const userCell = document.createElement("td");
            userCell.textContent = evidence.user;

            const evidenceCell = document.createElement("td");
            evidenceCell.textContent = evidence.evidence;

            const actionsCell = document.createElement("td");

            const acceptButton = document.createElement("button");
            acceptButton.textContent = "Aceptar";
            acceptButton.classList.add("btn", "btn-accept");
            acceptButton.addEventListener('click', () => acceptEvidence(evidence.id))

            const declineButton = document.createElement("button");
            declineButton.textContent = "Denegar";
            declineButton.classList.add("btn", "btn-decline");
            declineButton.addEventListener('click', () => declineEvidence(evidence.id))

            actionsCell.appendChild(acceptButton);
            actionsCell.appendChild(declineButton);

            row.appendChild(userCell);
            row.appendChild(evidenceCell);
            row.appendChild(actionsCell);

            tableBody.appendChild(row);
        });
    }

    function acceptEvidence(evidenceID) {
        deleteEvidence(evidenceID);

        showMessage('La evidencia se ha aceptado correctamente.', 'green');
        updateEvidencesTable();

        changeCompetenceState(competenciaId, "completed");
    }

    function declineEvidence(evidenceID) {
        deleteEvidence(evidenceID);
        showMessage('La evidencia se ha rechazado correctamente.', 'green');
        updateEvidencesTable();

        changeCompetenceState(competenciaId, "uncompleted");
    }

    function showMessage(text, colour){
        let message = document.getElementById('success-message');
        message.textContent = text;
        message.style.backgroundColor = colour;
        message.style.color = "white";
        message.classList.add('show');

        setTimeout(function() {
            message.classList.remove('show');
        }, 3000);
    }

};

function getEvidencesBySkill(id){
    let evidences = localStorage.getItem('evidences');
    evidences = JSON.parse(evidences) || [];

    evidences = evidences.filter(evidence => evidence.skill == id);
    return evidences;
}

function deleteEvidence(evidenceID){
    let evidences = localStorage.getItem('evidences');
    evidences = JSON.parse(evidences) || [];
    evidences = evidences.filter(evidence => evidence.id !== evidenceID);
    localStorage.setItem('evidences', JSON.stringify(evidences));
}

function changeCompetenceState(competenceID, newstate) {
    let competenceState = localStorage.getItem('competence_state');
    competenceState = JSON.parse(competenceState) || [];

    const foundCompetence = competenceState.find(state => state.skill == competenceID);
    if (foundCompetence) {
        foundCompetence.state = newstate;
    }
    localStorage.setItem('competence_state', JSON.stringify(competenceState));
}

function addEvidence(competenceID, user, content){
    let evidences = localStorage.getItem('evidences');
    if (!evidences){
        evidences = []
    } else {
        evidences = JSON.parse(evidences);
    }
    evidences.push({id: Date.now(), skill: competenceID, user: user, evidence: content})
    localStorage.setItem('evidences', JSON.stringify(evidences));
}