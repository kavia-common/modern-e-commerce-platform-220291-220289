'use strict';

const express = require('express');
const { seedMinimal } = require('../../utils/seed');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Dev
 *     description: Development utilities (not available in production)
 */

/**
 * @swagger
 * /api/v1/dev/seed:
 *   post:
 *     summary: Seed minimal development data
 *     description: Inserts categories, a product, an admin user, and a sample coupon. Idempotent.
 *     tags: [Dev]
 *     responses:
 *       200:
 *         description: Seed completed
 */
router.post('/seed', async (req, res, next) => {
  try {
    const out = await seedMinimal();
    res.status(200).json({ status: 'success', data: out });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
