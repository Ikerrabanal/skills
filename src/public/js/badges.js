window.onload = async function () {

    const tableBody = document.querySelector('#badges-table tbody');

    const response = await fetch('../badges/medallas.json');
    const badgesData = await response.json();

    badgesData.forEach(badge => {
        // Crear una fila
        const row = document.createElement('tr');

        // Crear las celdas de la fila
        const rangoCell = document.createElement('td');
        rangoCell.textContent = badge.rango;
        rangoCell.classList.add('rango-cell'); // Agregar clase para personalizar el estilo

        const badgeCell = document.createElement('td');
        const badgeImg = document.createElement('img');

        let imag = badge.png.split('/');
        imag = imag[imag.length - 1];

        badgeImg.src = `./badges/icons/${imag}`;
        badgeImg.alt = badge.rango;
        badgeImg.style.width = '50px'; // Puedes ajustar el tamaño de la imagen
        badgeCell.appendChild(badgeImg);
        badgeCell.classList.add('badge-cell'); // Agregar clase para personalizar el estilo

        const bitpointsCell = document.createElement('td');
        bitpointsCell.textContent = `${badge.bitpoints_min} - ${badge.bitpoints_max}`;
        bitpointsCell.classList.add('bitpoints-cell'); // Agregar clase para personalizar el estilo

        // Agregar las celdas a la fila
        row.appendChild(rangoCell);
        row.appendChild(badgeCell);
        row.appendChild(bitpointsCell);

        // Agregar la fila a la tabla
        tableBody.appendChild(row);
    });
};
