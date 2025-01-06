// Inicialização do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC7eniB3_IFT8E-Tb1VkfktcWUsfLRRYXw",
    authDomain: "bancoreciclar.firebaseapp.com",
    databaseURL: "https://bancoreciclar-default-rtdb.firebaseio.com",
    projectId: "bancocozinha",
    storageBucket: "bancoreciclar.appspot.com",
    messagingSenderId: "418801320354",
    appId: "1:418801320354:web:3f854deb9e2dda520732fb",
    measurementId: "G-5J6XFE0H02"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let refeicoesFiltradas = [];

function formatarData(data) {
    const partes = data.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function carregarRefeicoes(filtroDataInicio = null, filtroDataFim = null) {
    console.log("Carregando refeições...");
    const tabelaRefeicoes = document.getElementById('tabela-refeicoes').getElementsByTagName('tbody')[0];
    tabelaRefeicoes.innerHTML = ''; // Limpar a tabela antes de carregar novos dados

    let totalRefeicoesServidas = 0;
    refeicoesFiltradas = [];

    database.ref('refeicoesServidas').once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const refeicoes = childSnapshot.val();
            const dataRefeicao = refeicoes.dataRefeicao || 'Data não disponível';
            const dataFormatada = dataRefeicao !== 'Data não disponível' ? formatarData(dataRefeicao) : dataRefeicao; // Formatar a data

            // Aplicar filtro de período, se fornecido
            if (filtroDataInicio && filtroDataFim) {
                const dataRefeicaoDate = new Date(dataRefeicao);
                const dataInicioDate = new Date(filtroDataInicio);
                const dataFimDate = new Date(filtroDataFim);

                if (dataRefeicaoDate < dataInicioDate || dataRefeicaoDate > dataFimDate) {
                    return;
                }
            }

            // Verificações para garantir que os dados existem
            const cafe = refeicoes.cafe || {};
            const almoco = refeicoes.almoco || {};
            const lanche = refeicoes.lanche || {};
            const outrasRefeicoes = refeicoes.outrasRefeicoes || {};

            const totalJovens = (cafe.jovens || 0) + (almoco.jovens || 0) + (lanche.jovens || 0) + (outrasRefeicoes.jovens || 0);
            const totalFuncionarios = (cafe.funcionarios || 0) + (almoco.funcionarios || 0) + (lanche.funcionarios || 0) + (outrasRefeicoes.funcionarios || 0);
            const totalRefeicoes = totalJovens + totalFuncionarios;

            const totalCafe = (cafe.jovens || 0) + (cafe.funcionarios || 0);
            const totalAlmoco = (almoco.jovens || 0) + (almoco.funcionarios || 0);
            const totalLanche = (lanche.jovens || 0) + (lanche.funcionarios || 0);
            const totalOutrasRefeicoes = (outrasRefeicoes.jovens || 0) + (outrasRefeicoes.funcionarios || 0);

            totalRefeicoesServidas += totalRefeicoes;

            // Adicionar dados filtrados à lista
            refeicoesFiltradas.push({
                dataRefeicao: dataRefeicao,
                dataFormatada,
                cafe: cafe.descricao || '',
                totalCafe,
                almoco: almoco.descricao || '',
                totalAlmoco,
                lanche: lanche.descricao || '',
                totalLanche,
                outrasRefeicoes: outrasRefeicoes.descricao || '',
                totalOutrasRefeicoes,
                totalJovens,
                totalFuncionarios,
                totalRefeicoes
            });
        });

        // Ordenar as refeições por data em ordem decrescente
        refeicoesFiltradas.sort((a, b) => new Date(b.dataRefeicao) - new Date(a.dataRefeicao));

        // Adicionar as refeições ordenadas à tabela
        refeicoesFiltradas.forEach((refeicao) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${refeicao.dataFormatada}</td>
                <td>${refeicao.cafe}</td>
                <td>${refeicao.totalCafe}</td>
                <td>${refeicao.almoco}</td>
                <td>${refeicao.totalAlmoco}</td>
                <td>${refeicao.lanche}</td>
                <td>${refeicao.totalLanche}</td>
                <td>${refeicao.outrasRefeicoes}</td>
                <td>${refeicao.totalOutrasRefeicoes}</td>
                <td>${refeicao.totalJovens}</td>
                <td>${refeicao.totalFuncionarios}</td>
                <td>${refeicao.totalRefeicoes}</td>
            `;
            tabelaRefeicoes.appendChild(row);
        });

        // Atualizar o total de refeições servidas
        document.getElementById('totalRefeicoesServidas').innerText = `Total de Refeições Servidas: ${totalRefeicoesServidas}`;
    });
}

function filtrarPorPeriodo() {
    const dataInicio = document.getElementById('dataInicio').value;
    const dataFim = document.getElementById('dataFim').value;
    if (dataInicio && dataFim) {
        alert(`Filtrando de ${formatarData(dataInicio)} até ${formatarData(dataFim)}`);
        carregarRefeicoes(dataInicio, dataFim);
    }
}

function limparFiltro() {
    document.getElementById('dataInicio').value = '';
    document.getElementById('dataFim').value = '';
    carregarRefeicoes();
}

function exportarParaExcel() {
    const ws = XLSX.utils.json_to_sheet(refeicoesFiltradas);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Refeições Servidas");
    XLSX.writeFile(wb, "RefeicoesServidas.xlsx");
}

function irParaHome() {
    window.location.href = './home.html';
}

function irParaCadastro() {
    window.location.href = './cadastroderefeicoes.html';
}

document.addEventListener('DOMContentLoaded', () => carregarRefeicoes());