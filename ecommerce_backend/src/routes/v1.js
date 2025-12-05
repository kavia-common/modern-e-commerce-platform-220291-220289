'use strict';

const express = require('express');
const config = require('../config/env');

const authRoutes = require('./v1/auth');
const categoryRoutes = require('./v1/categories');
const productRoutes = require('./v1/products');
const cartRoutes = require('./v1/cart');
const couponRoutes = require('./v1/coupons');
const orderRoutes = require('./v1/orders');
const webhooksRoutes = require('./v1/webhooks');

const router = express.Router();

// Mount sub-routers
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/coupons', couponRoutes);
router.use('/orders', orderRoutes);
router.use('/webhooks', webhooksRoutes);

// Dev-only utilities
if (config.NODE_ENV !== 'production') {
  // Lazy require to avoid including in prod bundles accidentally
  // eslint-disable-next-line global-require
  const devRoutes = require('./v1/dev');
  router.use('/dev', devRoutes);
}

module.exports = router;
