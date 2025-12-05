'use strict';

const express = require('express');
const Joi = require('joi');
const validate = require('../../middleware/validate');
const categoryController = require('../../controllers/category');
const { requireAuth, requireRole } = require('../../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Categories
 *     description: Category routes
 */

// Public
router.get('/', categoryController.list.bind(categoryController));
router.get('/tree', categoryController.tree.bind(categoryController));

// Admin
const createSchema = {
  body: Joi.object({
    name: Joi.string().required(),
    slug: Joi.string().required(),
    parent: Joi.string().allow(null),
    icon: Joi.string().allow('', null),
    banner: Joi.string().allow('', null),
    isActive: Joi.boolean().default(true),
  }),
};
router.post('/', requireAuth, requireRole(['admin']), validate(createSchema), categoryController.create.bind(categoryController));
router.put('/:id', requireAuth, requireRole(['admin']), categoryController.update.bind(categoryController));
router.delete('/:id', requireAuth, requireRole(['admin']), categoryController.remove.bind(categoryController));

module.exports = router;
