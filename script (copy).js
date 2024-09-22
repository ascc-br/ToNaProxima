document.getElementById('addButton').addEventListener('click', function() {
    const nameInput = document.getElementById('nameInput');
    const name = nameInput.value.trim();
    if (name) {
        addNameToTable(name);
        nameInput.value = ''; // Limpa o campo
    }
});

let order = 1;
let namesList = [];

function addNameToTable(name) {
    const table = document.getElementById('nameTable').getElementsByTagName('tbody')[0];
    const row = table.insertRow();

    const nameCell = row.insertCell(0);
    const orderCell = row.insertCell(1);
    const actionsCell = row.insertCell(2);

    nameCell.textContent = name;
    orderCell.textContent = order++;
    namesList.push(name);

    // Botões de ação
    const delButton = document.createElement('button');
    delButton.textContent = 'del';
    delButton.classList.add('action-btn');
    delButton.addEventListener('click', () => {
        row.remove();
        namesList = namesList.filter(n => n !== name);
    });

    const upButton = document.createElement('button');
    upButton.textContent = '↑';
    upButton.classList.add('action-btn', 'up');
    upButton.addEventListener('click', () => moveRow(row, -1));

    const downButton = document.createElement('button');
    downButton.textContent = '↓';
    downButton.classList.add('action-btn', 'down');
    downButton.addEventListener('click', () => moveRow(row, 1));

    // Adiciona os botões à célula
    actionsCell.appendChild(delButton);
    actionsCell.appendChild(upButton);
    actionsCell.appendChild(downButton);
}

// Função para mover a linha para cima ou para baixo
function moveRow(row, direction) {
    const table = row.parentElement;
    const index = Array.prototype.indexOf.call(table.rows, row);
    const newIndex = index + direction;

    if (newIndex >= 0 && newIndex < table.rows.length) {
        table.insertBefore(row, table.rows[newIndex + (direction > 0 ? 1 : 0)]);
    }
}

// Função para alternar entre as telas
function toggleScreens() {
    const screen1 = document.getElementById('screen1');
    const screen2 = document.getElementById('screen2');
    screen1.style.display = screen1.style.display === 'none' ? 'block' : 'none';
    screen2.style.display = screen2.style.display === 'none' ? 'block' : 'none';
}

// Função para gerar times
document.getElementById('generateTeamsButton').addEventListener('click', function() {
    if (namesList.length < 8) {
        alert('Você precisa de pelo menos 8 nomes para gerar times!');
    } else {
        const team1List = document.getElementById('team1List');
        const team2List = document.getElementById('team2List');

        team1List.innerHTML = '';
        team2List.innerHTML = '';

        // Divide os 8 primeiros nomes em 2 times
        const team1 = namesList.slice(0, 4);
        const team2 = namesList.slice(4, 8);

        // Exibe os nomes nos times
        team1.forEach(name => {
            const li = document.createElement('li');
            li.textContent = name;
            team1List.appendChild(li);
        });

        team2.forEach(name => {
            const li = document.createElement('li');
            li.textContent = name;
            team2List.appendChild(li);
        });

        toggleScreens(); // Muda para a segunda tela
    }
});

// Função para jogar (volta para a primeira tela e coloca os nomes no final da lista)
document.getElementById('playButton').addEventListener('click', function() {
    const movedNames = namesList.splice(0, 8); // Remove os primeiros 8 nomes
    namesList.push(...movedNames); // Adiciona os nomes removidos ao final

    // Atualiza a tabela na primeira tela
    updateNameTable();
    toggleScreens(); // Volta para a tela inicial
});

// Função para atualizar a tabela com a nova ordem de nomes
function updateNameTable() {
    const tableBody = document.getElementById('nameTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Limpa a tabela

    order = 1; // Reinicia a contagem da ordem
    namesList.forEach(name => {
        const row = tableBody.insertRow();

        const nameCell = row.insertCell(0);
        const orderCell = row.insertCell(1);
        const actionsCell = row.insertCell(2);

        nameCell.textContent = name;
        orderCell.textContent = order++;

        // Botões de ação (mesmo comportamento de antes)
        const delButton = document.createElement('button');
        delButton.textContent = 'del';
        delButton.classList.add('action-btn');
        delButton.addEventListener('click', () => {
            row.remove();
            namesList = namesList.filter(n => n !== name);
        });

        const upButton = document.createElement('button');
        upButton.textContent = '↑';
        upButton.classList.add('action-btn', 'up');
        upButton.addEventListener('click', () => moveRow(row, -1));

        const downButton = document.createElement('button');
        downButton.textContent = '↓';
        downButton.classList.add('action-btn', 'down');
        downButton.addEventListener('click', () => moveRow(row, 1));

        // Adiciona os botões à célula
        actionsCell.appendChild(delButton);
        actionsCell.appendChild(upButton);
        actionsCell.appendChild(downButton);
    });
}


// Função para voltar para a tela anterior
document.getElementById('backButton').addEventListener('click', function() {
    toggleScreens();
});
