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

// Função para salvar os dados no Firebase
document.getElementById('product-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Evita o envio padrão do formulário

    // Coleta os dados do formulário
    const formData = {
        sku: document.getElementById('sku').value,
        descricao: document.getElementById('descricao').value,
        tipo: document.getElementById('tipo').value,
        unidade: document.getElementById('unidade').value,
        grupo: document.getElementById('grupo').value,
        quantidade: document.getElementById('quantidade').value,
        fornecedor: document.getElementById('fornecedor').value,
        data_cadastro: document.getElementById('data_cadastro').value,
        data_vencimento: document.getElementById('data_vencimento').value
    };

    // Define a chave personalizada usando o SKU
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

function goBack() {
    window.history.back(); // Voltar para a página anterior
}
