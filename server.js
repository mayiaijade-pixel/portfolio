const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const REELS_PATH = path.join(ROOT, 'reels.json');

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
};

function serveStatic(req, res) {
  const urlPath = req.url.split('?')[0];
  const safePath = urlPath === '/' ? '/index.html' : urlPath;
  const filePath = path.join(ROOT, safePath);

  // Prevent path traversal
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(err.code === 'ENOENT' ? 404 : 500);
      res.end(err.code === 'ENOENT' ? 'Not Found' : 'Server Error');
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

function handleReelsPost(req, res) {
  let body = '';
  req.on('data', (chunk) => { body += chunk; if (body.length > 5 * 1024 * 1024) req.destroy(); });
  req.on('end', () => {
    try {
      const parsed = JSON.parse(body);
      if (!Array.isArray(parsed)) throw new Error('Payload must be array');
      fs.writeFile(REELS_PATH, JSON.stringify(parsed, null, 2), 'utf-8', (err) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Failed to write reels.json' }));
          return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      });
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
  });
}

function handleReelsGet(res) {
  fs.readFile(REELS_PATH, 'utf-8', (err, data) => {
    if (err) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end('[]');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/api/reels')) {
    if (req.method === 'POST') {
      handleReelsPost(req, res);
      return;
    }
    if (req.method === 'GET') {
      handleReelsGet(res);
      return;
    }
    res.writeHead(405);
    res.end('Method not allowed');
    return;
  }

  serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

