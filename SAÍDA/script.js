// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDjuoTIoL4CX8KSkWXos1JEYQ9u0KhySmk",
    authDomain: "bancocozinha.firebaseapp.com",
    databaseURL: "https://bancocozinha-default-rtdb.firebaseio.com",
    projectId: "bancocozinha",
    storageBucket: "bancocozinha.appspot.com",
    messagingSenderId: "424572545119",
    appId: "1:424572545119:web:bc20a45001fbac1cbfd3ea",
    measurementId: "G-5J6XFE0H02"
};

// Inicializar o Firebase
firebase.initializeApp(firebaseConfig);

// Referência ao banco de dados
const db = firebase.database().ref('cadastroProdutos');

// Função para buscar o produto pelo SKU no Firebase
document.getElementById('sku').addEventListener('change', function() {
    const sku = document.getElementById('sku').value;

    if (sku) {
        buscarProdutoPorSKU(sku);
    }
});

function buscarProdutoPorSKU(sku) {
    // Verifica se a SKU existe no banco de dados
    db.child(sku).once('value')
        .then(function(snapshot) {
            if (snapshot.exists()) {
                const produto = snapshot.val();

                // Preenche os campos do formulário com os dados do produto
                document.getElementById('descricao').value = produto.descricao || '';
                document.getElementById('tipo').value = produto.tipo || '';
                document.getElementById('unidade').value = produto.unidade || '';
                document.getElementById('quantidade').value = produto.quantidade || '';
            } else {
                alert('Produto não encontrado!');
                // Limpa o formulário se o produto não for encontrado
                limparFormulario();
            }
        })
        .catch(function(error) {
            console.error('Erro ao buscar o produto:', error);
            alert('Erro ao buscar o produto. Por favor, tente novamente.');
        });
}

function limparFormulario() {
    document.getElementById('descricao').value = '';
    document.getElementById('tipo').value = '';
    document.getElementById('unidade').value = '';
    document.getElementById('quantidade').value = '';
}

// Função para adicionar saída ao formulário
function adicionarSaida() {
    const sku = document.getElementById('sku').value;
    const descricao = document.getElementById('descricao').value;
    const tipo = document.getElementById('tipo').value;
    const unidade = document.getElementById('unidade').value;
    const quantidade = document.getElementById('quantidade').value;

    if (isNaN(quantidade) || quantidade === '') {
        alert('Por favor, insira um valor numérico para a quantidade.');
        return;
    }

    const quantidadeInt = parseInt(quantidade);
    
    if (quantidadeInt <= 5) {
        alert('Estoque baixo! É necessário fazer uma compra.');
    }

    const tableBody = document.getElementById('saidaTableBody');
    const newRow = document.createElement('tr');
    
    newRow.innerHTML = `
        <td>${new Date().toLocaleDateString()}</td>
        <td>${sku}</td>
        <td>${descricao}</td>
        <td>${quantidadeInt}</td>
        <td>${unidade}</td>
        <td>${tipo}</td>
        <td>
            <button class="acaoButton" onclick="editarLinha(this)">Editar</button>
            <button class="acaoButton" onclick="excluirLinha(this)">Excluir</button>
        </td>
    `;
    
    tableBody.appendChild(newRow);
}

// Demais funções continuam inalteradas...
function editarLinha(button) {
    const row = button.parentNode.parentNode;
    document.getElementById('sku').value = row.cells[1].innerText;
    document.getElementById('descricao').value = row.cells[2].innerText;
    document.getElementById('quantidade').value = row.cells[3].innerText;
    document.getElementById('unidade').value = row.cells[4].innerText;
    document.getElementById('tipo').value = row.cells[5].innerText;

    row.remove();
}

function excluirLinha(button) {
    const row = button.parentNode.parentNode;
    row.remove();
}

function salvar() {
    alert('Dados salvos com sucesso!');
}

function limpar() {
    document.getElementById('saidaForm').reset();
    document.getElementById('saidaTableBody').innerHTML = '';
}
