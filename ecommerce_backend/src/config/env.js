'use strict';

/**
 * Environment configuration loader
 * Loads env variables with sensible defaults and exports a typed config object.
 * Do NOT read or write the .env file directly; the orchestrator sets env vars.
 */

const dotenv = require('dotenv');

// Load .env if present (non-fatal if missing)
dotenv.config();

/**
 * Normalize boolean-like strings to booleans.
 */
function toBool(val, defaultVal = false) {
  if (val === undefined || val === null) return defaultVal;
  const s = String(val).toLowerCase().trim();
  if (['true', '1', 'yes', 'y'].includes(s)) return true;
  if (['false', '0', 'no', 'n'].includes(s)) return false;
  return defaultVal;
}

/**
 * Normalize integer number with default
 */
function toInt(val, defaultVal) {
  const n = parseInt(val, 10);
  return Number.isFinite(n) ? n : defaultVal;
}

/**
 * PUBLIC_INTERFACE
 * Exports the configuration object used across the app.
 */
const config = {
  // App
  NODE_ENV: process.env.NODE_ENV || 'development',
  HOST: process.env.HOST || '0.0.0.0',
  PORT: toInt(process.env.PORT, 3001),

  // Database
  MONGODB_URI:
    process.env.MONGODB_URI ||
    'mongodb://appuser:dbuser123@localhost:5000/myapp?authSource=admin',
  MONGODB_DB: process.env.MONGODB_DB || 'myapp',

  // JWT
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'changeme_access',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'changeme_refresh',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

  // CORS and cookies
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  COOKIE_SECURE: toBool(process.env.COOKIE_SECURE, false),

  // Seed and storage
  SEED_ON_START: toBool(process.env.SEED_ON_START, false),
  FILE_STORAGE: process.env.FILE_STORAGE || 'local',
};

module.exports = config;
