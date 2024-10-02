// Função para ir para a home
function goHome() {
    window.location.href = './home.html';
}

// Função para buscar itens por data
function searchItemsByDate() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (!startDate || !endDate) {
        alert('Por favor, selecione ambas as datas.');
        return;
    }

    const db = firebase.firestore();
    db.collection('entradaprodutos')
        .where('data_cadastro', '>=', startDate)
        .where('data_cadastro', '<=', endDate)
        .get()
        .then((querySnapshot) => {
            const tbody = document.getElementById('itemsTable').getElementsByTagName('tbody');
            tbody.innerHTML = ''; // Limpa o conteúdo anterior

            querySnapshot.forEach((doc) => {
                const produto = doc.data();
                const row = tbody.insertRow();

                row.insertCell(0).innerText = produto.sku;
                row.insertCell(1).innerText = produto.descricao;
                row.insertCell(2).innerText = produto.tipo;
                row.insertCell(3).innerText = produto.unidade;
                row.insertCell(4).innerText = produto.grupo;
                row.insertCell(5).innerText = produto.quantidade;
                row.insertCell(6).innerText = produto.fornecedor;
                row.insertCell(7).innerText = produto.data_cadastro;
                row.insertCell(8).innerText = produto.data_vencimento;
                row.insertCell(9).innerText = produto.valor_unitario;
                row.insertCell(10).innerText = produto.valor_total;
            });
        })
        .catch((error) => {
            console.error('Erro ao buscar dados:', error);
        });
}

// Função para exportar para Excel
function exportToExcel() {
    // Lógica para exportar a tabela para um arquivo Excel
    console.log('Exportando para Excel');
}

// Função para ler dados do Firestore e exibir na tabela
function loadItems() {
    const db = firebase.firestore();
    db.collection('entradaprodutos')
        .get()
        .then((querySnapshot) => {
            const tbody = document.getElementById('itemsTable').getElementsByTagName('tbody');
            tbody.innerHTML = ''; // Limpa o conteúdo anterior

            querySnapshot.forEach((doc) => {
                const produto = doc.data();
                const row = tbody.insertRow();

                row.insertCell(0).innerText = produto.sku;
                row.insertCell(1).innerText = produto.descricao;
                row.insertCell(2).innerText = produto.tipo;
                row.insertCell(3).innerText = produto.unidade;
                row.insertCell(4).innerText = produto.grupo;
                row.insertCell(5).innerText = produto.quantidade;
                row.insertCell(6).innerText = produto.fornecedor;
                row.insertCell(7).innerText = produto.data_cadastro;
                row.insertCell(8).innerText = produto.data_vencimento;
                row.insertCell(9).innerText = produto.valor_unitario;
                row.insertCell(10).innerText = produto.valor_total;
            });
        })
        .catch((error) => {
            console.error('Erro ao buscar dados:', error);
        });
}

// Chame a função para carregar os itens quando a página carregar
window.onload = loadItems;
