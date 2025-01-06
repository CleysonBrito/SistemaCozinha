document.addEventListener('DOMContentLoaded', function() {
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
    const db = firebase.database().ref('cadastrodefornecedores');

    // Função para salvar os dados no Firebase
    document.getElementById('supplier-form').addEventListener('submit', function(e) {
        e.preventDefault(); // Evita o envio padrão do formulário

        // Coleta os dados do formulário
        const formData = {
            cnpj: document.getElementById('cnpj').value,
            razaoSocial: document.getElementById('razao-social').value.toUpperCase(),
            endereco: document.getElementById('endereco').value.toUpperCase(),
            bairro: document.getElementById('bairro').value.toUpperCase(),
            municipio: document.getElementById('municipio').value.toUpperCase(),
            uf: document.getElementById('uf').value.toUpperCase(),
            complemento: document.getElementById('complemento').value.toUpperCase(),
            contato: document.getElementById('contato').value.toUpperCase(),
            email: document.getElementById('email').value.toUpperCase(),
            cep: formatCEP(document.getElementById('cep').value),
            telefone: formatTelefone(document.getElementById('telefone').value)
        };

        // Salva os dados no Firebase
        db.push(formData)
            .then(() => {
                alert('Dados enviados com sucesso!');
                document.getElementById('supplier-form').reset(); // Limpa o formulário
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Ocorreu um erro ao enviar os dados. Por favor, tente novamente.');
            });
    });

    // Função para converter texto para maiúsculas
    function toUpperCaseInput(event) {
        event.target.value = event.target.value.toUpperCase();
    }

    // Adiciona o evento de input para converter texto para maiúsculas
    document.getElementById('razao-social').addEventListener('input', toUpperCaseInput);
    document.getElementById('endereco').addEventListener('input', toUpperCaseInput);
    document.getElementById('bairro').addEventListener('input', toUpperCaseInput);
    document.getElementById('municipio').addEventListener('input', toUpperCaseInput);
    document.getElementById('uf').addEventListener('input', toUpperCaseInput);
    document.getElementById('complemento').addEventListener('input', toUpperCaseInput);
    document.getElementById('contato').addEventListener('input', toUpperCaseInput);
    document.getElementById('email').addEventListener('input', toUpperCaseInput);

    // Função para formatar o CEP
    function formatCEP(value) {
        const cep = value.replace(/\D/g, ''); // Remove caracteres não numéricos
        return cep.replace(/(\d{5})(\d{3})/, '$1-$2'); // Formata o CEP
    }

    // Adiciona o evento de blur para formatar o CEP
    document.getElementById('cep').addEventListener('blur', function(event) {
        event.target.value = formatCEP(event.target.value);
    });

    // Função para formatar o telefone
    function formatTelefone(value) {
        const telefone = value.replace(/\D/g, ''); // Remove caracteres não numéricos
        if (telefone.length === 11) {
            return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3'); // Formata celular com DDD
        } else if (telefone.length === 10) {
            return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3'); // Formata telefone fixo com DDD
        } else if (telefone.length === 9) {
            return telefone.replace(/(\d{5})(\d{4})/, '9$1-$2'); // Formata celular sem DDD
        } else if (telefone.length === 8) {
            return telefone.replace(/(\d{4})(\d{4})/, '$1-$2'); // Formata telefone fixo sem DDD
        }
        return telefone; // Retorna o telefone sem formatação se não atender aos casos acima
    }

    // Adiciona o evento de blur para formatar o telefone
    document.getElementById('telefone').addEventListener('blur', function(event) {
        event.target.value = formatTelefone(event.target.value);
    });
});

function goBack() {
    window.history.back(); // Voltar para a página anterior
}