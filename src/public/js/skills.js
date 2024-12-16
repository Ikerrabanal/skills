window.onload = async function () {

    const container = document.getElementsByClassName("svg-container")[0];
    const response = await fetch('../electronics/skills.json');
    const skills = await response.json();

    // Contenedor para el mensaje que aparece en la parte inferior
    const messageContainer = document.getElementById('description-message');

    skills.forEach(skill => {
        // Crear el wrapper div
        const wrapper = document.createElement('div');
        wrapper.classList.add('svg-wrapper');
        wrapper.setAttribute('data-id', skill.id);

        // Crear el SVG
        const svg = `
        <svg width="100" height="100" viewBox="0 0 100 100">
          <polygon id="hexagon-${skill.id}" points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" class="hexagon" />
          <text x="50%" y="20%" text-anchor="middle" fill="black" font-size="10">
            ${skill.text.split('\n\n\n').map(line => `<tspan x="50%" dy="1.2em" font-weight="bold">${line}</tspan>`).join('')}
          </text>
          <image x="35%" y="60%" width="30" height="30" href="./electronics/icons/icon${skill.id}.svg" />
        </svg>
        <div class="icons">
            <span class="icon pencil" title="Editar">✏️</span>
            <span class="icon notebook" title="Ver Competencia">📓</span>
        </div>
        `;

        // Insertar el SVG en el wrapper
        wrapper.innerHTML = svg;

        // Agregar el wrapper al contenedor principal
        container.appendChild(wrapper);

        // Mostrar el mensaje cuando el ratón entre en el wrapper
        wrapper.addEventListener('mouseenter', () => {
            messageContainer.textContent = `Información sobre la habilidad: ${skill.text}`;
            messageContainer.classList.add('show'); // Mostrar el mensaje
        });

        // Ocultar el mensaje cuando el ratón salga del wrapper
        wrapper.addEventListener('mouseleave', () => {
            messageContainer.classList.remove('show'); // Ocultar el mensaje
        });

        wrapper.querySelector('.notebook').addEventListener('click', () => {
            window.location.href = `/competencia.html?id=${skill.id}`; // Pasar el ID en la URL
        });

        //como aun no hay autentificacion, ponemos de primeras que ninguna está completada

        inicializeState(skill.id);

        //actualizamos circulos

        const green_circle = document.createElement('div');
        green_circle.classList.add('green-circle');
        green_circle.id = `green-circle${skill.id}`
        green_circle.textContent = '1';

        const red_circle = document.createElement('div');
        red_circle.classList.add('red-circle');
        red_circle.id = `red-circle${skill.id}`

        wrapper.appendChild(green_circle)
        wrapper.appendChild(red_circle)

        //comprobar evidencias
        updateRedCircle();
        updateGreenCircle();

        //si se actualiza el storage, se actualizan los circulos
        window.addEventListener('storage', updateRedCircle);
        window.addEventListener('storage', updateGreenCircle);

        function updateRedCircle(){
            let evidences = getEvidencesBySkill(skill.id);
            if (evidences.length > 0){
                red_circle.textContent = evidences.length;
                red_circle.classList.add('show_circle')
            } else {
                red_circle.classList.remove('show_circle')
            }
        }

        function updateGreenCircle(){
            let hexagon = document.getElementById(`hexagon-${skill.id}`);
            let state = getState(skill.id);
            console.log(hexagon);

            if (state !== "uncompleted"){
                green_circle.classList.add('show_circle')
                hexagon.classList.add('done')
            } else {
                green_circle.classList.remove('show_circle')
                hexagon.classList.remove('done')
            }
        }
    });
};

function getState(skillID){
    let state = localStorage.getItem('competence_state');
    state = JSON.parse(state) || [];
    state = state.find(state => state.skill == skillID);
    return state.state;
}

function getEvidencesBySkill(skillID){
    let evidences = localStorage.getItem('evidences');
    evidences = JSON.parse(evidences) || [];

    evidences = evidences.filter(evidence => evidence.skill == skillID);
    return evidences;
}

function inicializeState(skillID) {
    let cs = localStorage.getItem('competence_state');
    if (cs == null) {
        cs = [{skill: skillID, state: "uncompleted"}];
        localStorage.setItem('competence_state', JSON.stringify(cs));
    } else {
        cs = JSON.parse(cs)
        cs_skill = cs.filter(competence => competence.skill == skillID);
        if (cs_skill.length == 0) {
            cs.push({skill: skillID, state: "uncompleted"})
            localStorage.setItem('competence_state', JSON.stringify(cs));
        }
    }
}