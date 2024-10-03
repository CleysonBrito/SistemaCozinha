document.getElementById('dataForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Cria o objeto com os dados do formulário
    const data = {
        sku: document.getElementById('sku').value,
        descricao: document.getElementById('descricao').value,
        tipo: document.getElementById('tipo').value,
        unidade: document.getElementById('unidade').value,
        grupo: document.getElementById('grupo').value,
        quantidade: document.getElementById('quantidade').value,
        fornecedor: document.getElementById('fornecedor').value,
        data_cadastro: document.getElementById('data_cadastro').value,
        data_vencimento: document.getElementById('data_vencimento').value,
        aba: 'cadastrodeprodutos' // Especifica a aba correta
    };

    // Envia os dados como JSON para o Google Apps Script
    fetch('https://script.google.com/macros/s/AKfycbzKX-uqS-ZZKcteIRU6vyrCk8Jlo2iYNdOKXLjmzYcCA7wZgbPabDvPlVFFVmjGdcpq/exec', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Define o tipo de conteúdo como JSON
        },
        body: JSON.stringify(data), // Envia os dados como JSON
    })
    .then(response => response.json()) // Converte a resposta para JSON
    .then(data => {
        if (data.result === 'success') {
            alert('Produto salvo com sucesso!');
            document.getElementById('dataForm').reset(); // Limpa o formulário
        } else {
            alert('Erro ao enviar os dados: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Ocorreu um erro ao enviar os dados. Por favor, tente novamente.');
    });
});
