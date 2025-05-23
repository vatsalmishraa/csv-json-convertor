import express from 'express';
import path from 'path';
import routes from './routes';
import { dbService } from './services/db';
import cors from 'cors';

const app = express();

// Add CORS middleware with wildcard
app.use(cors({
  origin: '*',
  credentials: false
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api', routes);

// Database connection status route
app.get('/api/status', async (req, res) => {
  const isConnected = await dbService.checkConnection();
  if (isConnected) {
    res.status(200).json({ status: 'ok', database: 'connected' });
  } else {
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});

// In production, serve the React app
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, '../../frontend/build')));

  // For any request that doesn't match an API route, send the React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/build/index.html'));
  });
}

// Database is automatically initialized when dbService is created
console.log('Server starting with database service initialized...');

export default app;