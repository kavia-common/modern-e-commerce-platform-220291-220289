'use strict';

const express = require('express');

const router = express.Router();

/**
 * Helper to produce 501 Not Implemented responses for placeholder routes.
 */
function notImplemented(req, res) {
  return res.status(501).json({
    status: 'error',
    message: 'Not Implemented',
  });
}

// Placeholder sub-routers
router.use('/auth', (req, res) => {
  // PUBLIC_INTERFACE
  /** Placeholder for auth routes */
  return notImplemented(req, res);
});

router.use('/products', (req, res) => {
  // PUBLIC_INTERFACE
  /** Placeholder for product routes */
  return notImplemented(req, res);
});

router.use('/categories', (req, res) => {
  // PUBLIC_INTERFACE
  /** Placeholder for category routes */
  return notImplemented(req, res);
});

router.use('/cart', (req, res) => {
  // PUBLIC_INTERFACE
  /** Placeholder for cart routes */
  return notImplemented(req, res);
});

router.use('/orders', (req, res) => {
  // PUBLIC_INTERFACE
  /** Placeholder for order routes */
  return notImplemented(req, res);
});

module.exports = router;
