'use strict';

const app = require('./app');
const { connectDB } = require('./config/db');
const config = require('./config/env');
const { seedMinimal } = require('./utils/seed');

let server;

/**
 * Start the HTTP server after DB connection is established.
 */
async function start() {
  try {
    await connectDB();

    // Optional seeding on start (dev/test only recommended)
    if (config.SEED_ON_START) {
      try {
        const out = await seedMinimal();
        // eslint-disable-next-line no-console
        console.log('[SEED_ON_START] Seeded:', out);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('[SEED_ON_START] Seeding failed:', e.message);
      }
    }

    server = app.listen(config.PORT, config.HOST, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running at http://${config.HOST}:${config.PORT}`);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();

/**
 * Graceful shutdown
 */
function shutdown(signal) {
  // eslint-disable-next-line no-console
  console.log(`${signal} signal received: closing HTTP server`);
  if (server) {
    server.close(() => {
      // eslint-disable-next-line no-console
      console.log('HTTP server closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

module.exports = server;
