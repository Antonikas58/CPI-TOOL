const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('sap_messageprocessinglogid', 'AFzlOCKnfRWuDkpO7MqDIL9mRMcx');

  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');

  res.setHeader('Access-Control-Allow-Headers', 'authorization');



  res.end('<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Header/><soap:Body><typ:rispostaRiceviFatture xmlns:typ="http://www.fatturapa.gov.it/sdi/ws/ricezione/v1.0/types"><Esito>ER01</Esito></typ:rispostaRiceviFatture></soap:Body></soap:Envelope>\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

