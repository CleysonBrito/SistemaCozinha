document.getElementById('dataForm').addEventListener('submit', (e) => {
    e.preventDefault();

    // Cria o objeto FormData para coletar os dados do formulário
    var formData = new FormData(document.getElementById('dataForm'));

    // Envia os dados para o Google Apps Script
    fetch('https://script.google.com/macros/s/AKfycbzKX-uqS-ZZKcteIRU6vyrCk8Jlo2iYNdOKXLjmzYcCA7wZgbPabDvPlVFFVmjGdcpq/exec', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())  // Converte a resposta para JSON
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

// Função para limpar o formulário (se necessário)
function limparFormulario() {
    document.getElementById('dataForm').reset();  // Limpa o formulário
}

// Função para redirecionar para a home
function irParaHome() {
    window.location.href = './home.html';  // Substitua o caminho pela URL correta da sua home
}
