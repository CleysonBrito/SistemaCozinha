document.getElementById('homeButton').addEventListener('click', function() {
    window.location.href = './home.html';
});

function adicionarSaida() {
    const sku = document.getElementById('sku').value;
    const descricao = document.getElementById('descricao').value;
    const tipo = document.getElementById('tipo').value;
    const unidade = document.getElementById('unidade').value;
    const quantidade = document.getElementById('quantidade').value;

    if (isNaN(quantidade) || quantidade === '') {
        alert('Por favor, insira um valor numérico para a quantidade.');
        return;
    }

    const quantidadeInt = parseInt(quantidade);
    
    if (quantidadeInt <= 5) {
        alert('Estoque baixo! É necessário fazer uma compra.');
    }

    const tableBody = document.getElementById('saidaTableBody');
    const newRow = document.createElement('tr');
    
    // Template literal corrigido para a linha da tabela
    newRow.innerHTML = `
        <td>${new Date().toLocaleDateString()}</td>
        <td>${sku}</td>
        <td>${descricao}</td>
        <td>${quantidadeInt}</td>
        <td>${unidade}</td>
        <td>${tipo}</td>
        <td>
            <button class="acaoButton" onclick="editarLinha(this)">Editar</button>
            <button class="acaoButton" onclick="excluirLinha(this)">Excluir</button>
        </td>
    `;
    
    tableBody.appendChild(newRow);
}

function editarLinha(button) {
    const row = button.parentNode.parentNode;
    document.getElementById('sku').value = row.cells[1].innerText;
    document.getElementById('descricao').value = row.cells[2].innerText;
    document.getElementById('quantidade').value = row.cells[3].innerText;
    document.getElementById('unidade').value = row.cells[4].innerText;
    document.getElementById('tipo').value = row.cells[5].innerText;

    row.remove();
}

function excluirLinha(button) {
    const row = button.parentNode.parentNode;
    row.remove();
}

function salvar() {
    alert('Dados salvos com sucesso!');
}

function limpar() {
    document.getElementById('saidaForm').reset();
    document.getElementById('saidaTableBody').innerHTML = '';
}
