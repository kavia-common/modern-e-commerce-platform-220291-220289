'use strict';

const mongoose = require('mongoose');
const config = require('./env');

/**
 * Build mongoose connection options based on env.
 * Note: dbName ensures the connection targets the intended database,
 * even if the URI lacks a path segment with the DB name.
 */
function getMongooseOptions() {
  return {
    autoIndex: true, // Dev default; consider false in prod with manual index builds.
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    dbName: config.MONGODB_DB,
  };
}

/**
 * Sleep helper
 */
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * PUBLIC_INTERFACE
 * Establish MongoDB connection with retries and exponential backoff.
 * Creates indexes on connection if applicable.
 */
async function connectDB(retries = 5, baseDelayMs = 1000) {
  let attempt = 0;
  while (attempt <= retries) {
    try {
      await mongoose.connect(config.MONGODB_URI, getMongooseOptions());

      // Connection event logging
      mongoose.connection.on('connected', () => {
        // eslint-disable-next-line no-console
        console.log('MongoDB connected');
      });
      mongoose.connection.on('error', (err) => {
        // eslint-disable-next-line no-console
        console.error('MongoDB connection error:', err.message);
      });
      mongoose.connection.on('disconnected', () => {
        // eslint-disable-next-line no-console
        console.warn('MongoDB disconnected');
      });

      // Optional: ensure indexes for any pre-registered models
      // This will no-op if no models exist yet.
      const modelNames = mongoose.modelNames();
      for (const name of modelNames) {
        try {
          await mongoose.model(name).syncIndexes();
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn(`Index sync failed for model ${name}:`, e.message);
        }
      }

      return mongoose.connection;
    } catch (err) {
      attempt += 1;
      const isLast = attempt > retries;
      // eslint-disable-next-line no-console
      console.error(
        `MongoDB connection attempt ${attempt} failed: ${err.message}${
          isLast ? ' (no more retries)' : ''
        }`
      );
      if (isLast) {
        throw err;
      }
      const backoff = baseDelayMs * Math.pow(2, attempt - 1);
      await delay(backoff);
    }
  }
}

module.exports = {
  connectDB,
};
