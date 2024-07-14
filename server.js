const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

http.createServer((req, res) => {
  if (req.url === '/data') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    fs.createReadStream(path.join(__dirname, 'data.json')).pipe(res);
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(path.join(__dirname, 'index.html')).pipe(res);
  }
}).listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
