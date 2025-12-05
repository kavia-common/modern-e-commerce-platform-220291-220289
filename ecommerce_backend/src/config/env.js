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
 * Resolve Mongo connection string with compatibility for database container vars:
 * The database container exposes MONGODB_URL and MONGODB_DB. If MONGODB_URI is not set,
 * build it from MONGODB_URL and MONGODB_DB (adding dbName if missing).
 */
function resolveMongoUri() {
  const explicitUri = process.env.MONGODB_URI;
  if (explicitUri) return explicitUri;

  const urlFromDbContainer = process.env.MONGODB_URL;
  const dbFromDbContainer = process.env.MONGODB_DB || process.env.MONGODB_DATABASE;

  if (urlFromDbContainer) {
    try {
      // If URL already has a path db segment, keep it; otherwise append db name when available.
      const hasPathDb = /mongodb(\+srv)?:\/\/[^/]+\/[^?]+/.test(urlFromDbContainer);
      if (hasPathDb || !dbFromDbContainer) {
        return urlFromDbContainer;
      }
      // Append "/<db>" before query string if present
      const [base, query = ''] = urlFromDbContainer.split('?');
      const composed = `${base.replace(/\/?$/, '/')}${dbFromDbContainer}${query ? `?${query}` : ''}`;
      return composed;
    } catch (e) {
      // fall through to default
    }
  }

  // Default fallback (dev only)
  return 'mongodb://appuser:dbuser123@localhost:5001/ecommerce?authSource=admin';
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
  MONGODB_URI: resolveMongoUri(),
  MONGODB_DB: process.env.MONGODB_DB || 'ecommerce',

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
