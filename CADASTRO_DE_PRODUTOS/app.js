form.addEventListener('submit', function(e) {
    e.preventDefault();  // Evita o envio padrão do formulário

    var formData = new FormData(form);  // Coleta os dados do formulário

    // Exibe os dados coletados no console para depuração
    for (var pair of formData.entries()) {
        console.log(pair[0]+ ': ' + pair[1]);
    }

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
