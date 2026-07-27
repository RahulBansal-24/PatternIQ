import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/database';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';

// Routes
import authRoutes from './routes/auth';
import taskRoutes from './routes/tasks';
import reflectionRoutes from './routes/reflections';
import screenTimeRoutes from './routes/screenTime';
import dashboardRoutes from './routes/dashboard';
import analysisRoutes from './routes/analysis';
import chartsRoutes from './routes/charts';
import settingsRoutes from './routes/settings';

const app: Application = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/reflections', reflectionRoutes);
app.use('/api/screen-time', screenTimeRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/charts', chartsRoutes);
app.use('/api/settings', settingsRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
      console.log(`Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
