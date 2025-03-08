import express from 'express';
import "express-async-errors";
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import winston from 'winston';
import cookieParser from 'cookie-parser';
import expressWinston from 'express-winston';
import dotenv from 'dotenv';  // Ensure dotenv is loaded first
import env from './config/env.config.js';  // Import env variables
import connectDB from './config/db.config.js';
import taskRoutes from './routes/task.routes.js';
import userRoutes from './routes/user.routes.js';
import workflowRoutes from './routes/workflow.routes.js';

import subscriptionPlanRoutes from './routes/subscription-plan.routes.js';
import subscriptionRoutes from './routes/subscription.routes.js';
// Load environment variables


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: env.CORS_ORIGIN,  // Use environment variable for CORS
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
  }
});

// Middleware Stack
app.use(helmet()); 
app.use(express.json({ limit: '10kb' })); 
app.use(cors({
  origin: env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logging Configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
app.use(cookieParser());
// Routes
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/workflows", workflowRoutes);
app.use('/api/v1/plans', subscriptionPlanRoutes);
app.use('/api/v1/subscriptions', subscriptionRoutes);

// Socket.IO Connection Handling
io.on('connection', (socket) => {
  logger.info(`New socket connection: ${socket.id}`);
  
  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    error: "Route not found",
    requestedUrl: req.originalUrl
  });
});

// Global Error Handler
app.use((err, req, res,next) => {
  logger.error(err.stack);
  res.status(500).json({ 
    error: "Internal Server Error",
    message: env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message
  });
});

// Start Server
const startServer = async () => {
  try {
    await connectDB();
    server.listen(env.PORT, () => {
      logger.info(`🚀 Server running on port ${env.PORT}`);
      logger.info(`Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();

// Graceful Shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});
