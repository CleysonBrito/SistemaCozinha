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

// Função para salvar os dados no Firebase
document.getElementById('product-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Evita o envio padrão do formulário

    // Coleta os dados do formulário
    const formData = {
        sku: document.getElementById('sku').value.toUpperCase(),
        descricao: document.getElementById('descricao').value.toUpperCase(),
        marca: document.getElementById('marca').value.toUpperCase(), // Novo campo de marca
        peso: formatPeso(document.getElementById('peso').value), // Formata o peso com três casas decimais
        tipo: document.getElementById('tipo').value.toUpperCase(),
        unidade: document.getElementById('unidade').value.toUpperCase(),
        grupo: document.getElementById('grupo').value.toUpperCase(),
        fornecedor: document.getElementById('fornecedor').value.toUpperCase(),
        data_cadastro: document.getElementById('data_cadastro').value
    };

    const chaveProduto = formData.sku;  // Usando o SKU como chave única

    // Salva os dados no Firebase sem criar identificador aleatório
    db.child(chaveProduto).set(formData)
        .then(() => {
            alert('Dados enviados com sucesso!');
            document.getElementById('product-form').reset(); // Limpa o formulário
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Ocorreu um erro ao enviar os dados. Por favor, tente novamente.');
        });
});

// Função para converter texto para maiúsculas
function toUpperCaseInput(event) {
    event.target.value = event.target.value.toUpperCase();
}

// Adiciona o evento de input para converter texto para maiúsculas
document.getElementById('sku').addEventListener('input', toUpperCaseInput);
document.getElementById('descricao').addEventListener('input', toUpperCaseInput);
document.getElementById('marca').addEventListener('input', toUpperCaseInput);
document.getElementById('fornecedor').addEventListener('input', toUpperCaseInput);



// Função para formatar o peso
function formatPeso(value) {
    const num = parseFloat(value.replace(',', '.'));
    if (!isNaN(num)) {
        return num.toFixed(3).replace('.', ',');
    }
    return '0,000';
}

// Adiciona o evento de blur para formatar o peso
document.getElementById('peso').addEventListener('blur', function(event) {
    event.target.value = formatPeso(event.target.value);
});

// Referência ao banco de dados de fornecedores
const fornecedoresDb = firebase.database().ref('cadastrodefornecedores');

// Função para abrir o modal e carregar os fornecedores
document.getElementById('fornecedor').addEventListener('click', function() {
    const modal = document.getElementById('myModal');
    modal.style.display = "block";

    // Limpa a lista de fornecedores
    const fornecedorList = document.getElementById('fornecedorList');
    fornecedorList.innerHTML = '';

    // Carrega os fornecedores do banco de dados
    fornecedoresDb.once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            const fornecedor = childSnapshot.val();
            const tr = document.createElement('tr');

            const tdRazaoSocial = document.createElement('td');
            tdRazaoSocial.textContent = fornecedor.razaoSocial;
            tr.appendChild(tdRazaoSocial);

            const tdCNPJ = document.createElement('td');
            tdCNPJ.textContent = fornecedor.cnpj;
            tr.appendChild(tdCNPJ);

            const tdContato = document.createElement('td');
            tdContato.textContent = fornecedor.contato;
            tr.appendChild(tdContato);

            const tdSelecionar = document.createElement('td');
            const selectButton = document.createElement('button');
            selectButton.textContent = 'Selecionar';
            selectButton.addEventListener('click', function() {
                document.getElementById('fornecedor').value = fornecedor.razaoSocial;
                modal.style.display = "none";
            });
            tdSelecionar.appendChild(selectButton);
            tr.appendChild(tdSelecionar);

            fornecedorList.appendChild(tr);
        });
    });
});

// Função para fechar o modal
document.getElementsByClassName('close')[0].addEventListener('click', function() {
    document.getElementById('myModal').style.display = "none";
});

// Fecha o modal se o usuário clicar fora dele
window.addEventListener('click', function(event) {
    const modal = document.getElementById('myModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
});

function goBack() {
    window.history.back(); // Voltar para a página anterior
}
