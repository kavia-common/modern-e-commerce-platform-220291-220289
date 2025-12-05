'use strict';

const express = require('express');

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

module.exports = router;
