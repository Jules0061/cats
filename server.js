const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
};

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];

  if (url === '/cat') {
    https.get('https://cataas.com/cat?width=140&height=140', (up) => {
      res.writeHead(200, {
        'Content-Type': up.headers['content-type'] || 'image/jpeg',
        'Cache-Control': 'no-store',
      });
      up.pipe(res);
    }).on('error', () => {
      res.writeHead(502);
      res.end('cat unavailable');
    });
    return;
  }

  const file = url === '/' ? 'index.html' : url.replace(/^\/+/, '');
  const full = path.join(__dirname, file);

  if (!full.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('forbidden');
    return;
  }

  fs.readFile(full, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(full)] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log('Cats running: http://localhost:' + PORT);
});
