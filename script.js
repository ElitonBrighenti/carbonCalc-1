// Cria ou acessa um banco de dados local
// Fonte: https://pouchdb.com/
const db = new PouchDB('carbon_footprint');

// Função que salva os dados recebidos no banco
function saveData(formData) {
    return db.put({
        // Aqui é salvo a data atual em tempo real
        _id: new Date().toISOString(),
        // Salva os dados do formulario
        formData: formData
    });
}
// Função que busca os dados no banco e exibe na tela
function displaySavedData() {
    // Ordena os dados que pegou do banco de forma desordenada
    db.allDocs({ include_docs: true, descending: true })
        .then(function (result) {
            const savedDataDiv = document.getElementById('savedData');
            savedDataDiv.innerHTML = '<h2 class="text-xl font-semibold text-gray-800">Dados Salvos</h2>';
            const table = document.createElement('table');
            table.classList.add('mt-4', 'w-full', 'border', 'border-gray-200', 'divide-y', 'divide-gray-200');

            const tableHeader = document.createElement('thead');
            const headerRow = document.createElement('tr');
            const header1 = document.createElement('th');
            header1.textContent = 'Data';
            const header2 = document.createElement('th');
            header2.textContent = 'Combustível (litros)';
            const header3 = document.createElement('th');
            header3.textContent = 'Tipo de Combustível';
            const header4 = document.createElement('th');
            header4.textContent = 'Distância Percorrida (km)';

            headerRow.appendChild(header1);
            headerRow.appendChild(header2);
            headerRow.appendChild(header3);
            headerRow.appendChild(header4);
            tableHeader.appendChild(headerRow);
            table.appendChild(tableHeader);

            const tableBody = document.createElement('tbody');
            result.rows.forEach(function (row) {
                const doc = row.doc;
                const dataRow = document.createElement('tr');
                const dateCell = document.createElement('td');
                dateCell.textContent = new Date(doc._id).toLocaleString();
                const formData = doc.formData;
                const fuelCell = document.createElement('td');
                fuelCell.textContent = formData.fuel;
                const fuelTypeCell = document.createElement('td');
                fuelTypeCell.textContent = formData.fuelType;
                const distanceCell = document.createElement('td');
                distanceCell.textContent = formData.distance;

                dataRow.appendChild(dateCell);
                dataRow.appendChild(fuelCell);
                dataRow.appendChild(fuelTypeCell);
                dataRow.appendChild(distanceCell);
                tableBody.appendChild(dataRow);
            });
            table.appendChild(tableBody);
            savedDataDiv.appendChild(table);
        }).catch(function (err) {
            console.log(err);
        });
}

document.getElementById('carbonForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = {
        fuel: parseFloat(document.getElementById('fuel').value),
        fuelType: document.getElementById('fuelType').value,
        distance: parseFloat(document.getElementById('distance').value)
    };
    saveData(formData).then(function () {
        displaySavedData();
    }).catch(function (err) {
        console.log(err);
    });
});

document.getElementById('saveDataBtn').addEventListener('click', function () {
    const formData = {
        fuel: parseFloat(document.getElementById('fuel').value),
        fuelType: document.getElementById('fuelType').value,
        distance: parseFloat(document.getElementById('distance').value)
    };
    saveData(formData).then(function () {
        alert('Dados salvos com sucesso!');
    }).catch(function (err) {
        console.log(err);
    });
});

document.getElementById('loadTableBtn').addEventListener('click', function () {
    displaySavedData();
});

