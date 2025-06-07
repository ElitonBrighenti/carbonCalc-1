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
    // Pega todos os dados do banco, do mais recente para o mais antigo
    db.allDocs({ include_docs: true, descending: true })
        .then(function (result) {
            // Pega a parte da tela onde os dados vão aparecer
            const savedDataDiv = document.getElementById('savedData');
            // Escreve o título "Dados Salvos"
            savedDataDiv.innerHTML = '<h2 class="text-xl font-semibold text-gray-800">Dados Salvos</h2>';
            // Cria a tabela onde os dados vão ser colocados
            const table = document.createElement('table');
            table.classList.add('mt-4', 'w-full', 'border', 'border-gray-200', 'divide-y', 'divide-gray-200');

            // Cria a primeira linha da tabela (com os nomes das colunas)
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

            // Junta os títulos na primeira linha
            headerRow.appendChild(header1);
            headerRow.appendChild(header2);
            headerRow.appendChild(header3);
            headerRow.appendChild(header4);
            tableHeader.appendChild(headerRow);
            table.appendChild(tableHeader);

            // Parte onde os dados vão aparecer (linha por linha)
            const tableBody = document.createElement('tbody');
            // Percorre cada linha do banco
            result.rows.forEach(function (row) {
                const doc = row.doc;
                // Cria uma nova linha
                const dataRow = document.createElement('tr'); // Cria uma nova linha da tabela
                // Coloca a data formatada
                const dateCell = document.createElement('td');
                dateCell.textContent = new Date(doc._id).toLocaleString();
                const formData = doc.formData; // Pega os dados salvos do formulário
                // Coloca os dados: combustível, tipo e distância
                const fuelCell = document.createElement('td');
                fuelCell.textContent = formData.fuel;
                const fuelTypeCell = document.createElement('td');
                fuelTypeCell.textContent = formData.fuelType;
                const distanceCell = document.createElement('td');
                distanceCell.textContent = formData.distance;

                // Junta tudo na linha
                dataRow.appendChild(dateCell);
                dataRow.appendChild(fuelCell);
                dataRow.appendChild(fuelTypeCell);
                dataRow.appendChild(distanceCell);
                tableBody.appendChild(dataRow);
            });
            // Junta a parte de baixo na tabela e mostra na tela
            table.appendChild(tableBody);
            savedDataDiv.appendChild(table);
        }).catch(function (err) {
            // Se der erro, mostra no console
            console.log(err);
        });
}
// Quando clicar no botão "Calcular", essa função é executada
document.getElementById('carbonForm').addEventListener('submit', function (event) {
    event.preventDefault();
    // Pega os valores que a pessoa preencheu
    const formData = {
        fuel: parseFloat(document.getElementById('fuel').value),// Combustivel
        fuelType: document.getElementById('fuelType').value, //Tipo combustivel
        distance: parseFloat(document.getElementById('distance').value) //Distancia
    };
    // Salva os dados
    saveData(formData).then(function () {
        displaySavedData();
    }).catch(function (err) {
        console.log(err); // Se der erro, mostra no console
    });
});

// Quando clicar no botão "Salvar Dados", executa isso
document.getElementById('saveDataBtn').addEventListener('click', function () {
    // Pega de novo os valores preenchidos
    const formData = {
        fuel: parseFloat(document.getElementById('fuel').value),
        fuelType: document.getElementById('fuelType').value,
        distance: parseFloat(document.getElementById('distance').value)
    };
    // Salva e mostra um alerta que deu certo
    saveData(formData).then(function () {
        alert('Dados salvos com sucesso!');
    }).catch(function (err) {
        console.log(err);// Se der erro, mostra no console
    });
});

document.getElementById('loadTableBtn').addEventListener('click', function () {
    displaySavedData();// Chama a função que mostra a tabela
});