import express from 'express';
import authRoutes from './routes/auth.route.js';
import vehicleRoutes from './routes/vehicle.routes.js';

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }

  next();
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Good' });
});

app.use('/api/auth', authRoutes);
  app.use('/api/vehicles', vehicleRoutes);

export { app };
