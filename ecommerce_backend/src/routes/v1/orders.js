'use strict';

const express = require('express');
const Joi = require('joi');
const validate = require('../../middleware/validate');
const orderController = require('../../controllers/order');
const { requireAuth, requireRole } = require('../../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Orders
 *     description: Order routes
 */

const createSchema = { body: Joi.object({ method: Joi.string().valid('COD', 'PREPAID').required() }) };
router.post('/', requireAuth, validate(createSchema), orderController.create.bind(orderController));
router.get('/', requireAuth, orderController.listMine.bind(orderController));
router.get('/:id', requireAuth, orderController.detail.bind(orderController));
router.post('/:id/cancel', requireAuth, orderController.cancel.bind(orderController));
router.post('/:id/return', requireAuth, orderController.requestReturn.bind(orderController));

// Admin
router.get('/admin/all/list', requireAuth, requireRole(['admin']), orderController.adminList.bind(orderController));
router.post('/admin/:id/status', requireAuth, requireRole(['admin']), validate({ body: Joi.object({ status: Joi.string().required() }) }), orderController.adminUpdateStatus.bind(orderController));

module.exports = router;
