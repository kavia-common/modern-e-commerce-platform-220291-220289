'use strict';

const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = require('../swagger');
const config = require('./config/env');
const rootRoutes = require('./routes'); // keeps health route at "/"
const apiV1Routes = require('./routes/index'); // versioned router for /api/v1

// Initialize express app
const app = express();

// Trust proxy (for rate limiting and secure cookies behind proxies)
// Disable trust proxy in test to avoid req.ip variations and other side effects
app.set('trust proxy', config.NODE_ENV === 'test' ? false : true);

// Security headers (helmet) for common vulnerabilities
app.use(helmet());

// Request logging (quieter in test)
app.use(
  morgan(
    config.NODE_ENV === 'production'
      ? 'combined'
      : config.NODE_ENV === 'test'
      ? 'tiny'
      : 'dev'
  )
);

// CORS setup from env
app.use(
  cors({
    origin: config.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Body parsers and cookies
const jsonLimit = process.env.BODY_JSON_LIMIT || '1mb';
app.use(express.json({ limit: jsonLimit }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Swagger docs with dynamic server url
app.use('/docs', swaggerUi.serve, (req, res, next) => {
  const host = req.get('host'); // may or may not include port
  let protocol = req.protocol; // http or https

  const actualPort = req.socket.localPort;
  const hasPort = host.includes(':');

  const needsPort =
    !hasPort &&
    ((protocol === 'http' && actualPort !== 80) ||
      (protocol === 'https' && actualPort !== 443));
  const fullHost = needsPort ? `${host}:${actualPort}` : host;
  protocol = req.secure ? 'https' : protocol;

  const dynamicSpec = {
    ...swaggerSpec,
    servers: [
      {
        url: `${protocol}://${fullHost}`,
      },
    ],
  };
  swaggerUi.setup(dynamicSpec)(req, res, next);
});

// Basic rate limiter for API routes (disabled during test to avoid flakiness)
const apiLimiter =
  config.NODE_ENV === 'test'
    ? (req, res, next) => next()
    : rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 300, // limit each IP to 300 requests per windowMs
        standardHeaders: true,
        legacyHeaders: false,
      });

// Keep root routes (health) working
app.use('/', rootRoutes);

// Mount versioned API with rate limit
app.use('/api', apiLimiter);
app.use('/api/v1', apiV1Routes);

// Error handling middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;
