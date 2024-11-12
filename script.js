class User {
  constructor(name) {
    this.name = name;
    // this.age = age;     // Atributo opcional
    // this.score = score; // Atributo opcional
  }
}

var userList = [];

// Salva o userList no localStorage
function saveUserList() {
  const userListString = JSON.stringify(userList);
  localStorage.setItem("userList", userListString);
}

// Carrega o userList do localStorage
function loadUserList() {
  const savedList = localStorage.getItem("userList");
  if (savedList) {
    userList = JSON.parse(savedList).map((user) => new User(user.name));
    usersManager.updateNameTable();
  }
}

class PlayersManager {
  constructor() {
    this.team_size = 4;
    this.NaProxima = 0;
  }

  // Função para inserir um novo usuários na lista
  addUser(name) {
    const user = new User(name);
    if (document.getElementById("BttnToNaPr").classList.contains("glowing")) {
      userList.splice(this.NaProxima, 0, user);
      this.NaProxima++;
    } else {
      userList.push(user);
    }
    this.updateNameTable();
    saveUserList(); // Salva automaticamente após adicionar o usuário
  }

  // Atualiza a tabela com a lista de nomes
  updateNameTable() {
    const tableBody = document.getElementById("nameTable").getElementsByTagName("tbody")[0];

    if (userList.length > 0) {
      document.getElementById("nameTable").classList.remove("hidden");
    } else {
      document.getElementById("nameTable").classList.add("hidden");
    }

    tableBody.innerHTML = ""; // Limpa a tabela antes de inserir novos elementos

    let order = 1;
    userList.forEach((user, index) => {
      const row = tableBody.insertRow();

      // Define a cor com base no time
      if (index < usersManager.team_size) {
        row.classList.add("team1"); // Primeira metade para o Time 1
      } else if (index < usersManager.team_size * 2) {
        row.classList.add("team2"); // Segunda metade para o Time 2
      }

      const nameCell = row.insertCell(0);
      const orderCell = row.insertCell(1);
      const actionsCell = row.insertCell(2);

      actionsCell.classList.add("actions-cell"); // Aplica a classe para estilização

      nameCell.textContent = user.name;
      orderCell.textContent = order++;

      // Botão de deletar
      const delButton = document.createElement("button");
      delButton.textContent = "del";
      delButton.classList.add("action-btn", "del");
      delButton.addEventListener("click", () => {
        userList.splice(index, 1);
        this.updateNameTable();
        saveUserList();
      });

      // Botões de mover para cima e para baixo
      const upButton = document.createElement("button");
      upButton.textContent = "▲";
      upButton.classList.add("action-btn", "up");
      upButton.addEventListener("click", () => {
        this.moveRow(index, -1);
        saveUserList();
      });

      const downButton = document.createElement("button");
      downButton.textContent = "▼";
      downButton.classList.add("action-btn", "down");
      downButton.addEventListener("click", () => {
        this.moveRow(index, 1);
        saveUserList();
      });

      actionsCell.appendChild(delButton);
      actionsCell.appendChild(upButton);
      actionsCell.appendChild(downButton);
    });
  }

  // Função para mover um nome na lista (cima ou baixo)
  moveRow(index, direction) {
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < userList.length) {
      const temp = userList[index];
      userList[index] = userList[newIndex];
      userList[newIndex] = temp;
      this.updateNameTable();
    }
  }

  //função para retorna apenas a lista de nomes
  getNamesList() {
    return userList.map((jogadores) => jogadores.name);
  }
}

class TeamManager {
  constructor() {
    this.team1 = [];
    this.team2 = [];
  }

  // Método para preencher e atualizar as listas de times
  fillAndUpdateLists(userList, team_size) {
    const team1List = document.getElementById("team1List");
    const team2List = document.getElementById("team2List");

    // Limpa as listas antes de gerar os times
    team1List.innerHTML = "";
    team2List.innerHTML = "";

    // Divide os primeiros nomes em 2 times
    this.team1 = userList.slice(0, team_size);
    this.team2 = userList.slice(team_size, team_size * 2);

    // Exibe os nomes nos times
    this.displayTeamMembers(this.team1, team1List, "team1radio");
    this.displayTeamMembers(this.team2, team2List, "team2radio");
  }

  // Método para exibir os membros do time
  displayTeamMembers(team, listElement, radioName) {
    team.forEach((name) => {
      const li = document.createElement("li");
      const radio = document.createElement("input");

      radio.type = "radio"; // Define o tipo como radio
      radio.name = radioName; // Nome do grupo de radio buttons
      radio.value = name; // O valor do radio button é o nome do jogador

      // Adiciona o radio button e o nome ao li
      li.appendChild(radio);
      li.appendChild(document.createTextNode(name));

      // Adiciona o li à lista de times
      listElement.appendChild(li);
    });
  }

  // Método do botão jogar que adiciona os nomes ao final da userList
  play(userList, team_size) {
    const movedNames = userList.splice(0, team_size * 2); // Remove os nomes dos que jogaram
    userList.push(...movedNames); // Adiciona os nomes removidos ao final

    // Atualiza a tabela na primeira tela
    usersManager.NaProxima = 0;
    usersManager.updateNameTable();

    saveUserList();
  }

  // Método do botão trocar de time
  swapPlayers(radio1, radio2) {
    const player1Name = radio1.value;
    const player2Name = radio2.value;

    const player1Index = this.team1.indexOf(player1Name);
    const player2Index = this.team2.indexOf(player2Name);

    // Se ambos os jogadores estiverem em times diferentes, troca
    if (player1Index !== -1 && player2Index !== -1) {
      // Troca os jogadores
      this.team1[player1Index] = player2Name;
      this.team2[player2Index] = player1Name;
    }

    // Atualiza as listas após a troca
    const team1List = document.getElementById("team1List");
    const team2List = document.getElementById("team2List");
    this.fillAndUpdateLists([...this.team1, ...this.team2], this.team1.length);
  }
}

// Função para alternar entre as telas
function toggleScreens() {
  const screen1 = document.getElementById("screen1");
  const screen2 = document.getElementById("screen2");
  screen1.style.display = screen1.style.display === "none" ? "block" : "none";
  screen2.style.display = screen2.style.display === "none" ? "block" : "none";
}

/** -------------> FUNÇÕES DA PRIMEIRA TELA <------------- */
const usersManager = new PlayersManager();

// Função que lida com o input e passa os dados para a classe
function addNames() {
  const nameInput = document.getElementById("nameInput").value.trim();

  // Verifica se há nomes
  if (nameInput) {
    // Divide a string de nomes por vírgula e remove espaços em branco de cada nome
    const namesArray = nameInput.split(",").map((name) => name.trim());

    // Para cada nome, adiciona um novo usuário
    namesArray.forEach((name) => {
      if (name) {
        // Garante que o nome não esteja vazio
        usersManager.addUser(name); // Chama a função da classe PlayersManager
      }
    });

    document.getElementById("nameInput").value = ""; // Limpa o input após adicionar os nomes
    usersManager.updateNameTable(); // Atualiza a tabela
  }
}

//função de clique ou apertar enter
document.getElementById("addButton").addEventListener("click", addNames);
document.getElementById("nameInput").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    // Verifica se a tecla pressionada é "Enter"
    addNames(); // Chama a função como se fosse um clique no botão
  }
});

//Função ToNaProxima (muda a prioridade dos nomes inseridos)
document.getElementById("BttnToNaPr").addEventListener("click", function () {
  this.classList.toggle("glowing"); // Alterna a classe 'glowing' ao clicar
});

// Função para mudar tamanho das equipes
document.getElementById("team_size_button").addEventListener("click", function () {
  const teamSizeInput = document.getElementById("teamSizeBox");
  const newTeamSize = parseInt(teamSizeInput.value);
  if (!isNaN(newTeamSize) && newTeamSize > 0) {
    usersManager.team_size = newTeamSize;
    usersManager.updateNameTable(); //verificar se é realmente necessário chamar essa função
  }
});

/** -------------> FUNÇÕES DA SEGUNDA TELA <------------- */

// Instancia a classe TeamManager
const teamManager = new TeamManager();

// Listener para gerar times
document.getElementById("generateTeamsButton").addEventListener("click", function () {
  const team_size = usersManager.team_size;

  if (userList.length < team_size * 2) {
    alert("São necessários ao menos " + team_size * 2 + " nomes para gerar times!");
  } else {
    teamManager.fillAndUpdateLists(usersManager.getNamesList(), team_size);
    toggleScreens(); // Muda para a segunda tela
  }
});

// Listener para jogar
document.getElementById("playButton").addEventListener("click", function () {
  teamManager.play(userList, usersManager.team_size);
  toggleScreens(); // Volta para a tela inicial
});

// Listener para voltar sem jogar
document.getElementById("backButton").addEventListener("click", function () {
  toggleScreens(); // Volta para a tela inicial
});

// Listener para trocar de time
document.getElementById("swapButton").addEventListener("click", function () {
  const radio1 = document.querySelector('input[name="team1radio"]:checked');
  const radio2 = document.querySelector('input[name="team2radio"]:checked');

  if (radio1 && radio2) {
    teamManager.swapPlayers(radio1, radio2);
  } else {
    alert("Selecione um jogador de cada time para trocar!");
  }
});

// Carrega o userList ao iniciar a página
window.onload = loadUserList;
