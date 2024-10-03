document.getElementById('dataForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Cria o objeto com os dados
    const formData = new FormData();
    formData.append('sku', document.getElementById('sku').value);
    formData.append('descricao', document.getElementById('descricao').value);
    formData.append('tipo', document.getElementById('tipo').value);
    formData.append('unidade', document.getElementById('unidade').value);
    formData.append('grupo', document.getElementById('grupo').value);
    formData.append('quantidade', document.getElementById('quantidade').value);
    formData.append('fornecedor', document.getElementById('fornecedor').value);
    formData.append('data_cadastro', document.getElementById('data_cadastro').value);
    formData.append('data_vencimento', document.getElementById('data_vencimento').value);
    formData.append('aba', 'cadastrodeprodutos'); // Informa a aba de destino

    // Envia os dados para o Google Apps Script
    fetch('https://script.google.com/macros/s/AKfycbzKX-uqS-ZZKcteIRU6vyrCk8Jlo2iYNdOKXLjmzYcCA7wZgbPabDvPlVFFVmjGdcpq/exec', {
        method: 'POST',
        body: formData,
        mode: 'no-cors' // Ajusta para evitar problemas de CORS, mas sem retorno detalhado
    })
    .then(() => {
        alert('Produto salvo com sucesso!');
        document.getElementById('dataForm').reset();
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Ocorreu um erro ao enviar os dados. Por favor, tente novamente.');
    });
});

// Função para voltar à página anterior
function goBack() {
    window.history.back();  // Retorna para a página anterior
}
