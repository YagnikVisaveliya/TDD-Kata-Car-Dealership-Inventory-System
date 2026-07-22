import express from 'express';
import authRoutes from './routes/auth.route';

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Good' });
});

app.use('/api/v1/auth', authRoutes);

export { app };
