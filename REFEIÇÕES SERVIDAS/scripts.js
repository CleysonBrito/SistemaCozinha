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

document.getElementById('cafeFuncionariosQtd').addEventListener('input', calcularTotal);
document.getElementById('cafeJovensQtd').addEventListener('input', calcularTotal);
document.getElementById('almocoFuncionariosQtd').addEventListener('input', calcularTotal);
document.getElementById('almocoJovensQtd').addEventListener('input', calcularTotal);
document.getElementById('lancheFuncionariosQtd').addEventListener('input', calcularTotal);
document.getElementById('lancheJovensQtd').addEventListener('input', calcularTotal);
document.getElementById('outrasFuncionariosQtd').addEventListener('input', calcularTotal);
document.getElementById('outrasJovensQtd').addEventListener('input', calcularTotal);

function calcularTotal() {
    const cafeTotalQtd = document.getElementById('cafeTotalQtd').value || 0;
    const cafeFuncionariosQtd = document.getElementById('cafeFuncionariosQtd').value || 0;
    document.getElementById('cafeJovensQtd').value = cafeTotalQtd - cafeFuncionariosQtd;

    const almocoTotalQtd = document.getElementById('almocoTotalQtd').value || 0;
    const almocoFuncionariosQtd = document.getElementById('almocoFuncionariosQtd').value || 0;
    document.getElementById('almocoJovensQtd').value = almocoTotalQtd - almocoFuncionariosQtd;

    const lancheTotalQtd = document.getElementById('lancheTotalQtd').value || 0;
    const lancheFuncionariosQtd = document.getElementById('lancheFuncionariosQtd').value || 0;
    document.getElementById('lancheJovensQtd').value = lancheTotalQtd - lancheFuncionariosQtd;

    const outrasTotalQtd = document.getElementById('outrasTotalQtd').value || 0;
    const outrasFuncionariosQtd = document.getElementById('outrasFuncionariosQtd').value || 0;
    document.getElementById('outrasJovensQtd').value = outrasTotalQtd - outrasFuncionariosQtd;



}


function salvarRefeicao() {
    const dataRefeicao = document.getElementById('dataRefeicao').value;

    const cafeDescricao = document.getElementById('cafeDescricao').value;
    const cafeFuncionariosQtd = Number(document.getElementById('cafeFuncionariosQtd').value) || 0;
    const cafeJovensQtd = Number(document.getElementById('cafeJovensQtd').value) || 0;
    const cafeTotalQtd = Number(document.getElementById('cafeTotalQtd').value) || 0;

    const almocoDescricao = document.getElementById('almocoDescricao').value;
    const almocoFuncionariosQtd = Number(document.getElementById('almocoFuncionariosQtd').value) || 0;
    const almocoJovensQtd = Number(document.getElementById('almocoJovensQtd').value) || 0;
    const almocoTotalQtd = Number(document.getElementById('almocoTotalQtd').value) || 0;

    const lancheDescricao = document.getElementById('lancheDescricao').value;
    const lancheFuncionariosQtd = Number(document.getElementById('lancheFuncionariosQtd').value) || 0;
    const lancheJovensQtd = Number(document.getElementById('lancheJovensQtd').value) || 0;
    const lancheTotalQtd = Number(document.getElementById('lancheTotalQtd').value) || 0;

    const outrasDescricao = document.getElementById('outrasDescricao').value;
    const outrasFuncionariosQtd = Number(document.getElementById('outrasFuncionariosQtd').value) || 0;
    const outrasJovensQtd = Number(document.getElementById('outrasJovensQtd').value) || 0;
    const outrasTotalQtd = Number(document.getElementById('outrasTotalQtd').value) || 0;

    const sobrasDescricao = document.getElementById('sobrasDescricao').value;

    const observacaoDescricao = document.getElementById('observacaoDescricao').value;

    const desperdicioQtd = Number(document.getElementById('desperdicioQtd').value) || 0;

    const refeicaoData = {
        dataRefeicao,
        cafe: {
            descricao: cafeDescricao,
            funcionarios: cafeFuncionariosQtd,
            jovens: cafeJovensQtd,
            total: cafeTotalQtd
        },
        almoco: {
            descricao: almocoDescricao,
            funcionarios: almocoFuncionariosQtd,
            jovens: almocoJovensQtd,
            total: almocoTotalQtd
        },
        lanche: {
            descricao: lancheDescricao,
            funcionarios: lancheFuncionariosQtd,
            jovens: lancheJovensQtd,
            total: lancheTotalQtd
        },

        outrasRefeicoes: {
            descricao: outrasDescricao,
            funcionarios: outrasFuncionariosQtd,
            jovens: outrasJovensQtd,
            total: outrasTotalQtd,
            sobras: sobrasDescricao,
            observacao: observacaoDescricao
        },

        desperdicioQtd: desperdicioQtd
    };

    const newRefeicaoKey = database.ref().child('refeicoesServidas').push().key;
    const updates = {};
    updates['/refeicoesServidas/' + newRefeicaoKey] = refeicaoData;

    database.ref().update(updates).then(() => {
        alert('Refeição salva com sucesso!');
        limparFormulario();
        carregarRefeicoes();
    }).catch((error) => {
        console.error('Erro ao salvar refeição:', error);
    });
}


function limparFormulario() {
    document.getElementById('cafeDescricao').value = '';
    document.getElementById('cafeFuncionariosQtd').value = '';
    document.getElementById('cafeJovensQtd').value = '';
    document.getElementById('cafeTotalQtd').value = '';

    document.getElementById('almocoDescricao').value = '';
    document.getElementById('almocoFuncionariosQtd').value = '';
    document.getElementById('almocoJovensQtd').value = '';
    document.getElementById('almocoTotalQtd').value = '';

    document.getElementById('lancheDescricao').value = '';
    document.getElementById('lancheFuncionariosQtd').value = '';
    document.getElementById('lancheJovensQtd').value = '';
    document.getElementById('lancheTotalQtd').value = '';

    document.getElementById('outrasDescricao').value = '';
    document.getElementById('outrasFuncionariosQtd').value = '';
    document.getElementById('outrasJovensQtd').value = '';
    document.getElementById('outrasTotalQtd').value = '';
    document.getElementById('sobrasDescricao').value = '';

    document.getElementById('observacaoDescricao').value = '';

    document.getElementById('desperdicioQtd').value = '';

    document.getElementById('dataRefeicao').value = '';
}

function carregarRefeicoes() {
    const tbody = document.getElementById('refeicoesTabela');
    tbody.innerHTML = '';
    const refeicoesDb = firebase.database().ref('refeicoesServidas');
    refeicoesDb.once('value').then(snapshot => {
        const refeicoes = [];
        snapshot.forEach(childSnapshot => {
            const refeicao = childSnapshot.val();
            refeicoes.push({ key: childSnapshot.key, ...refeicao });
        });

        // Ordenar as refeições por data em ordem decrescente
        refeicoes.sort((a, b) => new Date(b.dataRefeicao) - new Date(a.dataRefeicao));

        refeicoes.forEach(refeicao => {
            const dataRefeicao = new Date(refeicao.dataRefeicao);
            // Ajustar a data para o fuso horário local
            const dataFormatada = `${dataRefeicao.getUTCDate().toString().padStart(2, '0')}/${(dataRefeicao.getUTCMonth() + 1).toString().padStart(2, '0')}/${dataRefeicao.getUTCFullYear()}`;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td ondblclick="editarRefeicao(this, '${refeicao.key}', 'dataRefeicao')">${dataFormatada || ''}</td>
                <td ondblclick="editarRefeicao(this, '${refeicao.key}', 'cafe.descricao')">${refeicao.cafe?.descricao || ''}</td>
                <td ondblclick="editarRefeicao(this, '${refeicao.key}', 'cafe.funcionarios')">${refeicao.cafe?.funcionarios || ''}</td>
                <td ondblclick="editarRefeicao(this, '${refeicao.key}', 'cafe.jovens')">${refeicao.cafe?.jovens || ''}</td>
                <td ondblclick="editarRefeicao(this, '${refeicao.key}', 'almoco.descricao')">${refeicao.almoco?.descricao || ''}</td>
                <td ondblclick="editarRefeicao(this, '${refeicao.key}', 'almoco.funcionarios')">${refeicao.almoco?.funcionarios || ''}</td>
                <td ondblclick="editarRefeicao(this, '${refeicao.key}', 'almoco.jovens')">${refeicao.almoco?.jovens || ''}</td>
                <td ondblclick="editarRefeicao(this, '${refeicao.key}', 'lanche.descricao')">${refeicao.lanche?.descricao || ''}</td>
                <td ondblclick="editarRefeicao(this, '${refeicao.key}', 'lanche.funcionarios')">${refeicao.lanche?.funcionarios || ''}</td>
                <td ondblclick="editarRefeicao(this, '${refeicao.key}', 'lanche.jovens')">${refeicao.lanche?.jovens || ''}</td>
                <td ondblclick="editarRefeicao(this, '${refeicao.key}', 'outrasRefeicoes.descricao')">${refeicao.outrasRefeicoes?.descricao || ''}</td>
                <td ondblclick="editarRefeicao(this, '${refeicao.key}', 'outrasRefeicoes.funcionarios')">${refeicao.outrasRefeicoes?.funcionarios || ''}</td>
                <td ondblclick="editarRefeicao(this, '${refeicao.key}', 'outrasRefeicoes.jovens')">${refeicao.outrasRefeicoes?.jovens || ''}</td>
                <td ondblclick="editarRefeicao(this, '${refeicao.key}', 'outrasRefeicoes.sobras')">${refeicao.outrasRefeicoes?.sobras || ''}</td>
                <td ondblclick="editarRefeicao(this, '${refeicao.key}', 'outrasRefeicoes.observacao')">${refeicao.outrasRefeicoes?.observacao || ''}</td>
                <td ondblclick="editarRefeicao(this, '${refeicao.key}', 'desperdicioQtd')">${refeicao.desperdicioQtd || ''}</td>
                <td><button onclick="excluirRefeicao('${refeicao.key}')">Excluir</button></td>
                <td><button onclick="exportarParaExcel(this)">Exportar</button></td>
            `;
            tbody.appendChild(tr);
        });
    }).catch(error => {
        console.error('Erro ao carregar refeições:', error);
    });
}

function filtrarPorPeriodo() {
    const dataInicio = new Date(document.getElementById('dataInicio').value);
    const dataFim = new Date(document.getElementById('dataFim').value);
    const tbody = document.getElementById('refeicoesTabela');
    tbody.innerHTML = '';

    if (isNaN(dataInicio) || isNaN(dataFim)) {
        alert('Por favor, selecione um período válido.');
        return;
    }

    // Ajustar a dataInicio e dataFim para incluir o dia completo
    dataInicio.setHours(0, 0, 0, 0);
    dataFim.setHours(23, 59, 59, 999);

    const refeicoesDb = firebase.database().ref('refeicoesServidas');
    refeicoesDb.once('value').then(snapshot => {
        const refeicoes = [];
        snapshot.forEach(childSnapshot => {
            const refeicao = childSnapshot.val();
            const dataRefeicao = new Date(refeicao.dataRefeicao);

            if (dataRefeicao >= dataInicio && dataRefeicao <= dataFim) {
                refeicoes.push({ key: childSnapshot.key, ...refeicao });
            }
        });

        // Ordenar as refeições por data em ordem decrescente
        refeicoes.sort((a, b) => new Date(b.dataRefeicao) - new Date(a.dataRefeicao));

        refeicoes.forEach(refeicao => {
            const dataRefeicao = new Date(refeicao.dataRefeicao);
            const dataFormatada = `${dataRefeicao.getUTCDate().toString().padStart(2, '0')}/${(dataRefeicao.getUTCMonth() + 1).toString().padStart(2, '0')}/${dataRefeicao.getUTCFullYear()}`;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td ondblclick="editarRefeicao(this, '${refeicao.key}', 'dataRefeicao')">${dataFormatada || ''}</td>
                <td ondblclick="editarRefeicao(this, '${refeicao.key}', 'cafe.descricao')">${refeicao.cafe?.descricao || ''}</td>
                <td ondblclick="editarRefeicao(this, '${refeicao.key}', 'cafe.funcionarios')">${refeicao.cafe?.funcionarios || ''}</td>
                <td ondblclick="editarRefeicao(this, '${refeicao.key}', 'cafe.jovens')">${refeicao.cafe?.jovens || ''}</td>
                <td ondblclick="editarRefeicao(this, '${refeicao.key}', 'almoco.descricao')">${refeicao.almoco?.descricao || ''}</td>
                <td ondblclick="editarRefeicao(this, '${refeicao.key}', 'almoco.funcionarios')">${refeicao.almoco?.funcionarios || ''}</td>
                <td ondblclick="editarRefeicao(this, '${refeicao.key}', 'almoco.jovens')">${refeicao.almoco?.jovens || ''}</td>
                <td ondblclick="editarRefeicao(this, '${refeicao.key}', 'lanche.descricao')">${refeicao.lanche?.descricao || ''}</td>
                <td ondblclick="editarRefeicao(this, '${refeicao.key}', 'lanche.funcionarios')">${refeicao.lanche?.funcionarios || ''}</td>
                <td ondblclick="editarRefeicao(this, '${refeicao.key}', 'lanche.jovens')">${refeicao.lanche?.jovens || ''}</td>
                <td ondblclick="editarRefeicao(this, '${refeicao.key}', 'outrasRefeicoes.descricao')">${refeicao.outrasRefeicoes?.descricao || ''}</td>
                <td ondblclick="editarRefeicao(this, '${refeicao.key}', 'outrasRefeicoes.funcionarios')">${refeicao.outrasRefeicoes?.funcionarios || ''}</td>
                <td ondblclick="editarRefeicao(this, '${refeicao.key}', 'outrasRefeicoes.jovens')">${refeicao.outrasRefeicoes?.jovens || ''}</td>
                <td ondblclick="editarRefeicao(this, '${refeicao.key}', 'outrasRefeicoes.sobras')">${refeicao.outrasRefeicoes?.sobras || ''}</td>
                <td ondblclick="editarRefeicao(this, '${refeicao.key}', 'outrasRefeicoes.observacao')">${refeicao.outrasRefeicoes?.observacao || ''}</td>
                <td ondblclick="editarRefeicao(this, '${refeicao.key}', 'desperdicioQtd')">${refeicao.desperdicioQtd || ''}</td>
                <td><button onclick="excluirRefeicao('${refeicao.key}')">Excluir</button></td>
                <td><button onclick="exportarParaExcel(this)">Exportar</button></td>
            `;
            tbody.appendChild(tr);
        });
    }).catch(error => {
        console.error('Erro ao carregar refeições:', error);
    });
}

function exportarPorPeriodo() {
    const dataInicio = new Date(document.getElementById('dataInicio').value);
    const dataFim = new Date(document.getElementById('dataFim').value);
    const tbody = document.getElementById('refeicoesTabela');
    const dados = [["Data", "Café da Manhã (Descrição)", "Café da Manhã (Funcionários)", "Café da Manhã (Jovens)", "Almoço (Descrição)", "Almoço (Funcionários)", "Almoço (Jovens)", "Lanche da Tarde (Descrição)", "Lanche da Tarde (Funcionários)", "Lanche da Tarde (Jovens)", "Outras Refeições", "Outras Refeições (Funcionários)", "Outras Refeições (Jovens)", "Sobras", "Observação", "Desperdício"]];

    for (let i = 0; i < tbody.rows.length; i++) {
        const row = tbody.rows[i];
        const dataRefeicao = new Date(row.cells[0].innerText.split('/').reverse().join('-'));
        if (dataRefeicao >= dataInicio && dataRefeicao <= dataFim) {
            const linhaDados = [];
            for (let j = 0; j < row.cells.length - 2; j++) {
                linhaDados.push(row.cells[j].innerText);
            }
            dados.push(linhaDados);
        }
    }

    const worksheet = XLSX.utils.aoa_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Refeições");
    XLSX.writeFile(workbook, "refeicoes_periodo.xlsx");
}

function limparFiltro() {
    document.getElementById('dataInicio').value = '';
    document.getElementById('dataFim').value = '';
    carregarRefeicoes();
}


// Carregar as refeições ao carregar a página
document.addEventListener('DOMContentLoaded', carregarRefeicoes);

function editarRefeicao(td, chave, campo) {
    const valorAtual = td.innerText;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = valorAtual;

    input.onblur = function() {
        const novoValor = input.value;
        td.innerText = novoValor;
        atualizarRefeicao(chave, campo, novoValor);
    };

    td.innerText = '';
    td.appendChild(input);
    input.focus();
}


function atualizarRefeicao(chave, campo, valor) {
    const caminho = campo.split('.'); // Divide o campo pelo ponto
    let updates = {};

    // Verifica se o valor é numérico e converte para inteiro, se aplicável
    if (!isNaN(valor) && valor !== '') {
        valor = parseInt(valor, 10); // Converte para número inteiro
    }

    if (caminho.length === 1) {
        // Campo direto (sem hierarquia)
        updates[`/refeicoesServidas/${chave}/${campo}`] = valor;
    } else {
        // Campo hierárquico
        let basePath = `/refeicoesServidas/${chave}`;
        for (let i = 0; i < caminho.length - 1; i++) {
            basePath += `/${caminho[i]}`;
        }
        updates[`${basePath}/${caminho[caminho.length - 1]}`] = valor;
    }

    database.ref().update(updates).then(() => {
        alert('Refeição atualizada com sucesso!');
    }).catch((error) => {
        console.error('Erro ao atualizar refeição:', error);
    });
}




function excluirRefeicao(key) {
    if (confirm('Tem certeza que deseja excluir esta refeição?')) {
        database.ref('refeicoesServidas/' + key).remove().then(() => {
            alert('Refeição excluída com sucesso!');
            carregarRefeicoes();
        }).catch((error) => {
            console.error('Erro ao excluir refeição:', error);
        });
    }
}

function exportarParaExcel(button) {
    const tr = button.parentElement.parentElement;
    const tds = tr.querySelectorAll('td');
    const dados = [["Data", "Café da Manhã (Descrição)", "Café da Manhã (Funcionários)", "Café da Manhã (Jovens)", "Almoço (Descrição)", "Almoço (Funcionários)", "Almoço (Jovens)", "Lanche da Tarde (Descrição)", "Lanche da Tarde (Funcionários)", "Lanche da Tarde (Jovens)", "Outras Refeições", "Outras Refeições (Funcionários)", "Outras Refeições (Jovens)", "Sobras", "Observação", "Desperdício"]];

    const linhaDados = [];
    tds.forEach((td, index) => {
        if (index < tds.length - 2) { // Exclui as colunas de botões
            linhaDados.push(td.innerText);
        }
    });
    dados.push(linhaDados);

    const worksheet = XLSX.utils.aoa_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Refeição");
    XLSX.writeFile(workbook, "refeicao.xlsx");
}

document.getElementById('resumoRefeicoesBtn').addEventListener('click', function() {
    window.location.href = 'resumoRefeicoes.html';
});
