// Função para buscar dados da planilha via Apps Script
function loadItems() {
    const url = 'https://script.google.com/macros/s/AKfycbzZbMGxMa2zysqMnw0DcK8kuajQ3R-0matgxl7KICCuqFVHmFjHZlvExwrzgNwO6SSJ/exec'; // URL do Apps Script
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('itemsTable').getElementsByTagName('tbody')[0];
            tbody.innerHTML = ''; // Limpa o conteúdo anterior

            data.forEach((produto) => {
                const row = tbody.insertRow();
                
                row.insertCell(0).innerText = produto.sku;
                row.insertCell(1).innerText = produto.descricao;
                row.insertCell(2).innerText = produto.tipo;
                row.insertCell(3).innerText = produto.unidade;
                row.insertCell(4).innerText = produto.grupo;
                row.insertCell(5).innerText = produto.quantidade;
                row.insertCell(6).innerText = produto.fornecedor;
                row.insertCell(7).innerText = new Date(produto.data_cadastro).toLocaleDateString(); // Formata a data
                row.insertCell(8).innerText = new Date(produto.data_vencimento).toLocaleDateString(); // Formata a data
                row.insertCell(9).innerText = produto.valor_unitario;
                row.insertCell(10).innerText = produto.valor_total;
            });
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });
}

// Chame a função para carregar os itens quando a página carregar
window.onload = loadItems;
