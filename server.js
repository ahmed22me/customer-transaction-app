const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 1010;

http.createServer((req, res) => {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    if (req.url === '/data') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        fs.createReadStream(path.join(__dirname, 'data.json')).pipe(res);
    } else if (req.url === '/' || req.url === '/index.html') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.createReadStream(path.join(__dirname, 'index.html')).pipe(res);
    } else if (req.url === '/styles.css') {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        fs.createReadStream(path.join(__dirname, 'styles.css')).pipe(res);
    } else if (req.url === '/script.js') {
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        fs.createReadStream(path.join(__dirname, 'script.js')).pipe(res);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
}).listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
