document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('product-form');

    if (form) { // Verifica se o formulário existe no DOM
        form.addEventListener('submit', function(e) {
            e.preventDefault();  // Evita o envio padrão do formulário

            var formData = new FormData(form);  // Coleta os dados do formulário

            // Substitua o URL pelo seu link do Google Apps Script correto
            fetch('https://script.google.com/macros/s/AKfycbzKX-uqS-ZZKcteIRU6vyrCk8Jlo2iYNdOKXLjmzYcCA7wZgbPabDvPlVFFVmjGdcpq/exec', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na resposta do servidor');
                }
                return response.json();  // Transforma a resposta em JSON
            })
            .then(data => {
                if (data.result === 'success') {
                    alert('Dados enviados com sucesso!');
                    form.reset();  // Limpa o formulário
                } else {
                    alert('Erro ao enviar os dados: ' + (data.error || 'Erro desconhecido'));
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Ocorreu um erro ao enviar os dados. Por favor, tente novamente.');
            });
        });
    } else {
        console.error('Formulário "product-form" não encontrado no DOM.');
    }
});
