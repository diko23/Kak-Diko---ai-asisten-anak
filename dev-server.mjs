/**
 * File: dev-server.mjs
 * Server HTTP Lokal Ringan untuk menguji PWA Kak Diko SD (Kelas 1–6)
 * & Aplikasi HP Orang Tua (`/parent`) beserta Serverless `/api/chat`, `/api/sync`, dan `/api/tts`.
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import chatHandler from './api/chat.js';
import syncHandler from './api/sync.js';
import ttsHandler from './api/tts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function enhanceVercelResponse(res) {
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (payload) => {
    if (!res.getHeader('Content-Type')) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }
    res.end(JSON.stringify(payload));
    return res;
  };
  return res;
}

const API_ROUTES = {
  '/api/chat': chatHandler,
  '/api/chat.js': chatHandler,
  '/api/sync': syncHandler,
  '/api/sync.js': syncHandler,
  '/api/tts': ttsHandler,
  '/api/tts.js': ttsHandler
};

export function createAppServer() {
  return http.createServer(async (req, res) => {
    enhanceVercelResponse(res);
    const parsedUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    const pathname = decodeURIComponent(parsedUrl.pathname);

    if (API_ROUTES[pathname]) {
      let rawBody = '';
      req.on('data', (chunk) => {
        rawBody += chunk;
      });
      req.on('end', async () => {
        if (rawBody) {
          try {
            req.body = JSON.parse(rawBody);
          } catch {
            req.body = rawBody;
          }
        } else {
          req.body = {};
        }
        await API_ROUTES[pathname](req, res);
      });
      return;
    }

    let relativePath = pathname;
    if (pathname === '/') relativePath = '/index.html';
    if (pathname === '/parent' || pathname === '/parent/') relativePath = '/parent.html';

    const safePath = path.normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, '');
    const fullPath = path.join(__dirname, safePath);

    if (!fullPath.startsWith(__dirname)) {
      res.status(403).end('Forbidden');
      return;
    }

    fs.stat(fullPath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.status(404).end('Not Found');
        return;
      }

      const ext = path.extname(fullPath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.setHeader('Content-Type', contentType);
      if (pathname === '/sw.js') {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
      fs.createReadStream(fullPath).pipe(res);
    });
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  const port = Number(process.env.PORT) || 3000;
  const server = createAppServer();
  server.listen(port, () => {
    console.log(`🦉 Kak Diko SD (Kelas 1–6) berjalan di http://localhost:${port}`);
    console.log(`📱 Diko Parent Monitor (HP Ortu) berjalan di http://localhost:${port}/parent`);
  });
}
