// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC7eniB3_IFT8E-Tb1VkfktcWUsfLRRYXw",
    authDomain: "bancoreciclar.firebaseapp.com",
    databaseURL: "https://bancoreciclar-default-rtdb.firebaseio.com",
    projectId: "bancocozinha",
    storageBucket: "bancoreciclar.firebasestorage.app",
    messagingSenderId: "418801320354",
    appId: "1:418801320354:web:3f854deb9e2dda520732fb",
    measurementId: "G-5J6XFE0H02"
};

// Inicializar o Firebase
firebase.initializeApp(firebaseConfig);

// Referência ao banco de dados
const db = firebase.database().ref('cadastroProdutos');

// Função para consultar dados com filtros
function consultarDados() {
    const sku = document.getElementById('sku').value.toLowerCase();
    const descricao = document.getElementById('descricao').value.toLowerCase();
    const marca = document.getElementById('marca').value.toLowerCase(); // Novo campo de Marca
    const peso = document.getElementById('peso').value.toLowerCase(); // Novo campo de Peso
    const tipo = document.getElementById('tipo').value.toLowerCase();
    const grupo = document.getElementById('grupo').value.toLowerCase();
    const fornecedor = document.getElementById('fornecedor').value.toLowerCase();
    const dataInicial = document.getElementById('dataInicial').value;
    const dataFinal = document.getElementById('dataFinal').value;

    db.once('value', (snapshot) => {
        const produtos = snapshot.val();
        const resultados = [];

        for (const key in produtos) {
            if (produtos.hasOwnProperty(key)) {
                const produto = produtos[key];
                const produtoSku = produto.sku.toLowerCase();
                const produtoDescricao = produto.descricao.toLowerCase();
                const produtoMarca = produto.marca ? produto.marca.toLowerCase() : ''; // Novo campo de Marca
                const produtoPeso = produto.peso ? produto.peso.toLowerCase() : ''; // Novo campo de Peso
                const produtoTipo = produto.tipo.toLowerCase();
                const produtoGrupo = produto.grupo.toLowerCase();
                const produtoFornecedor = produto.fornecedor.toLowerCase();
                const produtoDataCadastro = produto.data_cadastro;

                if ((sku === '' || produtoSku.includes(sku)) &&
                    (descricao === '' || produtoDescricao.includes(descricao.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))) &&
                    (marca === '' || produtoMarca.includes(marca)) && // Novo campo de Marca
                    (peso === '' || produtoPeso.includes(peso)) && // Novo campo de Peso
                    (tipo === '' || produtoTipo === tipo) &&
                    (grupo === '' || produtoGrupo === grupo) &&
                    (fornecedor === '' || produtoFornecedor.includes(fornecedor.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))) &&
                    (dataInicial === '' || produtoDataCadastro >= dataInicial) &&
                    (dataFinal === '' || produtoDataCadastro <= dataFinal)) {
                    resultados.push(produto);
                }
            }
        }

        // Ordenar resultados por descrição
        resultados.sort((a, b) => a.descricao.localeCompare(b.descricao));

        exibirResultados(resultados);
    });
}

// Função para exibir os resultados na tabela
function exibirResultados(resultados) {
    const tabela = document.getElementById('resultados');
    tabela.innerHTML = '';

    resultados.forEach(produto => {
        const row = tabela.insertRow();
        row.insertCell(0).innerText = produto.sku;
        row.insertCell(1).innerText = produto.descricao;
        row.insertCell(2).innerText = produto.marca; // Novo campo de Marca
        row.insertCell(3).innerText = produto.peso; // Novo campo de Peso
        row.insertCell(4).innerText = produto.tipo;
        row.insertCell(5).innerText = produto.unidade;
        row.insertCell(6).innerText = produto.grupo;
        row.insertCell(7).innerText = produto.fornecedor;
        row.insertCell(8).innerText = formatarData(produto.data_cadastro); // Formatar data de cadastro

        // Adicionar botão de editar
        const editarBtn = document.createElement('button');
        editarBtn.innerText = 'Editar';
        editarBtn.onclick = () => abrirModalEditar(produto);
        const acoesCell = row.insertCell(9);
        acoesCell.appendChild(editarBtn);
    });
}

// Função para formatar a data
function formatarData(data) {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
}

// Função para limpar os filtros
function limparFiltros() {
    document.getElementById('sku').value = '';
    document.getElementById('descricao').value = '';
    document.getElementById('marca').value = ''; // Novo campo de Marca
    document.getElementById('peso').value = ''; // Novo campo de Peso
    document.getElementById('tipo').value = '';
    document.getElementById('grupo').value = '';
    document.getElementById('fornecedor').value = '';
    document.getElementById('dataInicial').value = ''; // Novo campo de Data Inicial
    document.getElementById('dataFinal').value = ''; // Novo campo de Data Final
    document.getElementById('resultados').innerHTML = '';
}

// Função para abrir o modal de edição
function abrirModalEditar(produto) {
    const modal = document.getElementById('editModal');
    const form = document.getElementById('editForm');

    document.getElementById('editSKU').value = produto.sku;
    document.getElementById('editDescricao').value = produto.descricao;
    document.getElementById('editMarca').value = produto.marca; // Novo campo de Marca
    document.getElementById('editPeso').value = produto.peso; // Novo campo de Peso
    document.getElementById('editTipo').value = produto.tipo;
    document.getElementById('editUnidade').value = produto.unidade;
    document.getElementById('editGrupo').value = produto.grupo;
    document.getElementById('editFornecedor').value = produto.fornecedor;
    document.getElementById('editDataCadastro').value = produto.data_cadastro;

    modal.style.display = "block";

    form.onsubmit = function(event) {
        event.preventDefault();
        salvarEdicao(produto.sku);
    }
}

// Função para salvar a edição
function salvarEdicao(sku) {
    const produtoAtualizado = {
        sku: document.getElementById('editSKU').value,
        descricao: document.getElementById('editDescricao').value,
        marca: document.getElementById('editMarca').value, // Novo campo de Marca
        peso: document.getElementById('editPeso').value, // Novo campo de Peso
        tipo: document.getElementById('editTipo').value,
        unidade: document.getElementById('editUnidade').value,
        grupo: document.getElementById('editGrupo').value,
        fornecedor: document.getElementById('editFornecedor').value,
        data_cadastro: document.getElementById('editDataCadastro').value
    };

    db.child(sku).update(produtoAtualizado, (error) => {
        if (error) {
            alert("Erro ao atualizar produto: " + error.message);
        } else {
            alert("Produto atualizado com sucesso!");
            fecharModal();
            consultarDados();
        }
    });
}

// Função para fechar o modal
function fecharModal() {
    const modal = document.getElementById('editModal');
    modal.style.display = "none";
}

// Fechar o modal ao clicar no "x"
document.querySelector('.close').onclick = function() {
    fecharModal();
}

// Fechar o modal ao clicar fora dele
window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target == modal) {
        fecharModal();
    }
}

// Adicionar eventos aos botões
document.addEventListener('DOMContentLoaded', function() {
    consultarDados(); // Carregar dados automaticamente ao abrir a página
    document.getElementById('consultar-btn').addEventListener('click', consultarDados);
    document.getElementById('limpar-btn').addEventListener('click', limparFiltros);
});

document.getElementById('cadastrar-btn').addEventListener('click', function() {
    window.location.href = 'cadastrodeprodutos.html';
});
