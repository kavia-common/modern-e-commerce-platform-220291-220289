'use strict';

const express = require('express');
const Joi = require('joi');
const validate = require('../../middleware/validate');
const productController = require('../../controllers/product');
const { requireAuth, requireRole } = require('../../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: Product catalog routes
 */

// Public list and detail
router.get('/', productController.list.bind(productController));
router.get('/:id', productController.get.bind(productController));

// Admin CRUD
const createSchema = {
  body: Joi.object({
    title: Joi.string().required(),
    slug: Joi.string().required(),
    description: Joi.string().allow('', null),
    images: Joi.array().items(Joi.string()).default([]),
    category: Joi.string().required(),
    brand: Joi.string().allow('', null),
    tags: Joi.array().items(Joi.string()).default([]),
    price: Joi.number().min(0).required(),
    mrp: Joi.number().min(0).default(0),
    stock: Joi.number().min(0).default(0),
  }),
};

router.post('/', requireAuth, requireRole(['admin']), validate(createSchema), productController.create.bind(productController));
router.put('/:id', requireAuth, requireRole(['admin']), productController.update.bind(productController));
router.delete('/:id', requireAuth, requireRole(['admin']), productController.remove.bind(productController));

module.exports = router;
