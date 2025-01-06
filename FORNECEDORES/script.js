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
const db = firebase.database().ref('cadastrodefornecedores');

// Função para abrir o modal
function abrirModal(fornecedor, key) {
    document.getElementById('modal-key').value = key;
    document.getElementById('modal-cnpj').value = fornecedor.cnpj || '';
    document.getElementById('modal-razaoSocial').value = fornecedor.razaoSocial || '';
    document.getElementById('modal-endereco').value = fornecedor.endereco || '';
    document.getElementById('modal-numero').value = fornecedor.numero || '';
    document.getElementById('modal-bairro').value = fornecedor.bairro || '';
    document.getElementById('modal-cep').value = fornecedor.cep || '';
    document.getElementById('modal-municipio').value = fornecedor.municipio || '';
    document.getElementById('modal-uf').value = fornecedor.uf || '';
    document.getElementById('modal-pais').value = fornecedor.pais || '';

    
    
    document.getElementById('modal-complemento').value = fornecedor.complemento || '';


    document.getElementById('modal-contato').value = fornecedor.contato || '';

    document.getElementById('modal-telefone').value = fornecedor.telefone || '';
    document.getElementById('modal-grupo').value = fornecedor.grupo || '';
    document.getElementById('modal-email').value = fornecedor.email || '';

    document.getElementById('modal-editar').style.display = 'flex';
}

// Fechar o modal
function fecharModal() {
    document.getElementById('modal-editar').style.display = 'none';
}

// Salvar alterações
function salvarAlteracoes() {
    const key = document.getElementById('modal-key').value;
    const fornecedorAtualizado = {
        cnpj: document.getElementById('modal-cnpj').value,
        razaoSocial: document.getElementById('modal-razaoSocial').value,
        endereco: document.getElementById('modal-endereco').value,
        numero: document.getElementById('modal-numero').value,
        bairro: document.getElementById('modal-bairro').value,
        cep: document.getElementById('modal-cep').value,
        municipio: document.getElementById('modal-municipio').value,
        uf: document.getElementById('modal-uf').value,
        pais: document.getElementById('modal-pais').value,

        

        complemento: document.getElementById('modal-complemento').value,

        contato: document.getElementById('modal-contato').value,

        telefone: document.getElementById('modal-telefone').value,
        grupo: document.getElementById('modal-grupo').value,
        email: document.getElementById('modal-email').value,
    };

    db.child(key).update(fornecedorAtualizado, (error) => {
        if (error) {
            alert('Erro ao salvar alterações!');
        } else {
            alert('Alterações salvas com sucesso!');
            fecharModal();
            consultarDados();
        }
    });
}

// Adicionar evento ao botão de salvar
document.getElementById('salvar-alteracoes-btn').addEventListener('click', salvarAlteracoes);

// Função para consultar dados e exibir na tabela, filtrando por CNPJ e Razão Social
function consultarDados() {
    const cnpj = document.getElementById('cnpj').value.toLowerCase();
    const razaoSocial = document.getElementById('razaoSocial').value.toLowerCase();

    db.once('value', (snapshot) => {
        const tabela = document.getElementById('resultados');
        tabela.innerHTML = '';
        snapshot.forEach((childSnapshot) => {
            const fornecedor = childSnapshot.val();
            const key = childSnapshot.key;

            // Aplicar filtros de CNPJ e Razão Social
            if ((cnpj === '' || fornecedor.cnpj.toLowerCase().includes(cnpj)) &&
                (razaoSocial === '' || fornecedor.razaoSocial.toLowerCase().includes(razaoSocial))) {
                
                const row = tabela.insertRow();
                row.insertCell(0).innerText = fornecedor.cnpj;
                row.insertCell(1).innerText = fornecedor.razaoSocial;
                row.insertCell(2).innerText = fornecedor.endereco;
                row.insertCell(3).innerText = fornecedor.numero;
                row.insertCell(4).innerText = fornecedor.bairro;
                row.insertCell(5).innerText = fornecedor.cep;
                row.insertCell(6).innerText = fornecedor.municipio;
                row.insertCell(7).innerText = fornecedor.uf;
                row.insertCell(8).innerText = fornecedor.pais;

             

                row.insertCell(9).innerText = fornecedor.complemento;

                row.insertCell(10).innerText = fornecedor.contato;

                row.insertCell(11).innerText = fornecedor.telefone;
                row.insertCell(12).innerText = fornecedor.grupo;
                row.insertCell(13).innerText = fornecedor.email;

                const editarBtn = document.createElement('button');
                editarBtn.innerText = 'Editar';
                editarBtn.onclick = () => abrirModal(fornecedor, key);
                row.insertCell(14).appendChild(editarBtn);
            }
        });
    });
}

// Limpar filtros
function limparFiltros() {
    document.getElementById('cnpj').value = '';
    document.getElementById('razaoSocial').value = '';
    document.getElementById('resultados').innerHTML = '';
}

// Adicionar eventos aos botões
document.getElementById('consultar-btn').addEventListener('click', consultarDados);
document.getElementById('limpar-btn').addEventListener('click', limparFiltros);

// Inicializa a consulta ao carregar a página
window.onload = consultarDados;
