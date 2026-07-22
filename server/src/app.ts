import express from 'express';
import authRoutes from './routes/auth.route';
import vehicleRoutes from './routes/vehicle.routes.js';

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Good' });
});

app.use('/api/auth', authRoutes);
  app.use('/api/vehicles', vehicleRoutes);

export { app };
