// Lista de nomes
let namesList = [];
let team_size = 4;

// Atualiza a tabela com a lista de nomes
function updateNameTable() {
    const tableBody = document.getElementById('nameTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Limpa a tabela

    let order = 1; // Reinicia a contagem da ordem
    namesList.forEach((name, index) => {
        const row = tableBody.insertRow();

        const nameCell = row.insertCell(0);
        const orderCell = row.insertCell(1);
        const actionsCell = row.insertCell(2);

        nameCell.textContent = name;
        orderCell.textContent = order++;

        // Botão para deletar o nome
        const delButton = document.createElement('button');
        delButton.textContent = 'del';
        delButton.classList.add('action-btn');
        delButton.addEventListener('click', () => {
            namesList.splice(index, 1);  // Remove o nome da lista
            updateNameTable();           // Atualiza a tabela
        });

        // Botão para mover o nome para cima
        const upButton = document.createElement('button');
        upButton.textContent = '↑';
        upButton.classList.add('action-btn', 'up');
        upButton.addEventListener('click', () => moveRow(index, -1));

        // Botão para mover o nome para baixo
        const downButton = document.createElement('button');
        downButton.textContent = '↓';
        downButton.classList.add('action-btn', 'down');
        downButton.addEventListener('click', () => moveRow(index, 1));

        // Adiciona os botões na célula de ações
        actionsCell.appendChild(delButton);
        actionsCell.appendChild(upButton);
        actionsCell.appendChild(downButton);
    });
}

// Função para adicionar um novo nome na lista
function addNames () {
    const nameInput = document.getElementById('nameInput');
    const name = nameInput.value.trim();

    if (name) {
        namesList.push(name);  // Adiciona o nome na lista
        nameInput.value = '';  // Limpa o input
        updateNameTable();     // Atualiza a tabela
    }
};
//função de clique ou apertar enter
document.getElementById('addButton').addEventListener('click', addNames);
document.getElementById("nameInput").addEventListener("keydown", function(event) {
    if (event.key === "Enter") { // Verifica se a tecla pressionada é "Enter"
        addNames(); // Chama a função como se fosse um clique no botão
    }
});

// Função para mudar tamanho das equipes
document.getElementById('team_size_button').addEventListener('click', function() {
    const teamSizeInput = document.getElementById('teamSizeBox');
    const newTeamSize = parseInt(teamSizeInput.value);

    if (!isNaN(newTeamSize) && newTeamSize > 0) {
        team_size = newTeamSize;
        document.getElementById('teamSizeBox');
        updateNameTable();
    }
});

// Função para mover um nome na lista (cima ou baixo)
function moveRow(index, direction) {
    const newIndex = index + direction;

    // Verifica se o novo índice é válido (não pode ser menor que 0 nem maior que o tamanho da lista)
    if (newIndex >= 0 && newIndex < namesList.length) {
        // Troca a posição dos nomes na lista
        const temp = namesList[index];
        namesList[index] = namesList[newIndex];
        namesList[newIndex] = temp;

        // Atualiza a tabela com a nova ordem
        updateNameTable();
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
    if (namesList.length < team_size * 2) {
        alert('Você precisa de pelo menos ' + team_size * 2 + ' nomes para gerar times!');
    } else {
        const team1List = document.getElementById('team1List');
        const team2List = document.getElementById('team2List');

        team1List.innerHTML = '';
        team2List.innerHTML = '';

        // Divide os primeiros nomes em 2 times
        const team1 = namesList.slice(0, team_size);
        const team2 = namesList.slice(team_size, team_size * 2);

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
    const movedNames = namesList.splice(0, team_size * 2); // Remove os nomes dos que jogaram
    namesList.push(...movedNames); // Adiciona os nomes removidos ao final

    // Atualiza a tabela na primeira tela
    updateNameTable();
    toggleScreens(); // Volta para a tela inicial
});

// Função para voltar sem jogar (somente volta para a tela inicial)
document.getElementById('backButton').addEventListener('click', function() {
    toggleScreens(); // Volta para a tela inicial
});
