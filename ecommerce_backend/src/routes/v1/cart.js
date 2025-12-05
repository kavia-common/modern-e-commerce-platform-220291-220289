'use strict';

const express = require('express');
const Joi = require('joi');
const validate = require('../../middleware/validate');
const cartController = require('../../controllers/cart');
const { requireAuth } = require('../../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Cart
 *     description: Shopping cart routes
 */

router.get('/', requireAuth, cartController.get.bind(cartController));

const addSchema = {
  body: Joi.object({ productId: Joi.string().required(), qty: Joi.number().integer().min(1).required() }),
};
router.post('/add', requireAuth, validate(addSchema), cartController.add.bind(cartController));

const updateSchema = {
  body: Joi.object({ productId: Joi.string().required(), qty: Joi.number().integer().min(0).required() }),
};
router.post('/update', requireAuth, validate(updateSchema), cartController.update.bind(cartController));

const couponSchema = { body: Joi.object({ code: Joi.string().required() }) };
router.post('/apply-coupon', requireAuth, validate(couponSchema), cartController.applyCoupon.bind(cartController));

module.exports = router;
