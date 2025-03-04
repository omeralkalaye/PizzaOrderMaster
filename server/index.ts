import express from 'express';
import { createServer } from 'vite';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const clientDir = dirname(__dirname);

console.log('Starting Vite server with root:', clientDir);

async function createViteServer() {
  const app = express();

  // Create Vite server in middleware mode
  const vite = await createServer({
    server: { 
      middlewareMode: true,
      port: Number(process.env.PORT) || 5000,
      host: '0.0.0.0',
      hmr: {
        clientPort: Number(process.env.PORT) || 5000,
        host: '0.0.0.0'
      },
      allowedHosts: ['all'] // Allow all external hosts
    },
    appType: 'spa',
    root: clientDir
  });

  // Log Vite configuration for debugging
  console.log('Vite server configuration:', {
    port: Number(process.env.PORT) || 5000,
    host: '0.0.0.0',
    allowedHosts: ['all'],
    root: clientDir
  });

  // Use vite's connect instance as middleware
  app.use(vite.middlewares);
  console.log('Vite middleware attached');

  const port = Number(process.env.PORT) || 5000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
    console.log(`HMR running on port ${port}`);
    console.log(`Application available at http://0.0.0.0:${port}`);
  });
}

process.on('uncaughtException', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error('Error: Port is already in use. Please make sure no other services are running on this port.');
    process.exit(1);
  }
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

createViteServer().catch((e) => {
  console.error('Failed to start server:', e);
  process.exit(1);
});