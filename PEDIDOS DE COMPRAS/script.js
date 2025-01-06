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
const db = firebase.database().ref('pedidos');
const fornecedoresDb = firebase.database().ref('cadastrodefornecedores');
const estoqueDb = firebase.database().ref('estoque');

document.addEventListener('DOMContentLoaded', () => {
    gerarNumeroPedido().then(numeroPedido => {
        document.getElementById('numeroPedido').value = numeroPedido;
    });

    document.getElementById('salvarAlteracaoBtn').addEventListener('click', salvarAlteracoes);
    document.getElementById('finalizarPedidoBtn').addEventListener('click', finalizarPedido);
    document.getElementById('abrirFornecedoresBtn').addEventListener('click', abrirModalFornecedores);
    document.getElementsByClassName('close')[0].addEventListener('click', fecharModalFornecedores);

    window.addEventListener('click', (event) => {
        if (event.target == document.getElementById('fornecedoresModal')) {
            fecharModalFornecedores();
        }
    });

    atualizarTabelaPedidos();
});

function abrirModalFornecedores() {
    const modal = document.getElementById('fornecedoresModal');
    const tbody = document.getElementById('fornecedoresTable').querySelector('tbody');
    tbody.innerHTML = '';
    fornecedoresDb.once('value').then(snapshot => {
        snapshot.forEach(childSnapshot => {
            const fornecedor = childSnapshot.val();
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${fornecedor.razaoSocial}</td>
                <td>${fornecedor.cnpj}</td>
                <td>${fornecedor.grupo}</td>
                <td>${fornecedor.contato || ''}</td>
                <td>${fornecedor.email || ''}</td>
                <td>${fornecedor.telefone || ''}</td>
                <td><button onclick="selecionarFornecedor('${fornecedor.razaoSocial}', '${fornecedor.cnpj}', '${fornecedor.grupo}', '${fornecedor.contato || ''}', '${fornecedor.email || ''}', '${fornecedor.telefone || ''}')">Selecionar</button></td>
            `;
            tbody.appendChild(tr);
        });
    });
    modal.style.display = 'block';
}

function fecharModalFornecedores() {
    const modal = document.getElementById('fornecedoresModal');
    modal.style.display = 'none';
}

function selecionarFornecedor(razaoSocial, cnpj, grupo, contato, email, telefone) {
    document.getElementById('razaoSocial').value = razaoSocial;
    document.getElementById('cnpjFornecedor').value = cnpj;
    document.getElementById('grupoFornecedor').value = grupo;
    document.getElementById('contatoFornecedor').value = contato;
    document.getElementById('emailFornecedor').value = email;
    document.getElementById('telefoneFornecedor').value = telefone;
    fecharModalFornecedores();
}

async function gerarNumeroPedido() {
    const snapshot = await db.once('value');
    const pedidosExistentes = snapshot.val();
    let numeroPedido;
    
    do {
        numeroPedido = `PED${Math.floor(Math.random() * 1000000)}`;
    } while (Object.values(pedidosExistentes || {}).some(pedido => pedido.numeroPedido === numeroPedido));

    return numeroPedido;
}
function adicionarProduto() {
    const container = document.getElementById('produtosContainer');
    const produtoDiv = document.createElement('div');
    produtoDiv.classList.add('produto');
    const inputId = 'sku-' + new Date().getTime();
    produtoDiv.innerHTML = `
        <label>SKU:</label>
        <input type="text" id="${inputId}" class="sku" data-id="${inputId}" onclick="abrirModalProdutos(this)">
        <label>Descrição:</label>
        <input type="text" class="descricao" readonly>
        <label>Quantidade:</label>
        <input type="number" class="quantidade" oninput="calcularValorTotal(this)">
        <label>Tipo:</label>
        <input type="text" class="tipo" readonly>
        <label>Unidade:</label>
        <input type="text" class="unidade" readonly>
        <label>Valor Unitário:</label>
        <input type="number" class="valorUnitario" oninput="calcularValorTotal(this)">
        <label>Valor Total:</label>
        <input type="number" class="valorTotal" readonly>
        <label>Observação:</label>
        <input type="text" class="observacao">
    `;
    container.appendChild(produtoDiv);
}

function abrirModalProdutos(inputElement) {
    const modal = document.getElementById('produtosModal');
    modal.dataset.inputElement = inputElement.dataset.id;
    modal.style.display = 'block';
    carregarProdutos(inputElement);
}

function carregarProdutos(inputElement, filtroSku = '', filtroDescricao = '') {
    const tbody = document.getElementById('produtosTable').querySelector('tbody');
    tbody.innerHTML = '';
    const produtosDb = firebase.database().ref('cadastroProdutos');
    produtosDb.once('value').then(snapshot => {
        snapshot.forEach(childSnapshot => {
            const produto = childSnapshot.val();
            if ((filtroSku === '' || produto.sku.includes(filtroSku)) &&
                (filtroDescricao === '' || produto.descricao.includes(filtroDescricao))) {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td>${produto.sku || ''}</td><td>${produto.descricao || ''}</td><td>${produto.tipo || ''}</td><td>${produto.unidade || ''}</td><td><button onclick="selecionarProduto('${produto.sku}', '${produto.descricao}', '${produto.tipo}', '${produto.unidade}', '${inputElement.dataset.id}')">Selecionar</button></td>`;
                tbody.appendChild(tr);
            }
        });
    });
}
function aplicarFiltros() {
    const filtroSku = document.getElementById('filterSku').value;
    const filtroDescricao = document.getElementById('filterDescricao').value;
    const inputElement = document.querySelector(`[data-id="${document.getElementById('produtosModal').dataset.inputElement}"]`);
    carregarProdutos(inputElement, filtroSku, filtroDescricao);
}

function limparFiltros() {
    document.getElementById('filterSku').value = '';
    document.getElementById('filterDescricao').value = '';
    const inputElement = document.querySelector(`[data-id="${document.getElementById('produtosModal').dataset.inputElement}"]`);
    carregarProdutos(inputElement);
}

function selecionarProduto(sku, descricao, tipo, unidade, inputId) {
    const produtoDiv = document.querySelector(`[data-id="${inputId}"]`).closest('.produto');
    if (produtoDiv) {
        produtoDiv.querySelector('.sku').value = sku;
        produtoDiv.querySelector('.descricao').value = descricao;
        produtoDiv.querySelector('.tipo').value = tipo;
        produtoDiv.querySelector('.unidade').value = unidade;
    }
    fecharModalProdutos();
}

function fecharModalProdutos() {
    const modal = document.getElementById('produtosModal');
    modal.style.display = 'none';
}

// Exemplo para abrir o modal e associar o input
document.querySelectorAll('.open-modal').forEach(button => {
    button.addEventListener('click', function () {
        abrirModalProdutos(button);
    });
});
function calcularValorTotal(input) {
    const produtoDiv = input.parentElement;
    const quantidade = produtoDiv.querySelector('.quantidade').value;
    const valorUnitario = produtoDiv.querySelector('.valorUnitario').value;
    const valorTotal = quantidade * valorUnitario;
    produtoDiv.querySelector('.valorTotal').value = valorTotal.toFixed(2);
}

function finalizarPedido() {
    const dataHoje = document.getElementById('dataHoje').value;
    const numeroPedido = document.getElementById('numeroPedido').value;
    const dataPedido = document.getElementById('dataPedido').value;
    const dataAté = document.getElementById('dataAté').value;
    const razaoSocial = document.getElementById('razaoSocial').value;
    const cnpjFornecedor = document.getElementById('cnpjFornecedor').value;
    const grupoFornecedor = document.getElementById('grupoFornecedor').value;
    const contatoFornecedor = document.getElementById('contatoFornecedor').value;
    const emailFornecedor = document.getElementById('emailFornecedor').value;
    const telefoneFornecedor = document.getElementById('telefoneFornecedor').value;

    const produtos = [];
    document.querySelectorAll('.produto').forEach(produtoDiv => {
        const sku = produtoDiv.querySelector('.sku').value;
        const descricao = produtoDiv.querySelector('.descricao').value;
        const quantidade = produtoDiv.querySelector('.quantidade').value;
        const tipo = produtoDiv.querySelector('.tipo').value;
        const unidade = produtoDiv.querySelector('.unidade').value;
        const valorUnitario = produtoDiv.querySelector('.valorUnitario').value;
        const valorTotal = produtoDiv.querySelector('.valorTotal').value;
        const observacao = produtoDiv.querySelector('.observacao')?.value || '';

        produtos.push({ sku, descricao, quantidade, tipo, unidade, valorUnitario, valorTotal, observacao });
    });

    const pedido = {
        dataHoje,
        numeroPedido,
        dataPedido,
        dataAté,
        razaoSocial,
        cnpjFornecedor,
        grupoFornecedor,
        contatoFornecedor,
        emailFornecedor,
        telefoneFornecedor,
        produtos,
        status: 'Pendente'
    };

    // Salvar no Firebase
    db.push(pedido)
        .then(() => {
            alert('Pedido salvo com sucesso!');
            atualizarTabelaPedidos();
            gerarNumeroPedido().then(numeroPedido => {
                document.getElementById('numeroPedido').value = numeroPedido;
            });
            limparFormulario();
        })
        .catch(error => {
            alert('Erro ao salvar o pedido: ' + error);
        });
}

function limparFormulario() {
    document.getElementById('dataHoje').value = '';
    document.getElementById('dataPedido').value = '';
    document.getElementById('dataAté').value = '';
    document.getElementById('razaoSocial').value = '';
    document.getElementById('cnpjFornecedor').value = '';
    document.getElementById('grupoFornecedor').value = '';
    document.getElementById('contatoFornecedor').value = '';
    document.getElementById('emailFornecedor').value = '';
    document.getElementById('telefoneFornecedor').value = '';
    document.getElementById('produtosContainer').innerHTML = '';
}
function atualizarTabelaPedidos() {
    const tbody = document.getElementById('pedidosTable').querySelector('tbody');
    tbody.innerHTML = '';

    db.once('value').then(snapshot => {
        if (!snapshot.exists()) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td colspan="7" style="text-align: center;">Nenhum pedido encontrado.</td>`;
            tbody.appendChild(tr);
            return;
        }

        snapshot.forEach(childSnapshot => {
            const pedido = childSnapshot.val();
            const key = childSnapshot.key;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${pedido.dataHoje || 'Não informado'}</td>
                <td>${pedido.numeroPedido || 'Não informado'}</td>
                <td>${pedido.dataPedido || 'Não informado'}</td>
                <td>${pedido.dataAté || 'Não informado'}</td>
                <td>${pedido.razaoSocial || 'Não informado'}</td>
                <td class="${pedido.status ? pedido.status.toLowerCase() : 'pendente'}">${pedido.status || 'Pendente'}</td>
                <td>
                    <button onclick="editarPedido('${key}')">Editar</button>
                    <button onclick="alterarStatusPedido('${key}', 'Aprovado')">Aprovar</button>
                    <button onclick="alterarStatusPedido('${key}', 'Cancelado')">Cancelar</button>
                    <button onclick="excluirPedido('${key}')">Excluir</button>
                    <button onclick="exportarPedido('${key}', 'excel')">Visualizar Pedido</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }).catch(error => {
        alert('Erro ao carregar pedidos: ' + error.message);
    });
}

function editarPedido(key) {
    db.child(key).get().then(snapshot => {
        if (snapshot.exists()) {
            const pedido = snapshot.val();
            document.getElementById('dataHoje').value = pedido.dataHoje || '';
            document.getElementById('numeroPedido').value = pedido.numeroPedido || '';
            document.getElementById('dataPedido').value = pedido.dataPedido || '';
            document.getElementById('dataAté').value = pedido.dataAté || '';
            document.getElementById('razaoSocial').value = pedido.razaoSocial || '';
            document.getElementById('cnpjFornecedor').value = pedido.cnpjFornecedor || '';
            document.getElementById('grupoFornecedor').value = pedido.grupoFornecedor || '';
            document.getElementById('contatoFornecedor').value = pedido.contatoFornecedor || '';
            document.getElementById('emailFornecedor').value = pedido.emailFornecedor || '';
            document.getElementById('telefoneFornecedor').value = pedido.telefoneFornecedor || '';

            const container = document.getElementById('produtosContainer');
            container.innerHTML = '';
            (pedido.produtos || []).forEach(produto => {
                const produtoDiv = document.createElement('div');
                produtoDiv.classList.add('produto');
                produtoDiv.innerHTML = `
                    <label>SKU:</label>
                    <input type="text" class="sku" value="${produto.sku}">
                    <label>Descrição:</label>
                    <input type="text" class="descricao" value="${produto.descricao}">
                    <label>Quantidade:</label>
                    <input type="number" class="quantidade" value="${produto.quantidade}" oninput="calcularValorTotal(this)">
                    <label>Tipo:</label>
                    <input type="text" class="tipo" value="${produto.tipo}">
                    <label>Unidade:</label>
                    <input type="text" class="unidade" value="${produto.unidade}">
                    <label>Valor Unitário:</label>
                    <input type="number" class="valorUnitario" value="${produto.valorUnitario}" oninput="calcularValorTotal(this)">
                    <label>Valor Total:</label>
                    <input type="number" class="valorTotal" value="${produto.valorTotal}" readonly>
                    <label>Observação:</label>
                    <input type="text" class="observacao" value="${produto.observacao}">
                `;
                container.appendChild(produtoDiv);
            });
        } else {
            alert('Pedido não encontrado!');
        }
    }).catch(error => {
        alert('Erro ao carregar o pedido: ' + error.message);
    });
}

function salvarAlteracoes() {
    const dataHoje = document.getElementById('dataHoje').value;
    const numeroPedido = document.getElementById('numeroPedido').value;
    const dataPedido = document.getElementById('dataPedido').value;
    const dataAté = document.getElementById('dataAté').value;
    const razaoSocial = document.getElementById('razaoSocial').value;
    const cnpjFornecedor = document.getElementById('cnpjFornecedor').value;
    const grupoFornecedor = document.getElementById('grupoFornecedor').value;
    const contatoFornecedor = document.getElementById('contatoFornecedor').value;
    const emailFornecedor = document.getElementById('emailFornecedor').value;
    const telefoneFornecedor = document.getElementById('telefoneFornecedor').value;

    const produtos = [];
    document.querySelectorAll('.produto').forEach(produtoDiv => {
        const sku = produtoDiv.querySelector('.sku').value;
        const descricao = produtoDiv.querySelector('.descricao').value;
        const quantidade = produtoDiv.querySelector('.quantidade').value;
        const tipo = produtoDiv.querySelector('.tipo').value;
        const unidade = produtoDiv.querySelector('.unidade').value;
        const valorUnitario = produtoDiv.querySelector('.valorUnitario').value;
        const valorTotal = produtoDiv.querySelector('.valorTotal').value;
        const observacao = produtoDiv.querySelector('.observacao')?.value || '';

        produtos.push({ sku, descricao, quantidade, tipo, unidade, valorUnitario, valorTotal, observacao });
    });

    const pedidoAtualizado = {
        dataHoje,
        numeroPedido,
        dataPedido,
        dataAté,
        razaoSocial,
        cnpjFornecedor,
        grupoFornecedor,
        contatoFornecedor,
        emailFornecedor,
        telefoneFornecedor,
        produtos,
        status: 'Pendente'
    };

    // Localizar o pedido pelo número
    db.once('value').then(snapshot => {
        const pedidos = snapshot.val();
        const keyPedido = Object.keys(pedidos || {}).find(key => pedidos[key].numeroPedido === numeroPedido);

        if (keyPedido) {
            db.child(keyPedido).update(pedidoAtualizado).then(() => {
                alert('Alterações salvas com sucesso!');
                atualizarTabelaPedidos();
                limparFormulario();
            }).catch(error => {
                alert('Erro ao salvar alterações: ' + error);
            });
        } else {
            alert('Pedido não encontrado para atualizar.');
        }
    });
}

function alterarStatusPedido(key, status) {
    db.child(key).update({ status }).then(() => {
        if (status === 'Aprovado') {
            db.child(key).get().then(snapshot => {
                if (snapshot.exists()) {
                    const pedido = snapshot.val();
                    salvarNoEstoque(pedido);
                }
            }).catch(error => {
                alert('Erro ao carregar o pedido para salvar no estoque: ' + error.message);
            });
        }
        atualizarTabelaPedidos();
    }).catch(error => {
        alert('Erro ao alterar o status do pedido: ' + error.message);
    });
}

function excluirPedido(key) {
    db.child(key).remove().then(() => {
        atualizarTabelaPedidos();
    }).catch(error => {
        alert('Erro ao excluir o pedido: ' + error.message);
    });
}

function exportarPedido(key, formato) {
    db.child(key).get().then(snapshot => {
        if (snapshot.exists()) {
            const pedido = snapshot.val();
            abrirModalExportar(pedido);
        } else {
            alert('Pedido não encontrado!');
        }
    }).catch(error => {
        alert('Erro ao carregar o pedido: ' + error.message);
    });
}

function salvarNoEstoque(pedido) {
    pedido.produtos.forEach(produto => {
        const estoqueItem = {
            SKU: produto.sku || 'Indefinido',
            Descrição: produto.descricao || 'Indefinido',
            Marca: produto.marca || 'Indefinido',  // Adicione um valor padrão
            Tipo: produto.tipo || 'Indefinido',
            Unidade: produto.unidade || 'Indefinido',
            Grupo: produto.grupo || 'Indefinido',  // Adicione um valor padrão
            Quantidade: produto.quantidade || 0,
            Peso: produto.peso || 0,  // Adicione um valor padrão
            "Unitário(Kg)": produto.unitarioKg || 0,  // Adicione um valor padrão
            "Peso Total(Kg)": produto.pesoTotalKg || 0,  // Adicione um valor padrão
            Fornecedor: pedido.razaoSocial || 'Indefinido',
            "Data de Cadastro": pedido.dataHoje || 'Indefinido',
            "Data de Vencimento": produto.dataVencimento || 'Indefinido',  // Adicione um valor padrão
            "Dias de Consumo": produto.diasConsumo || 0,  // Adicione um valor padrão
            "Valor Unitário": produto.valorUnitario || 0,
            "Valor Total": produto.valorTotal || 0
        };
        estoqueDb.push(estoqueItem).catch(error => {
            alert('Erro ao salvar no estoque: ' + error.message);
        });
    });
}

function abrirModalExportar(pedido) {
    document.getElementById('modalDataHoje').innerText = pedido.dataHoje || 'Não informado';
    document.getElementById('modalNumeroPedido').innerText = pedido.numeroPedido || '';
    document.getElementById('modalDataInicial').innerText = pedido.dataPedido || '';
    document.getElementById('modalDataFinal').innerText = pedido.dataAté || '';
    document.getElementById('modalRazaoSocial').innerText = pedido.razaoSocial || '';
    document.getElementById('modalCNPJ').innerText = pedido.cnpjFornecedor || '';
    document.getElementById('modalContato').innerText = pedido.contatoFornecedor || '';
    document.getElementById('modalEmail').innerText = pedido.emailFornecedor || '';
    document.getElementById('modalTelefone').innerText = pedido.telefoneFornecedor || '';

    const tbody = document.getElementById('modalProdutosTable').querySelector('tbody');
    tbody.innerHTML = '';
    pedido.produtos.forEach(produto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${produto.sku}</td>
            <td>${produto.descricao}</td>
            <td>${produto.quantidade}</td>
            <td>${produto.valorUnitario}</td>
            <td>${produto.valorTotal}</td>
            <td>${produto.tipo}</td>
            <td>${produto.unidade}</td>
            <td>${produto.observacao}</td>
        `;
        tbody.appendChild(tr);
    });

    const modal = document.getElementById('exportarModal');
    modal.style.display = 'block';
}

function fecharModalExportar() {
    const modal = document.getElementById('exportarModal');
    modal.style.display = 'none';
}

function exportarParaExcel() {
    const dataHoje = document.getElementById('modalDataHoje').innerText;
    const numeroPedido = document.getElementById('modalNumeroPedido').innerText;
    const dataInicial = document.getElementById('modalDataInicial').innerText;
    const dataFinal = document.getElementById('modalDataFinal').innerText;
    const razaoSocial = document.getElementById('modalRazaoSocial').innerText;
    const cnpj = document.getElementById('modalCNPJ').innerText;
    const contato = document.getElementById('modalContato').innerText;
    const email = document.getElementById('modalEmail').innerText;
    const telefone = document.getElementById('modalTelefone').innerText;

    const produtos = [];
    document.querySelectorAll('#modalProdutosTable tbody tr').forEach(tr => {
        function formatarMoeda(valor) {
            return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
        }
        
        produtos.push({
            SKU: tr.cells[0].innerText,
            Descrição: tr.cells[1].innerText,
            Quantidade: tr.cells[2].innerText,
            'Valor Unitário': formatarMoeda(parseFloat(tr.cells[3].innerText)),
            'Valor Total': formatarMoeda(parseFloat(tr.cells[4].innerText)),
            Tipo: tr.cells[5].innerText,
            Unidade: tr.cells[6].innerText,
            Observação: tr.cells[7].innerText,
        });
    });

    const wsData = [
        ['Data do Pedido', dataHoje],
        ['Número do Pedido', numeroPedido],
        ['Data Inicial', dataInicial],
        ['Data Final', dataFinal],
        ['Razão Social', razaoSocial],
        ['CNPJ', cnpj],
        ['Contato', contato],
        ['Email', email],
        ['Telefone', telefone],
        [],
        ['SKU', 'Descrição', 'Quantidade', 'Valor Unitário', 'Valor Total', 'Tipo', 'Unidade', 'Observação']
    ];
    produtos.forEach(produto => {
        wsData.push(Object.values(produto));
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'Pedido');
    XLSX.writeFile(wb, `Pedido_${numeroPedido}.xlsx`);
}

document.getElementById('limparFiltrosBtn').addEventListener('click', () => {
    document.getElementById('dataInicial').value = '';
    document.getElementById('dataFinal').value = '';
    document.getElementById('filtroFornecedor').value = '';
    document.getElementById('filtroStatus').value = '';
    document.getElementById('filtroPedido').value = '';
    atualizarTabelaPedidos();
});

document.getElementById('aplicarFiltrosBtn').addEventListener('click', () => {
    const dataInicial = document.getElementById('dataInicial').value;
    const dataFinal = document.getElementById('dataFinal').value;
    const fornecedor = document.getElementById('filtroFornecedor').value.toLowerCase();
    const status = document.getElementById('filtroStatus').value;
    const numeroPedido = document.getElementById('filtroPedido').value.toLowerCase();

    db.once('value').then(snapshot => {
        const pedidos = snapshot.val();
        const tbody = document.getElementById('pedidosTable').querySelector('tbody');
        tbody.innerHTML = '';

        Object.entries(pedidos || {}).forEach(([key, pedido]) => {
            const dataHoje = pedido.dataHoje || '';
            const razaoSocial = pedido.razaoSocial || '';
            const pedidoStatus = pedido.status || '';
            const numeroPedidoAtual = pedido.numeroPedido || '';

            if (
                (!dataInicial || dataHoje >= dataInicial) &&
                (!dataFinal || dataHoje <= dataFinal) &&
                (!fornecedor || razaoSocial.toLowerCase().includes(fornecedor)) &&
                (!status || pedidoStatus === status) &&
                (!numeroPedido || numeroPedidoAtual.toLowerCase().includes(numeroPedido))
            ) {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${dataHoje}</td>
                    <td>${numeroPedidoAtual}</td>
                    <td>${pedido.dataPedido}</td>
                    <td>${pedido.dataAté}</td>
                    <td>${razaoSocial}</td>
                    <td class="${pedidoStatus.toLowerCase()}">${pedidoStatus}</td>
                    <td>
                        <button onclick="editarPedido('${key}')">Editar</button>
                        <button onclick="alterarStatusPedido('${key}', 'Aprovado')">Aprovar</button>
                        <button onclick="alterarStatusPedido('${key}', 'Cancelado')">Cancelar</button>
                        <button onclick="excluirPedido('${key}')">Excluir</button>
                        <button onclick="exportarPedido('${key}', 'excel')">Visualizar Pedido</button>
                    </td>
                `;
                tbody.appendChild(tr);
            }
        });
    });
});







