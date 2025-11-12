import express from 'express';
import authRoutes from './src/routes/authRoutes.js';
import informationRoutes from './src/routes/informationRoute.js';
import transactionRoutes from './src/routes/transactionRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { conn, testConnection } from './src/utils/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(authRoutes);
app.use(informationRoutes);
app.use(transactionRoutes);

app.get('/', (req, res) => {
  const port = req.socket.localPort;
  res.send(`Hello from Node.js on port ${port}!`);

})

async function startServer() {
  const dbConnected = await testConnection();
  if (!dbConnected) {
    console.error('Fatal: Could not connect to database');
    process.exit(1);
  }

  // Jalankan di port 3000
  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });

  // Jalankan di port 3001
  app.listen(3001, () => {
    console.log('Server running on port 3001');
  });
}

export default app;

startServer();