// Inicialização do Firebase (usando as configurações anteriores)
const dbRef = firebase.database().ref("entradaprodutos");

// Função para consultar dados no Firebase
function consultarDados() {
    const skuInput = document.getElementById('sku').value;

    // Consulta com base no SKU (você pode mudar para outro campo de busca)
    dbRef.orderByChild('sku').equalTo(skuInput).once('value', snapshot => {
        if (snapshot.exists()) {
            snapshot.forEach(childSnapshot => {
                const data = childSnapshot.val();
                
                // Exibe os dados na tabela
                const tableBody = document.getElementById('saidaTableBody');
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${new Date().toLocaleDateString()}</td>
                    <td>${data.sku}</td>
                    <td>${data.descricao}</td>
                    <td>${data.quantidade}</td>
                    <td>${data.unidade}</td>
                    <td>${data.tipo}</td>
                    <td>
                        <button class="acaoButton" onclick="editarLinha(this, '${childSnapshot.key}')">Editar</button>
                        <button class="acaoButton" onclick="excluirDados('${childSnapshot.key}')">Excluir</button>
                    </td>`;
                
                tableBody.appendChild(newRow);
            });
        } else {
            alert('Nenhum produto encontrado com este SKU.');
        }
    }).catch(error => {
        console.error('Erro ao consultar dados:', error);
    });
}

// Função para excluir dados do Firebase
function excluirDados(key) {
    const confirmDelete = confirm('Tem certeza que deseja excluir este produto?');
    if (confirmDelete) {
        dbRef.child(key).remove()
        .then(() => {
            alert('Produto excluído com sucesso!');
            // Atualiza a tabela removendo a linha correspondente
            document.getElementById('saidaTableBody').innerHTML = '';
        })
        .catch(error => {
            console.error('Erro ao excluir produto:', error);
        });
    }
}

// Atualiza a linha ao editar (similar ao adicionarSaida, mas atualizando)
function editarLinha(button, key) {
    const row = button.parentNode.parentNode;
    const sku = row.cells[1].innerText;
    const descricao = row.cells[2].innerText;
    const quantidade = row.cells[3].innerText;
    const unidade = row.cells[4].innerText;
    const tipo = row.cells[5].innerText;

    // Preenche o formulário com os dados para edição
    document.getElementById('sku').value = sku;
    document.getElementById('descricao').value = descricao;
    document.getElementById('quantidade').value = quantidade;
    document.getElementById('unidade').value = unidade;
    document.getElementById('tipo').value = tipo;

    // Remove a linha da tabela
    row.remove();
}
