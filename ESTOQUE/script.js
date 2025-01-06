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

firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref('estoque');

// Funções de formatação
function formatarData(data) {
    if (!data) return "";
    const date = new Date(data);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const ano = date.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

function formatarValor(valor) {
    if (isNaN(valor)) return "R$ 0,00";
    return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatarPeso(peso) {
    if (isNaN(peso)) return "0,000";
    return Number(peso).toFixed(3).replace('.', ',');
}
function limparFiltros() {
    document.getElementById('sku').value = '';
    document.getElementById('descricao').value = '';
    document.getElementById('marca').value = '';
    document.getElementById('tipo').value = '';
    document.getElementById('grupo').value = '';
    document.getElementById('fornecedor').value = '';
    document.getElementById('diasAntesVencimento').value = '';
    document.getElementById('dataInicial').value = '';
    document.getElementById('dataFinal').value = '';
    consultarDados();
}

function consultarDados() {
    const sku = document.getElementById('sku').value;
    const descricao = document.getElementById('descricao').value;
    const marca = document.getElementById('marca').value;
    const tipo = document.getElementById('tipo').value;
    const grupo = document.getElementById('grupo').value;
    const fornecedor = document.getElementById('fornecedor').value;
    const diasAntesVencimento = document.getElementById('diasAntesVencimento').value;
    const dataInicial = new Date(document.getElementById('dataInicial').value);
    const dataFinal = new Date(document.getElementById('dataFinal').value);
    let valorTotalGeral = 0;

    db.once('value', (snapshot) => {
        const produtos = snapshot.val();
        const resultados = [];
        const quantidadePorDescricao = {};
        const valorTotalPorDescricao = {};

        if (produtos) {
            for (const key in produtos) {
                if (produtos.hasOwnProperty(key)) {
                    const produto = produtos[key];
                    const dataVencimento = new Date(produto.data_vencimento);
                    const dataCadastro = new Date(produto.data_cadastro);
                    const diasRestantes = Math.ceil((dataVencimento - new Date()) / (1000 * 60 * 60 * 24));

                    if ((sku === '' || produto.sku?.includes(sku)) &&
                        (descricao === '' || produto.descricao?.includes(descricao)) &&
                        (marca === '' || produto.marca?.includes(marca)) &&
                        (tipo === '' || produto.tipo === tipo) &&
                        (grupo === '' || produto.grupo === grupo) &&
                        (fornecedor === '' || produto.fornecedor?.includes(fornecedor)) &&
                        (diasAntesVencimento === '' || diasRestantes <= diasAntesVencimento) &&
                        (isNaN(dataInicial.getTime()) || dataCadastro >= dataInicial) &&
                        (isNaN(dataFinal.getTime()) || dataCadastro <= dataFinal)) {
                        resultados.push({ ...produto, key });
                        if (quantidadePorDescricao[produto.descricao]) {
                            quantidadePorDescricao[produto.descricao] += Number(produto.quantidade);
                            valorTotalPorDescricao[produto.descricao] += Number(produto.valor_unitario) * Number(produto.quantidade);
                        } else {
                            quantidadePorDescricao[produto.descricao] = Number(produto.quantidade);
                            valorTotalPorDescricao[produto.descricao] = Number(produto.valor_unitario) * Number(produto.quantidade);
                        }
                        valorTotalGeral += Number(produto.valor_unitario) * Number(produto.quantidade);
                    }
                }
            }
        }
        exibirResultados(resultados);
        exibirTotalQuantidade(quantidadePorDescricao, valorTotalPorDescricao, valorTotalGeral);
    }).catch(error => {
        console.error("Erro ao consultar dados:", error);
        alert("Ocorreu um erro ao consultar os dados. Consulte o console para mais detalhes.");
    });
}

function exibirResultados(resultados) {
    const tabela = document.getElementById('resultados');
    tabela.innerHTML = '';

    if (resultados.length === 0) {
        tabela.innerHTML = "<tr><td colspan='16'>Nenhum resultado encontrado.</td></tr>";
        return;
    }

    resultados.forEach(produto => {
        const row = tabela.insertRow();
        row.insertCell(0).innerText = produto.sku || "";
        row.insertCell(1).innerText = produto.descricao || "";
        row.insertCell(2).innerText = produto.marca || "";
        row.insertCell(3).innerText = produto.tipo || "";
        row.insertCell(4).innerText = produto.unidade || "";
        row.insertCell(5).innerText = produto.grupo || "";
        row.insertCell(6).innerText = produto.quantidade || "";
        row.insertCell(7).innerText = produto.peso || "";
        row.insertCell(8).innerText = produto.peso_total || "";
        row.insertCell(9).innerText = produto.fornecedor || "";
        row.insertCell(10).innerText = formatarData(produto.data_cadastro);
        row.insertCell(11).innerText = formatarData(produto.data_vencimento);

        const tempoRestante = Math.ceil((new Date(produto.data_vencimento) - new Date()) / (1000 * 60 * 60 * 24));
        const dataConsumoCell = row.insertCell(12);
        dataConsumoCell.innerText = tempoRestante;
        if (tempoRestante <= 10) {
            dataConsumoCell.style.color = 'red';
        }

        row.insertCell(13).innerText = formatarValor(produto.valor_unitario);
        row.insertCell(14).innerText = formatarValor(Number(produto.valor_unitario) * Number(produto.quantidade));

        const editarBtn = document.createElement('button');
        editarBtn.innerText = 'Editar';
        editarBtn.onclick = () => abrirModalEditar(produto);
        const acoesCell = row.insertCell(15);
        acoesCell.appendChild(editarBtn);
    });
    calcularQuantidadeTotalKg(resultados);
}
function exibirTotalQuantidade(quantidadePorDescricao, valorTotalPorDescricao, valorTotalGeral) {
    const totalQuantidade = Object.values(quantidadePorDescricao).reduce((acc, curr) => acc + curr, 0);
    const totalQuantidadeElement = document.getElementById('total-quantidade');
    totalQuantidadeElement.innerText = `Total Quantidade: ${totalQuantidade}`;

    if (totalQuantidade <= 10) {
        totalQuantidadeElement.classList.add('total-vermelho');
    } else {
        totalQuantidadeElement.classList.remove('total-vermelho');
    }

    document.getElementById('total-valor').textContent = `Valor Total: ${formatarValor(valorTotalGeral)}`;
}

function calcularQuantidadeTotalKg(resultados) {
    let totalKg = 0;
    resultados.forEach(produto => {
        const quantidade = parseFloat(produto.quantidade);
        const pesoProduto = parseFloat(produto.peso);
        if (!isNaN(quantidade) && !isNaN(pesoProduto)) {
            totalKg += quantidade * pesoProduto;
        }
    });
    document.getElementById('quantidade-total-kg').textContent = `Quantidade Total em KG: ${totalKg.toFixed(2)}`;
}

function exibirDados(dados) {
    const tabela = document.getElementById('tabelaEstoque');
    tabela.innerHTML = '';
    dados.forEach(item => {
        const linha = tabela.insertRow();
        linha.insertCell(0).innerText = item.sku || "";
        linha.insertCell(1).innerText = item.descricao || "";
        linha.insertCell(2).innerText = item.marca || "";
        linha.insertCell(3).innerText = item.tipo || "";
        linha.insertCell(4).innerText = item.grupo || "";
        linha.insertCell(5).innerText = item.fornecedor || "";
        linha.insertCell(6).innerText = formatarValor(item.valor_unitario); // Corrigido: valor_unitario
        linha.insertCell(7).innerText = formatarPeso(item.peso); // Corrigido: peso
    });
}
// Funções do Modal
function abrirModalEditar(produto) {
    const modal = document.getElementById('editModal');
    document.getElementById('editSKU').value = produto.sku || "";
    document.getElementById('editDescricao').value = produto.descricao || "";
    document.getElementById('editMarca').value = produto.marca || "";
    document.getElementById('editTipo').value = produto.tipo || "";
    document.getElementById('editUnidade').value = produto.unidade || "";
    document.getElementById('editGrupo').value = produto.grupo || "";
    document.getElementById('editQuantidade').value = produto.quantidade || "";
    document.getElementById('editPesoProduto').value = produto.peso || "";
    document.getElementById('editPesoTotal').value = produto.peso_total || "";
    document.getElementById('editFornecedor').value = produto.fornecedor || "";
    document.getElementById('editDataCadastro').value = produto.data_cadastro || "";
    document.getElementById('editDataVencimento').value = produto.data_vencimento || "";
    document.getElementById('editValorUnitario').value = produto.valor_unitario || "";
    document.getElementById('editValorTotal').value = produto.valor_total || ""; // Mantido
    modal.style.display = "block";

    const form = document.getElementById('editForm');
    form.onsubmit = function(event) {
        event.preventDefault();
        salvarEdicao(produto.key);
    };
}
function salvarEdicao(key) {
    const produtoAtualizado = {
        descricao: document.getElementById('editDescricao').value,
        marca: document.getElementById('editMarca').value,
        tipo: document.getElementById('editTipo').value,
        unidade: document.getElementById('editUnidade').value,
        grupo: document.getElementById('editGrupo').value,
        quantidade: document.getElementById('editQuantidade').value,
        peso: document.getElementById('editPesoProduto').value,
        peso_total: document.getElementById('editPesoTotal').value,
        fornecedor: document.getElementById('editFornecedor').value,
        data_cadastro: document.getElementById('editDataCadastro').value,
        data_vencimento: document.getElementById('editDataVencimento').value,
        valor_unitario: document.getElementById('editValorUnitario').value,
        valor_total: document.getElementById('editValorTotal').value // Mantido
    };

    db.child(key).update(produtoAtualizado, (error) => {
        if (error) {
            alert("Erro ao atualizar produto: " + error.message);
        } else {
            alert("Produto atualizado com sucesso!");
            fecharModal();
            consultarDados();
        }
    });
}
function fecharModal() {
    const modal = document.getElementById('editModal');
    modal.style.display = "none";
}

// Fechar o modal ao clicar no "x"
document.querySelector('.close').onclick = fecharModal;

// Fechar o modal ao clicar fora dele
window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target == modal) {
        fecharModal();
    }
};
document.addEventListener('DOMContentLoaded', function() {
    consultarDados(); // Carrega os dados inicialmente
    document.getElementById('consultar-btn').addEventListener('click', consultarDados);
    document.getElementById('limpar-btn').addEventListener('click', limparFiltros);

    db.on('value', snapshot => {
        const dados = [];
        snapshot.forEach(childSnapshot => {
            const item = childSnapshot.val();
            dados.push(item);
        });
        exibirDados(dados);
    }, error => {
        console.error("Erro no listener do Firebase:", error);
        alert("Ocorreu um erro ao carregar os dados iniciais. Consulte o console para mais detalhes.");
    });
});

document.getElementById('cadastrar-btn').addEventListener('click', function() {
    window.location.href = 'cadastrodeprodutos.html';
});

document.getElementById('saida-btn').addEventListener('click', function() {
    window.location.href = './saída.html';
});



