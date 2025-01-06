document.addEventListener('DOMContentLoaded', function() {
    // Função para fechar a modal
    function closeModal() {
        document.getElementById('productModal').style.display = "none";
    }

    // Função para abrir a modal
    function openModal() {
        document.getElementById('productModal').style.display = "block";
        carregarProdutos('');
    }
    

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

    // Referência ao banco de dados
    const cadastroProdutosDb = firebase.database().ref('cadastroProdutos');
    const estoqueDb = firebase.database().ref('estoque');
    // Função para calcular o valor total
    function calcularValorTotal() {
        const quantidade = parseFloat(document.getElementById('quantidade').value);
        const valorUnitario = parseFloat(document.getElementById('valor_unitario').value.replace(',', '.'));
        
        if (!isNaN(quantidade) && !isNaN(valorUnitario)) {
            const valorTotal = quantidade * valorUnitario;
            document.getElementById('valor_total').value = 'R$ ' + valorTotal.toFixed(2).replace('.', ',');

            // Salvar o valor unitário e o valor total no banco de dados como números inteiros (centavos)
            const valorUnitarioCentavos = Math.round(valorUnitario * 100);
            const valorTotalCentavos = Math.round(valorTotal * 100);
            salvarNoBanco(valorUnitarioCentavos, valorTotalCentavos);
        } else {
            console.error('Valores inválidos: quantidade ou valor unitário não são números.');
        }
    }

    // Função para calcular o peso total
    function calcularPesoTotal() {
        const quantidade = parseFloat(document.getElementById('quantidade').value);
        const peso = parseFloat(document.getElementById('peso').value.replace(',', '.'));
        
        if (!isNaN(quantidade) && !isNaN(peso)) {
            const pesoTotal = quantidade * peso;
            document.getElementById('peso_total').value = pesoTotal.toFixed(3).replace('.', ',');

            // Salvar o peso total no banco de dados
            salvarPesoNoBanco(pesoTotal);
        } else {
            console.error('Valores inválidos: quantidade ou peso não são números.');
        }
    }

    function salvarNoBanco(valorUnitario, valorTotal) {
        // Função fictícia para simular o salvamento no banco de dados
        if (!isNaN(valorUnitario) && !isNaN(valorTotal)) {
            console.log('Valor unitário salvo no banco de dados:', valorUnitario);
            console.log('Valor total salvo no banco de dados:', valorTotal);
        } else {
            console.error('Erro ao salvar no banco de dados: valores inválidos.');
        }
    }

    function salvarPesoNoBanco(pesoTotal) {
        // Função fictícia para simular o salvamento no banco de dados
        if (!isNaN(pesoTotal)) {
            console.log('Peso total salvo no banco de dados:', pesoTotal);
        } else {
            console.error('Erro ao salvar no banco de dados: valores inválidos.');
        }
    }

    document.getElementById('quantidade').addEventListener('input', calcularValorTotal);
    document.getElementById('valor_unitario').addEventListener('input', calcularValorTotal);
    document.getElementById('quantidade').addEventListener('input', calcularPesoTotal);
    document.getElementById('peso').addEventListener('input', calcularPesoTotal);
    document.getElementById('peso_total').addEventListener('blur', function(event) {
        if (event.target.value !== '') {
            event.target.value = formatarPeso(event.target.value);
        }
    });

    // Função para formatar peso com 3 casas decimais
    function formatarPeso(value) {
        const num = parseFloat(value.replace(',', '.'));
        if (!isNaN(num)) {
            return num.toFixed(3).replace('.', ',');
        }
        return '';
    }
    // Função para carregar produtos com filtro
    function carregarProdutos(filtro) {
        cadastroProdutosDb.once('value').then(snapshot => {
            const tableBody = document.getElementById('productTable').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = ''; // Limpa a tabela

            // Coletar todos os produtos em um array
            const produtos = [];
            snapshot.forEach(childSnapshot => {
                const data = childSnapshot.val();
                if (filtroValido(data, filtro)) {
                    produtos.push(data);
                }
            });

            // Ordenar os produtos por descrição
            produtos.sort((a, b) => a.descricao.localeCompare(b.descricao));

            // Inserir os produtos ordenados na tabela
            produtos.forEach(data => {
                const row = tableBody.insertRow();
                row.insertCell(0).innerText = data.sku;
                row.insertCell(1).innerText = data.descricao;
                row.insertCell(2).innerText = data.marca;
                row.insertCell(3).innerText = data.tipo;
                row.insertCell(4).innerText = data.unidade;
                row.insertCell(5).innerText = data.grupo;
                row.insertCell(6).innerText = data.fornecedor;

                // Botão para selecionar o produto
                const selectButton = document.createElement('button');
                selectButton.innerText = 'Selecionar';
                selectButton.onclick = function() {
                    document.getElementById('sku').value = data.sku;
                    document.getElementById('descricao').value = data.descricao;
                    document.getElementById('marca').value = data.marca;
                    document.getElementById('tipo').value = data.tipo;
                    document.getElementById('unidade').value = data.unidade;
                    document.getElementById('grupo').value = data.grupo;
                    document.getElementById('fornecedor').value = data.fornecedor;
                    closeModal();
                };
                row.insertCell(7).appendChild(selectButton);
            });
        });
    }

    // Função para validar filtros
    function filtroValido(data, filtro) {
        const {sku, descricao, marca, tipo, grupo} = filtro;
        return (!sku || data.sku.toLowerCase().includes(sku.toLowerCase())) &&
               (!descricao || data.descricao.toLowerCase().includes(descricao.toLowerCase())) &&
               (!marca || data.marca.toLowerCase().includes(marca.toLowerCase())) &&
               (!tipo || data.tipo.toLowerCase().includes(tipo.toLowerCase())) &&
               (!grupo || data.grupo.toLowerCase().includes(grupo.toLowerCase()));
    }

    // Fechar a modal ao clicar no "x"
    document.querySelector('.close').addEventListener('click', closeModal);

    // Fechar a modal ao clicar fora do conteúdo
    window.addEventListener('click', function(event) {
        if (event.target === document.getElementById('productModal')) {
            closeModal();
        }
    });

    // Abertura da modal ao clicar nos campos SKU e Descrição
    document.getElementById('sku').addEventListener('click', openModal);
    document.getElementById('descricao').addEventListener('click', openModal);

    // Filtragem ao digitar nos campos de filtro
    document.getElementById('filter-sku').addEventListener('input', function() {
        carregarProdutos({
            sku: this.value,
            descricao: document.getElementById('filter-descricao').value,
            tipo: document.getElementById('filter-tipo').value,
            grupo: document.getElementById('filter-grupo').value
        });
    });

    document.getElementById('filter-descricao').addEventListener('input', function() {
        carregarProdutos({
            sku: document.getElementById('filter-sku').value,
            descricao: this.value,
            tipo: document.getElementById('filter-tipo').value,
            grupo: document.getElementById('filter-grupo').value
        });
    });

    document.getElementById('filter-tipo').addEventListener('input', function() {
        carregarProdutos({
            sku: document.getElementById('filter-sku').value,
            descricao: document.getElementById('filter-descricao').value,
            tipo: this.value,
            grupo: document.getElementById('filter-grupo').value
        });
    });

    document.getElementById('filter-grupo').addEventListener('input', function() {
        carregarProdutos({
            sku: document.getElementById('filter-sku').value,
            descricao: document.getElementById('filter-descricao').value,
            tipo: document.getElementById('filter-tipo').value,
            grupo: this.value
        });
    });
    // Função para salvar dados
    document.getElementById('product-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const quantidade = parseFloat(document.getElementById('quantidade').value);
        const valorUnitario = parseFloat(document.getElementById('valor_unitario').value.replace('R$ ', '').replace(',', '.'));
        const valorTotal = parseFloat(document.getElementById('valor_total').value.replace('R$ ', '').replace(',', '.'));
        const peso = parseFloat(document.getElementById('peso').value.replace(',', '.'));
        const pesoTotal = parseFloat(document.getElementById('peso_total').value.replace(',', '.'));

        if (!isNaN(quantidade) && !isNaN(valorUnitario) && !isNaN(valorTotal) && !isNaN(peso) && !isNaN(pesoTotal)) {
            const formData = {
                sku: document.getElementById('sku').value,
                descricao: document.getElementById('descricao').value,
                marca: document.getElementById('marca').value,
                tipo: document.getElementById('tipo').value,
                unidade: document.getElementById('unidade').value,
                grupo: document.getElementById('grupo').value,
                quantidade: quantidade,
                valor_unitario: Math.round(valorUnitario * 100), // Valor em centavos
                valor_total: Math.round(valorTotal * 100), // Valor em centavos
                peso: peso.toFixed(2), // Peso em kg
                peso_total: pesoTotal.toFixed(2), // Peso total em kg
                fornecedor: document.getElementById('fornecedor').value,
                data_cadastro: document.getElementById('data_cadastro').value,
                data_vencimento: document.getElementById('data_vencimento').value
            };

            estoqueDb.push(formData).then(() => {
                alert('Dados salvos com sucesso!');
                document.getElementById('product-form').reset();
            }).catch(error => console.error('Erro ao salvar:', error));
        } else {
            console.error('Erro ao salvar: valores inválidos.');
        }
    });

    // Adicionar evento ao formulário para adicionar produto
    document.getElementById('product-form').addEventListener('submit', function(event) {
        event.preventDefault();
        adicionarProduto();
    });

    // Função para adicionar produto
    function adicionarProduto() {
        const descricao = document.getElementById('descricao').value;
        const marca = document.getElementById('marca').value; // Novo campo
        const tipo = document.getElementById('tipo').value;
        const valorUnitario = document.getElementById('valorUnitario').value;
        const pesoUnitario = document.getElementById('pesoUnitario').value;

        // ...outros campos...
    
        const novoProduto = {
            descricao: descricao,
            marca: marca, // Novo campo
            tipo: tipo,
            valorUnitario: valorUnitario,
            pesoUnitario: pesoUnitario,
            // ...outros campos...
        };
    
        // Adicionar o novo produto ao banco de dados
        estoqueDb.push(novoProduto);
    }
    // Função para exibir os dados na tabela
    function exibirDados(dados) {
        const tabela = document.getElementById('tabelaEstoque');
        tabela.innerHTML = ''; // Limpa a tabela antes de adicionar novos dados
    
        dados.forEach(item => {
            const linha = tabela.insertRow();
            const celulaDescricao = linha.insertCell(0);
            const celulaMarca = linha.insertCell(1); // Nova célula para Marca
            const celulaTipo = linha.insertCell(2);
            const celulaValorUnitario = linha.insertCell(3);
            const celulaPesoUnitario = linha.insertCell(4);
            // Outras células...

            celulaDescricao.innerHTML = item.descricao;
            celulaMarca.innerHTML = item.marca; // Exibir a marca
            celulaTipo.innerHTML = item.tipo;
            celulaValorUnitario.innerHTML = formatarValor(item.valorUnitario);
            celulaPesoUnitario.innerHTML = formatarPeso(item.pesoUnitario);
            // Outras células...
        });
    }
    // Exemplo de como chamar a função exibirDados com dados do banco
    estoqueDb.on('value', snapshot => {
        const dados = [];
        snapshot.forEach(childSnapshot => {
            const item = childSnapshot.val();
            dados.push(item);
        });
        exibirDados(dados);
    });

    // Função para voltar
    function goBack() {
        window.location.href = './home.html';
    }
    
});
