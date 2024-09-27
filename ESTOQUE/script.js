function goHome() {
    window.location.href = './home.html';
}

function searchItems() {
    const searchInput = document.getElementById('searchInput').value;
    const searchOption = document.getElementById('searchOptions').value;
    // Lógica para pesquisar itens com base na opção selecionada e no valor de entrada
    console.log(`Pesquisando por ${searchOption}: ${searchInput}`);
}

function exportToExcel() {
    // Lógica para exportar a tabela para um arquivo Excel
    console.log('Exportando para Excel');
}
