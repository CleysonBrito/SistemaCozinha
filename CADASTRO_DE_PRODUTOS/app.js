document.getElementById('product-form').addEventListener('submit', function(e) {
    e.preventDefault();  // Evita o envio padrão do formulário

    var formData = new FormData(this);  // Coleta os dados do formulário

    // Substitua o URL pelo seu link do Google Apps Script
    fetch('https://script.google.com/macros/s/AKfycbwPCuJ7VFco0J-Is-wtQvLVpJN3x6-xoFFnKRrwjI0YP1ZvCG6-_STNFosltFLVQP8/exec', {
        method: 'POST',  // Aqui deve ser 'POST', não 'doPost'
        body: formData
    })
    .then(response => response.json())  // Transforma a resposta em JSON
    .then(data => {
        if (data.result === 'success') {
            alert('Dados enviados com sucesso!');
            document.getElementById('product-form').reset();  // Limpa o formulário
        } else {
            alert('Erro ao enviar os dados: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Ocorreu um erro ao enviar os dados. Por favor, tente novamente.');
    });
});

function goBack() {
    window.history.back();  // Retorna para a página anterior
}
