// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDjuoTIoL4CX8KSkWXos1JEYQ9u0KhySmk",
    authDomain: "bancocozinha.firebaseapp.com",
    projectId: "bancocozinha",
    storageBucket: "bancocozinha.appspot.com",
    messagingSenderId: "424572545119",
    appId: "1:424572545119:web:bc20a45001fbac1cbfd3ea",
    measurementId: "G-5J6XFE0H02"
  };
  
  // Inicializar Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  // Função para enviar dados
  document.getElementById('dataForm').addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Extrair valores do formulário
      const sku = document.getElementById('sku').value;
      const descricao = document.getElementById('descricao').value;
      const tipo = document.getElementById('tipo').value;
      const unidade = document.getElementById('unidade').value;
      const grupo = document.getElementById('grupo').value;
      const quantidade = parseFloat(document.getElementById('quantidade').value) || 0;
      const valor_unitario = parseFloat(document.getElementById('valor_unitario').value) || 0;
      const valor_total = parseFloat(document.getElementById('valor_total').value) || 0;
      const fornecedor = document.getElementById('fornecedor').value;
      const data_cadastro = document.getElementById('data_cadastro').value;
      const data_vencimento = document.getElementById('data_vencimento').value;
  
      // Dados a serem enviados
      const data = {
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
  
      // Enviar dados para o Firestore
      db.collection("produtos").add(data)
      .then(() => {
          alert('Produto salvo com sucesso!');
          document.getElementById('dataForm').reset();
      })
      .catch(error => {
          console.error('Erro ao salvar o produto:', error);
          alert('Erro ao salvar o produto. Tente novamente.');
      });
  });
  
  // Função para calcular o valor total
  function calcularValorTotal() {
      const quantidade = parseFloat(document.getElementById('quantidade').value) || 0;
      const valor_unitario = parseFloat(document.getElementById('valor_unitario').value) || 0;
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
  