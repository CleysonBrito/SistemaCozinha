// Inicializar o Firebase
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

firebase.initializeApp(firebaseConfig);

// Função para ir para a home
function goHome() {
    window.location.href = './home.html';
}

// Função para buscar itens
function searchItems() {
    const searchInput = document.getElementById('searchInput').value;
    const searchOption = document.getElementById('searchOptions').value;
    // Lógica para pesquisar itens com base na opção selecionada e no valor de entrada
    console.log(`Pesquisando por ${searchOption}: ${searchInput}`);
}

// Função para exportar para Excel
function exportToExcel() {
    // Lógica para exportar a tabela para um arquivo Excel
    console.log('Exportando para Excel');
}

// Função para ler dados do Firebase e exibir na tabela
function loadItems() {
    const db = firebase.database().ref('produtos');
    db.on('value', (snapshot) => {
        const data = snapshot.val();
        const tbody = document.getElementById('itemsTable').getElementsByTagName('tbody');
        tbody.innerHTML = ''; // Limpa o conteúdo anterior

        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const produto = data[key];
                const row = tbody.insertRow();

                row.insertCell(0).innerText = produto.sku;
                row.insertCell(1).innerText = produto.descricao;
                row.insertCell(2).innerText = produto.tipo;
                row.insertCell(3).innerText = produto.unidade;
                row.insertCell(4).innerText = produto.grupo;
                row.insertCell(5).innerText = produto.quantidade;
                row.insertCell(6).innerText = produto.fornecedor;
                row.insertCell(7).innerText = produto.data_cadastro;
                row.insertCell(8).innerText = produto.data_vencimento;
            }
        }
    });
}

// Chame a função para carregar os itens quando a página carregar
window.onload = loadItems;
