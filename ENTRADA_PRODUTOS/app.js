// Função para enviar dados
document.getElementById('dataForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const sku = document.getElementById('sku').value;
    const descricao = document.getElementById('descricao').value;
    const tipo = document.getElementById('tipo').value;
    const unidade = document.getElementById('unidade').value;
    const grupo = document.getElementById('grupo').value;
    const quantidade = document.getElementById('quantidade').value;
    const valor_unitario = document.getElementById('valor_unitario').value;
    const valor_total = document.getElementById('valor_total').value;
    const fornecedor = document.getElementById('fornecedor').value;
    const data_cadastro = document.getElementById('data_cadastro').value;
    const data_vencimento = document.getElementById('data_vencimento').value;

    // Referência ao banco de dados
    const db = firebase.database().ref('produtos');

    // Dados a serem enviados
    const entradaprodutos = {
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

    // Enviar dados para o Firebase
    db.push(entradaprodutos)
        .then(() => {
            alert('Produto salvo com sucesso!');
            document.getElementById('dataForm').reset();
        })
        .catch((error) => {
            console.error('Erro ao salvar produto: ', error);
        });
});

// Função para calcular o valor total
function calcularValorTotal() {
    const quantidade = document.getElementById('quantidade').value;
    const valor_unitario = document.getElementById('valor_unitario').value;
    const valor_total = quantidade * valor_unitario;
    document.getElementById('valor_total').value = valor_total.toFixed(2);
}

// Função para limpar o formulário
function limparFormulario() {
    document.getElementById('dataForm').reset();
}

// Função para ir para a home
function irParaHome() {
    window.location.href = "./home.html"; // Substitua pelo caminho correto para a página inicial
}

// Função para ler dados do Firebase
//function lerDados() {
  //  const db = firebase.database().ref('produtos');
    //db.on('value', (snapshot) => {
      //  const data = snapshot.val();
        //console.log(data);
        // Aqui você pode adicionar lógica para exibir os dados na sua página
        //document.getElementById('output').innerText = JSON.stringify(data, null, 2);
    });
}

// Chame a função para ler os dados quando a página carregar
//window.onload = lerDados;
