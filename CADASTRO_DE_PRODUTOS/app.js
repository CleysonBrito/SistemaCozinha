document.getElementById('dataForm').addEventListener('submit', (e) => {
    e.preventDefault();

    // Cria o objeto com os dados do formulário
    var data = {
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

    // Envia os dados como JSON para o Google Apps Script
    fetch('https://script.google.com/macros/s/AKfycbzKX-uqS-ZZKcteIRU6vyrCk8Jlo2iYNdOKXLjmzYcCA7wZgbPabDvPlVFFVmjGdcpq/exec', {
        method: 'POST',
        body: formData,
        mode: 'no-cors'  // Desativa o CORS, mas não permite acessar a resposta
    })
    .then(() => {
        alert('Produto salvo com sucesso!');
        document.getElementById('dataForm').reset();  // Limpa o formulário
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Ocorreu um erro ao enviar os dados. Por favor, tente novamente.');
    });
});

// Função para limpar o formulário (se necessário)
function limparFormulario() {
    document.getElementById('dataForm').reset();  // Limpa o formulário
}

// Função para redirecionar para a home
function irParaHome() {
    window.location.href = './home.html';  // Substitua o caminho pela URL correta da sua home
}
