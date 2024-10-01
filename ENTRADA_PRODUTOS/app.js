// Função para enviar dados
document.getElementById('dataForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Extrair valores do formulário
    const sku = document.getElementById('sku').value;
    const descricao = document.getElementById('descricao').value;
    const tipo = document.getElementById('tipo').value;
    const unidade = document.getElementById('unidade').value;
    const grupo = document.getElementById('grupo').value;
    const quantidade = parseFloat(document.getElementById('quantidade').value) || 0;
    const valor_unitario = parseFloat(document.getElementById('valor_unitario').value) || 0;
    const valor_total = parseFloat(document.getElementById('valor_total').value) || 0;
    const fornecedor = document.getElementById('fornecedor').value;
    const data_cadastro = document.getElementById('data_cadastro').value;
    const data_vencimento = document.getElementById('data_vencimento').value;

    // Dados a serem enviados
    const data = {
        sku,
        descricao,
        tipo,
        unidade,
        grupo,
        quantidade,
        valor_unitario,
        valor_total,
        fornecedor,
        data_cadastro,
        data_vencimento
    };

    // Enviar dados para o Google Apps Script
    fetch('https://script.google.com/macros/s/AKfycbyyxWECBn0dOYrRKk2mx0MQdysL9RHc1qWskCHnibpFjwd9lJ7GTVNL57lvU1M7OjXO/exec', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('Erro na resposta do servidor');
        return response.json();
    })
    .then(result => {
        if (result.status === 'success') {
            alert('Produto salvo com sucesso!');
            document.getElementById('dataForm').reset();
        } else {
            throw new Error(result.message || 'Erro ao salvar o produto.');
        }
    })
    .catch(error => {
        console.error('Erro ao salvar o produto:', error);
        alert('Erro ao salvar o produto. Tente novamente.');
    });
});
