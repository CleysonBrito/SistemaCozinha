// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC7eniB3_IFT8E-Tb1VkfktcWUsfLRRYXw",
    authDomain: "bancoreciclar.firebaseapp.com",
    databaseURL: "https://bancoreciclar-default-rtdb.firebaseio.com",
    projectId: "bancocozinha",
    storageBucket: "bancoreciclar.firebasestorage.app",
    messagingSenderId: "418801320354",
    appId: "1:418801320354:web:3f854deb9e2dda520732fb",
    measurementId: "G-5J6XFE0H02"
};

// Inicializar o Firebase
firebase.initializeApp(firebaseConfig);

// Referência ao banco de dados de produtos
const dbProdutos = firebase.database().ref('estoque');

// Referência ao banco de dados de saídas
const dbSaidas = firebase.database().ref('registrosaidas');

// Função para consultar dados com filtros
function consultarDados() {
    const sku = document.getElementById('sku').value.trim().toLowerCase();
    const descricao = document.getElementById('nome').value.trim().toLowerCase(); // Mudança para filtrar pela descrição
    const dataInicial = document.getElementById('data-inicial').value;
    const dataFinal = document.getElementById('data-final').value;

    dbProdutos.once('value', (snapshot) => {
        const produtos = snapshot.val();
        const resultados = [];

        for (const key in produtos) {
            if (produtos.hasOwnProperty(key)) {
                const produto = produtos[key];
                const atendeSku = !sku || (produto.sku || '').toLowerCase().includes(sku);
                const atendeDescricao = !descricao || (produto.descricao || '').toLowerCase().includes(descricao); // Mudança para filtrar pela descrição
                const atendeDataCadastro = (!dataInicial || new Date(produto.data_cadastro) >= new Date(dataInicial)) &&
                                           (!dataFinal || new Date(produto.data_cadastro) <= new Date(dataFinal));

                if (atendeSku && atendeDescricao && atendeDataCadastro) {
                    resultados.push({ key, ...produto }); // Inclui a chave do produto
                }
            }
        }

        // Ordenar os resultados pela descrição em ordem alfabética
        resultados.sort((a, b) => (a.descricao || '').localeCompare(b.descricao || ''));

        exibirResultados(resultados);
    });
}

// Função para exibir os resultados na tabela
function exibirResultados(resultados) {
    const tabela = document.getElementById('resultados');
    tabela.innerHTML = '';

    resultados.forEach(produto => {
        const row = tabela.insertRow();
        if (produto.quantidade <= 5) {
            row.classList.add('low-stock');
        }
        row.insertCell(0).innerText = produto.sku || '';
        row.insertCell(1).innerText = produto.descricao || '';
        row.insertCell(2).innerText = produto.tipo || '';
        row.insertCell(3).innerText = produto.unidade || '';
        row.insertCell(4).innerText = produto.grupo || '';
        row.insertCell(5).innerText = produto.quantidade || 0;
        row.insertCell(6).innerText = produto.peso !== undefined ? produto.peso : 0; // Alterado para usar "peso"
        row.insertCell(7).innerText = produto.peso_total !== undefined ? produto.peso_total : 0;
        row.insertCell(8).innerText = produto.fornecedor || '';
        row.insertCell(9).innerText = produto.data_cadastro ? new Date(produto.data_cadastro).toLocaleDateString('pt-BR') : '';
        row.insertCell(10).innerText = produto.data_vencimento ? new Date(produto.data_vencimento).toLocaleDateString('pt-BR') : '';

        // Calcular Dias de Consumo
        let diasConsumo = 0;
        if (produto.data_cadastro && produto.data_vencimento) {
            const dataCadastro = new Date(produto.data_cadastro);
            const dataVencimento = new Date(produto.data_vencimento);
            diasConsumo = Math.floor((dataVencimento - dataCadastro) / (1000 * 60 * 60 * 24));
        }
        row.insertCell(11).innerText = diasConsumo;

        row.insertCell(12).innerText = produto.valor_unitario !== undefined ? produto.valor_unitario : 0;
        row.insertCell(13).innerText = produto.valor_total !== undefined ? produto.valor_total : 0;
        const actionCell = row.insertCell(14);
        const saidaButton = document.createElement('button');
        saidaButton.innerText = 'Registrar Saída';
        saidaButton.onclick = () => abrirModalSaida(produto, produto.key);
        actionCell.appendChild(saidaButton);
    });
}

// Função para abrir o modal de saída
function abrirModalSaida(produto, key) {
    const modal = document.getElementById('saida-modal');
    modal.style.display = 'block';

    // Salva a chave do produto no modal
    modal.setAttribute('data-key', key);

    document.getElementById('saida-sku').value = produto.sku || '';
    document.getElementById('saida-descricao').innerText = `Descrição: ${produto.descricao || ''}`;
    document.getElementById('saida-quantidade-atual').innerText = `Quantidade Atual: ${produto.quantidade || 0}`;
    document.getElementById('saida-detalhes').innerText = `
        Tipo: ${produto.tipo || ''}, Unidade: ${produto.unidade || ''}, Grupo: ${produto.grupo || ''}, 
        Peso Unitário: ${produto.peso_unitario || 0} Kg, Peso Total: ${produto.peso_total || 0} Kg, 
        Fornecedor: ${produto.fornecedor || ''}, Cadastro: ${produto.data_cadastro ? new Date(produto.data_cadastro).toLocaleDateString('pt-BR') : ''}, 
        Vencimento: ${produto.data_vencimento ? new Date(produto.data_vencimento).toLocaleDateString('pt-BR') : ''}, 
        Dias de Consumo: ${produto.dias_consumo || 0}, Valor Unitário: R$ ${produto.valor_unitario || 0}, Valor Total: R$ ${produto.valor_total || 0}
    `;
}

// Evento para registrar a saída ao submeter o formulário
document.getElementById('saida-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const sku = document.getElementById('saida-sku').value.trim().toLowerCase();
    const quantidadeSaida = parseInt(document.getElementById('saida-quantidade').value);
    const responsavel = document.getElementById('saida-responsavel').value;
    const modal = document.getElementById('saida-modal');
    const key = modal.getAttribute('data-key'); // Recupera a chave do modal

    if (!key) {
        alert('Erro ao identificar o produto. Por favor, tente novamente.');
        return;
    }

    // Acessa o item diretamente pelo caminho exato no banco
    dbProdutos.child(key).once('value', (snapshot) => {
        const produtoSelecionado = snapshot.val();

        if (!produtoSelecionado) {
            alert('Produto não encontrado!');
            return;
        }

        if (produtoSelecionado.quantidade < quantidadeSaida) {
            alert('Quantidade insuficiente em estoque!');
            return;
        }

        const novaQuantidade = produtoSelecionado.quantidade - quantidadeSaida;

        // Verifica se o estoque está baixo
        if (novaQuantidade <= 5) {
            alert('Atenção: Estoque baixo!');
        }

        const saida = {
            sku: sku,
            descricao: produtoSelecionado.descricao,
            tipo: produtoSelecionado.tipo,
            unidade: produtoSelecionado.unidade,
            grupo: produtoSelecionado.grupo,
            peso_unitario: produtoSelecionado.peso_unitario || 0,
            peso_total: produtoSelecionado.peso_total || 0,
            fornecedor: produtoSelecionado.fornecedor,
            quantidade_saida: quantidadeSaida,
            responsavel: responsavel,
            data_cadastro: produtoSelecionado.data_cadastro || '',
            data_vencimento: produtoSelecionado.data_vencimento || '',
            dias_consumo: produtoSelecionado.dias_consumo || 0,
            valor_unitario: produtoSelecionado.valor_unitario || 0,
            valor_total: produtoSelecionado.valor_total || 0,
            data_saida: new Date().toISOString()
        };

        if (novaQuantidade <= 0) {
            dbSaidas.push(saida)
                .then(() => {
                    dbProdutos.child(key).remove()
                        .then(() => {
                            alert('Produto removido do estoque, pois a quantidade chegou a zero.');
                            modal.style.display = 'none';
                            consultarDados();
                        })
                        .catch(error => console.error('Erro ao remover produto:', error));
                })
                .catch(error => console.error('Erro ao registrar saída:', error));
        } else {
            dbProdutos.child(key).update({ quantidade: novaQuantidade })
                .then(() => {
                    dbSaidas.push(saida)
                        .then(() => {
                            alert('Saída registrada com sucesso!');
                            modal.style.display = 'none';
                            consultarDados();
                        })
                        .catch(error => console.error('Erro ao registrar saída:', error));
                })
                .catch(error => console.error('Erro ao atualizar quantidade:', error));
        }
    });
});

// Função para limpar os filtros
function limparFiltros() {
    document.getElementById('sku').value = '';
    document.getElementById('nome').value = '';
    document.getElementById('data-inicial').value = '';
    document.getElementById('data-final').value = '';
    consultarDados(); // Recarregar dados após limpar filtros
}

// Fechar o modal quando o usuário clicar no botão de fechar
document.querySelector('.close').onclick = function() {
    document.getElementById('saida-modal').style.display = 'none';
};

// Fechar o modal quando o usuário clicar fora do modal
window.onclick = function(event) {
    const modal = document.getElementById('saida-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// Adicionar eventos aos botões
document.addEventListener('DOMContentLoaded', function() {
    consultarDados(); // Carregar dados automaticamente ao abrir a página
    document.getElementById('consultar-btn').addEventListener('click', consultarDados);
    document.getElementById('limpar-btn').addEventListener('click', limparFiltros);
    document.getElementById('registro-saida-btn').addEventListener('click', function() {
        window.location.href = './registroSaida.html'; // Redirecionar para a página de registro de saída
    });
});

function goHome() {
    window.location.href = './home.html';
}
