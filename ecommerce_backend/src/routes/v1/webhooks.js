'use strict';

const express = require('express');
const paymentService = require('../../services/payment');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Webhooks
 *     description: Webhook endpoints
 */

router.post('/payment', async (req, res, next) => {
  try {
    const out = await paymentService.handleWebhook(req.body, req.headers);
    res.status(200).json({ status: 'success', data: out });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
