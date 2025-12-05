'use strict';

const express = require('express');
const Joi = require('joi');
const validate = require('../../middleware/validate');
const couponController = require('../../controllers/coupon');
const { requireAuth, requireRole } = require('../../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Coupons
 *     description: Coupon management
 */

// Admin CRUD
const createSchema = {
  body: Joi.object({
    code: Joi.string().required(),
    description: Joi.string().allow('', null),
    type: Joi.string().valid('percent', 'amount').required(),
    value: Joi.number().min(0).required(),
    minOrder: Joi.number().min(0).default(0),
    maxDiscount: Joi.number().min(0).default(0),
    usageLimit: Joi.number().min(0).default(0),
    startsAt: Joi.date().allow(null),
    endsAt: Joi.date().allow(null),
    isActive: Joi.boolean().default(true),
  }),
};

router.post('/', requireAuth, requireRole(['admin']), validate(createSchema), couponController.create.bind(couponController));
router.get('/', requireAuth, requireRole(['admin']), couponController.list.bind(couponController));
router.delete('/:id', requireAuth, requireRole(['admin']), couponController.remove.bind(couponController));

// Public validation
router.post('/validate', validate({ body: Joi.object({ code: Joi.string().required() }) }), couponController.validate.bind(couponController));

module.exports = router;
