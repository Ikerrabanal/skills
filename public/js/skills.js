window.onload = async function () {

    const container = document.getElementsByClassName("svg-container")[0]
    const response = await fetch('../electronics/skills.json');
    const skills = await response.json();

    skills.forEach(skill => {
        // Crear el wrapper div
        const wrapper = document.createElement('div');
        wrapper.classList.add('svg-wrapper');
        wrapper.setAttribute('data-id', skill.id);

        // Crear el SVG
        const svg = `
    <svg width="100" height="100" viewBox="0 0 100 100">
      <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" class="hexagon" />
      <text x="50%" y="20%" text-anchor="middle" fill="black" font-size="10">
        ${skill.text.split('\n\n\n').map(line => `<tspan x="50%" dy="1.2em" font-weight="bold">${line}</tspan>`).join('')}
      </text>
      <image x="35%" y="60%" width="30" height="30" href="./electronics/icons/icon${skill.id}.svg" />
    </svg>
  `;

        // Insertar el SVG en el wrapper
        wrapper.innerHTML = svg;

        // Agregar el wrapper al contenedor
        container.appendChild(wrapper);
    });
};