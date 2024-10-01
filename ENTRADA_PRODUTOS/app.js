// Função para lidar com GET
function doGet(e) {
    return ContentService.createTextOutput(JSON.stringify({ message: 'Método GET não suportado' }))
                   .setMimeType(ContentService.MimeType.JSON)
                   .setHeader('Access-Control-Allow-Origin', '*')
                   .setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
                   .setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  
  // Função para lidar com POST
  function doPost(e) {
    try {
      var data = JSON.parse(e.postData.contents);
  
      // Processar os dados aqui, por exemplo, salvar no Google Sheets
  
      return ContentService.createTextOutput(JSON.stringify({status: 'success', data: data}))
                           .setMimeType(ContentService.MimeType.JSON)
                           .setHeader('Access-Control-Allow-Origin', '*')
                           .setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
                           .setHeader('Access-Control-Allow-Headers', 'Content-Type');
      
    } catch (error) {
      return ContentService.createTextOutput(JSON.stringify({status: 'error', message: error.message}))
                           .setMimeType(ContentService.MimeType.JSON)
                           .setHeader('Access-Control-Allow-Origin', '*')
                           .setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
                           .setHeader('Access-Control-Allow-Headers', 'Content-Type');
    }
  }
  
  // Função para lidar com requisições OPTIONS (preflight)
  function doOptions(e) {
    return ContentService.createTextOutput('')
           .setMimeType(ContentService.MimeType.JSON)
           .setHeader('Access-Control-Allow-Origin', '*')
           .setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
           .setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  