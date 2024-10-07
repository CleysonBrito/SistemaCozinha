// Função para buscar dados da planilha via Apps Script
function loadItems() {
    const url = 'https://script.google.com/macros/s/AKfycbyPKIAw5LrdHSouENthZTXzB8xWXoSruGXPJ9grxio184rDrkZKzENTPx9uEYWKZg85/exec'; // URL do Apps Script
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayItems(data);
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });
}

// Função para exibir os itens na tabela
function displayItems(data) {
    const tbody = document.getElementById('itemsTable').getElementsByTagName('tbody');
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
}

// Função para buscar itens com filtros
function searchItems() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const searchName = document.getElementById('searchName').value.toLowerCase();
    const searchSKU = document.getElementById('searchSKU').value.toLowerCase();

    const url = 'https://script.google.com/macros/s/AKfycbyPKIAw5LrdHSouENthZTXzB8xWXoSruGXPJ9grxio184rDrkZKzENTPx9uEYWKZg85/exec'; // URL do Apps Script
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const filteredData = data.filter(produto => {
                const dataCadastro = new Date(produto.data_cadastro);
                const startDateMatch = startDate ? dataCadastro >= new Date(startDate) : true;
                const endDateMatch = endDate ? dataCadastro <= new Date(endDate) : true;
                const nameMatch = searchName ? produto.descricao.toLowerCase().includes(searchName) : true;
                const skuMatch = searchSKU ? produto.sku.toLowerCase().includes(searchSKU) : true;

                return startDateMatch && endDateMatch && nameMatch && skuMatch;
            });

            displayItems(filteredData);
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });
}

// Chame a função para carregar os itens quando a página carregar
window.onload = loadItems;
