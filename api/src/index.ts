import dotenv from 'dotenv';
import * as grpc from '@grpc/grpc-js';
import app from './app';
import { connectDB, disconnectDB } from './lib/database.connection';
import { initializeCache, closeCache } from './services/cache.service';
import { autoCreateAdmin } from './scripts/auto-create-admin';
import { logger } from './utils/logger';
import { startGrpcServer, stopGrpcServer } from './grpc';

dotenv.config();

const PORT = parseInt(process.env.PORT || '3001', 10);

let grpcServer: grpc.Server | null = null;

const gracefulShutdown = async (signal: string) => {
  logger.info(`Received ${signal}, starting graceful shutdown`);

  try {
    if (grpcServer) {
      await stopGrpcServer(grpcServer);
    }
    logger.info('gRPC server stopped');

    await closeCache();
    logger.info('Cache service closed');

    await disconnectDB();
    logger.info('Database disconnected');

    logger.info('Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown', undefined, error as Error);
    process.exit(1);
  }
};

const startServer = async () => {
  try {
    logger.info('Starting server...', {
      nodeVersion: process.version,
      environment: process.env.NODE_ENV,
      port: PORT,
    });

    await connectDB();
    logger.info('Database connected');

    await initializeCache();
    logger.info('Cache initialized');

    await autoCreateAdmin();
    logger.info('Admin user check completed');

    grpcServer = await startGrpcServer();

    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`, {
        pid: process.pid,
        uptime: process.uptime(),
      });
    });

    server.on('error', (err: Error) => {
      logger.error('Server error', undefined, err);
      process.exit(1);
    });

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    process.on('uncaughtException', (err) => {
      logger.error('Uncaught exception', undefined, err);
      gracefulShutdown('uncaughtException');
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled rejection', { reason: String(reason), promise });
    });

  } catch (error) {
    logger.error('Failed to start server', undefined, error as Error);
    process.exit(1);
  }
};

startServer();

export { grpcServer };
export default app;