document.getElementById('dataForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Captura os dados do formulário
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
    formData.append('aba', 'cadastrodeprodutos'); // Adiciona a aba de destino
    
    // Envia os dados para o Google Apps Script
    fetch('https://script.google.com/macros/s/AKfycbzKX-uqS-ZZKcteIRU6vyrCk8Jlo2iYNdOKXLjmzYcCA7wZgbPabDvPlVFFVmjGdcpq/exec', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())  // Transforma a resposta em JSON
    .then(data => {
        if (data.result === 'success') {
            alert('Produto salvo com sucesso!');
            document.getElementById('dataForm').reset();  // Limpa o formulário
        } else {
            alert('Erro ao enviar os dados: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Ocorreu um erro ao enviar os dados. Por favor, tente novamente.');
    });
});

// Função para calcular o valor total (se necessário)
function calcularValorTotal() {
    const quantidade = document.getElementById('quantidade').value;
    const valor_unitario = document.getElementById('valor_unitario').value;
    const valor_total = quantidade * valor_unitario;
    document.getElementById('valor_total').value = valor_total.toFixed(2);
}

// Função para limpar o formulário
function limparFormulario() {
    document.getElementById('dataForm').reset();
}

// Função para ir para a home
function irParaHome() {
    window.location.href = "./home.html"; // Substitua pelo caminho correto para a página inicial
}
