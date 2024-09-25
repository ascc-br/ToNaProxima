class User {
    constructor(name) {
        this.name = name;
        // this.age = age;     // Atributo opcional
        // this.score = score; // Atributo opcional
    }
}

class PlayersManager {
    constructor() {
        this.userList = [];  // Lista de objetos User
        this.team_size = 4;
        this.NaProxima = 0;
    }

    // Função para inserir um novo usuários na lista
    addUser(name) {
        const user = new User(name);
        if (document.getElementById("BttnToNaPr").classList.contains("glowing")) {
            this.userList.splice(this.NaProxima, 0, user);
            this.NaProxima++;
        } else {
            this.userList.push(user);
        }
        this.updateNameTable();
    }

    // Atualiza a tabela com a lista de nomes
    updateNameTable() {
        const tableBody = document.getElementById('nameTable').getElementsByTagName('tbody')[0];
        if (this.userList.length > 0)
            document.getElementById("nameTable").classList.remove("hidden");
        else
            document.getElementById("nameTable").classList.add("hidden");
        tableBody.innerHTML = ''; //limpa a tabela

        let order = 1; //reinicia a ordem
        this.userList.forEach((user, index) => {
            const row = tableBody.insertRow();

            const nameCell = row.insertCell(0);
            const orderCell = row.insertCell(1);
            const actionsCell = row.insertCell(2);
            actionsCell.classList.add('actions-cell'); //adiciona a classe para aplicar o CSS

            nameCell.textContent = user.name;
            orderCell.textContent = order++;

            const delButton = document.createElement('button');
            delButton.textContent = 'del';
            delButton.classList.add('action-btn', 'del');
            delButton.addEventListener('click', () => {
                this.userList.splice(index, 1);
                this.updateNameTable();
            });

            const upButton = document.createElement('button');
            upButton.textContent = '▲';
            upButton.classList.add('action-btn', 'up');
            upButton.addEventListener('click', () => this.moveRow(index, -1));

            const downButton = document.createElement('button');
            downButton.textContent = '▼';
            downButton.classList.add('action-btn', 'down');
            downButton.addEventListener('click', () => this.moveRow(index, 1));

            actionsCell.appendChild(delButton);
            actionsCell.appendChild(upButton);
            actionsCell.appendChild(downButton);
        });
    }

    // Função para mover um nome na lista (cima ou baixo)
    moveRow(index, direction) {
        const newIndex = index + direction;
        if (newIndex >= 0 && newIndex < this.userList.length) {
            const temp = this.userList[index];
            this.userList[index] = this.userList[newIndex];
            this.userList[newIndex] = temp;
            this.updateNameTable();
        }
    }

    //função para retorna apenas a lista de nomes
    getNamesList() {
        return this.userList.map(jogadores => jogadores.name);
    }
}

const usersManager = new PlayersManager();

// Função que lida com o input e passa os dados para a classe
function addNames () {
    const nameInput = document.getElementById('nameInput').value.trim();

    // Verifica se há nomes
    if (nameInput) {
        // Divide a string de nomes por vírgula e remove espaços em branco de cada nome
        const namesArray = nameInput.split(',').map(name => name.trim());

        // Para cada nome, adiciona um novo usuário
        namesArray.forEach(name => {
            if (name) { // Garante que o nome não esteja vazio
                usersManager.addUser(name); // Chama a função da classe PlayersManager
            }
        });

        document.getElementById('nameInput').value = '';  // Limpa o input após adicionar os nomes
        usersManager.updateNameTable();  // Atualiza a tabela
    }
}

//função de clique ou apertar enter
document.getElementById('addButton').addEventListener('click', addNames);
document.getElementById("nameInput").addEventListener("keydown", function(event) {
    if (event.key === "Enter") { // Verifica se a tecla pressionada é "Enter"
        addNames(); // Chama a função como se fosse um clique no botão
    }
});

//Função ToNaProxima (muda a prioridade dos nomes inseridos)
document.getElementById("BttnToNaPr").addEventListener("click", function() {
    this.classList.toggle("glowing"); // Alterna a classe 'glowing' ao clicar
});

// Função para mudar tamanho das equipes
document.getElementById('team_size_button').addEventListener('click', function() {
    const teamSizeInput = document.getElementById('teamSizeBox');
    const newTeamSize = parseInt(teamSizeInput.value);
    if (!isNaN(newTeamSize) && newTeamSize > 0) {
        usersManager.team_size = newTeamSize;
        usersManager.updateNameTable(); //verificar se é realmente necessário chamar essa função
    }
});

// Função para alternar entre as telas
function toggleScreens() {
    const screen1 = document.getElementById('screen1');
    const screen2 = document.getElementById('screen2');
    screen1.style.display = screen1.style.display === 'none' ? 'block' : 'none';
    screen2.style.display = screen2.style.display === 'none' ? 'block' : 'none';
}

// Função para copiar a lista para o clipboard
function controlceh () {
    navigator.clipboard.writeText(usersManager.getNamesList()).then(() => {
        alert('Lista de nomes copiada para o clipboard!');
    }).catch(err => {
        console.error('Erro ao copiar: ', err);
    });
}

// Função para gerar times
document.getElementById('generateTeamsButton').addEventListener('click', function() {
    const team_size = usersManager.team_size;

    if (usersManager.userList.length < team_size * 2) {
        alert('São necessários ao menos ' + team_size * 2 + ' nomes para gerar times!');
    } else {
        controlceh();

        const team1List = document.getElementById('team1List');
        const team2List = document.getElementById('team2List');
        // Limpa as listas antes de gerar os times
        team1List.innerHTML = '';
        team2List.innerHTML = '';

        // Divide os primeiros nomes em 2 times
        const team1 = usersManager.getNamesList().slice(0, team_size);
        const team2 = usersManager.getNamesList().slice(team_size, team_size * 2);

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
    const movedNames = usersManager.userList.splice(0, usersManager.team_size * 2); // Remove os nomes dos que jogaram
    usersManager.userList.push(...movedNames); // Adiciona os nomes removidos ao final

    // Atualiza a tabela na primeira tela
    usersManager.NaProxima = 0;
    usersManager.updateNameTable();
    toggleScreens(); // Volta para a tela inicial
});

// Função para voltar sem jogar (somente volta para a tela inicial)
document.getElementById('backButton').addEventListener('click', function() {
    toggleScreens(); // Volta para a tela inicial
});
    