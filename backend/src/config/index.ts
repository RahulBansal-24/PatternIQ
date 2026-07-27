export const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key',
  n8nWebhookUrl: process.env.N8N_WEBHOOK_URL || '',
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/patterniq'
};
