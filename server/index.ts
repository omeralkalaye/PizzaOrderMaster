import express from 'express';
import { createServer } from 'vite';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const clientDir = dirname(__dirname) + '/src';

console.log('Starting Vite server with root:', clientDir);

async function createViteServer() {
  const app = express();

  // Create Vite server in middleware mode
  const vite = await createServer({
    server: { 
      middlewareMode: true,
      port: 5000,
      host: '0.0.0.0',
      hmr: {
        port: 5000,
        host: '0.0.0.0'
      }
    },
    appType: 'spa',
    root: clientDir
  });

  // Use vite's connect instance as middleware
  app.use(vite.middlewares);

  const port = Number(process.env.PORT) || 5000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
  });
}

process.on('uncaughtException', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error('Error: Port 5000 is already in use. Please make sure no other services are running on this port.');
    process.exit(1);
  }
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

createViteServer().catch((e) => {
  console.error('Failed to start server:', e);
  process.exit(1);
});