import express from 'express';
import { createServer } from 'vite';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const clientDir = dirname(__dirname) + '/client';

console.log('Starting Vite server with root:', clientDir);

async function createViteServer() {
  const app = express();

  // Create Vite server in middleware mode
  const vite = await createServer({
    server: { 
      middlewareMode: true,
      port: 3000  // Try a different port
    },
    appType: 'spa',
    root: clientDir  // Point to the client directory where our React app lives
  });

  // Use vite's connect instance as middleware
  app.use(vite.middlewares);

  const port = Number(process.env.PORT) || 3000;  // Change default port to 3000
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
  });
}

createViteServer().catch((e) => {
  console.error('Failed to start server:', e);
  process.exit(1);
});