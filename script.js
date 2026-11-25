// Lista de livros
let livros = JSON.parse(localStorage.getItem("livros")) || [];
let categoriaAtual = "Quero Ler";

// Adicionar livro
function adicionarLivro() {
    let nome = document.getElementById("nomeLivro").value;

    if (nome.trim() === "") {
        alert("Por favor, digite o nome do livro!");
        return;
    }

    let novoLivro = {
        nome: nome,
        status: "Quero Ler",
        progresso: 0
    };

    livros.push(novoLivro);
    salvarLivros();
    document.getElementById("nomeLivro").value = "";
    mostrarLivros("Quero Ler");
}

// Salvar livros no navegador
function salvarLivros() {
    localStorage.setItem("livros", JSON.stringify(livros));
}

// Mostrar livros por categoria
function mostrarLivros(status) {
    categoriaAtual = status;
    let lista = document.getElementById("listaLivros");
    lista.innerHTML = "";

    let encontrados;
    if (status === "Todos") {
        encontrados = livros;
    } else {
        encontrados = livros.filter(function(livro) {
            return livro.status === status;
        });
    }

    if (encontrados.length === 0) {
        lista.innerHTML = "<p>Nenhum livro nesta categoria.</p>";
        return;
    }

    encontrados.forEach(function(livro) {
        let indice = livros.indexOf(livro);
        let card = document.createElement("div");
        card.className = "livro-card";

        card.innerHTML = `
            <h3>${livro.nome}</h3>
            <p>Progresso: ${livro.progresso}%</p>

            <input
                type="range"
                min="0"
                max="100"
                value="${livro.progresso}"
                onchange="atualizarProgresso(${indice}, this.value, this)"
            >

            <select onchange="alterarStatus(${indice}, this.value)">
                <option value="Quero Ler" ${livro.status === "Quero Ler" ? "selected" : ""}>Quero Ler</option>
                <option value="Lendo" ${livro.status === "Lendo" ? "selected" : ""}>Lendo</option>
                <option value="Lidos" ${livro.status === "Lidos" ? "selected" : ""}>Lidos</option>
            </select>

            <br>
            <button class="btn-excluir" onclick="excluirLivro(${indice})">Excluir</button>
        `;

        lista.appendChild(card);
    });
}

// Alterar status do livro
function alterarStatus(indice, novoStatus) {
    let livro = livros[indice];
    livro.status = novoStatus;
    salvarLivros();
    mostrarLivros(novoStatus);
}

// Atualizar progresso do livro
function atualizarProgresso(indice, novoProgresso, inputElement) {
    livros[indice].progresso = Number(novoProgresso);
    salvarLivros();

    // Atualiza só o texto "Progresso: X%" sem recarregar a lista
    let p = inputElement.previousElementSibling;
    if (p) {
        p.textContent = "Progresso: " + novoProgresso + "%";
    }
}

// Excluir livro
function excluirLivro(indice) {
    livros.splice(indice, 1);
    salvarLivros();
    mostrarLivros(categoriaAtual);
}

// Mostrar os livros quando a página abrir
window.addEventListener("DOMContentLoaded", function() {
    mostrarLivros("Quero Ler");
});