// Firebase config
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_AUTH_DOMAIN",
    databaseURL: "SUA_DATABASE_URL",
    projectId: "SEU_PROJECT_ID",
    storageBucket: "SEU_STORAGE_BUCKET",
    messagingSenderId: "SEU_MESSAGING_SENDER_ID",
    appId: "SEU_APP_ID"
};

// Inicializa o Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const ref = firebase.database().ref('entradaprodutos');

// Função para listar entradas de 'entrada produtos'
function listarEntradas() {
    const tbody = document.querySelector('#itemsTable tbody');
    tbody.innerHTML = ''; // Limpa o conteúdo anterior

    ref.once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const produto = childSnapshot.val();
            const row = tbody.insertRow();

            row.insertCell(0).innerText = produto.sku;
            row.insertCell(1).innerText = produto.descricao;
            row.insertCell(2).innerText = produto.tipo;
            row.insertCell(3).innerText = produto.unidade;
            row.insertCell(4).innerText = produto.grupo;
            row.insertCell(5).innerText = produto.quantidade;
            row.insertCell(6).innerText = produto.fornecedor;
            row.insertCell(7).innerText = new Date(produto.data_cadastro).toLocaleDateString();
            row.insertCell(8).innerText = new Date(produto.data_vencimento).toLocaleDateString();
            row.insertCell(9).innerText = produto.valor_unitario;
            row.insertCell(10).innerText = produto.valor_total;
        });
    });
}

// Chama a função quando a página é carregada
window.onload = listarEntradas;

// Função para redirecionar para a página inicial
function goHome() {
    window.location.href = './home.html';
}
