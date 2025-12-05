'use strict';

const express = require('express');
const healthController = require('../controllers/health');
const v1Router = require('./v1');

const router = express.Router();

// Health endpoint (root)
/**
 * @swagger
 * /:
 *   get:
 *     summary: Health endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service health check passed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Service is healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: development
 */
router.get('/', healthController.check.bind(healthController));

// Export both: root router and versioned sub-router for /api/v1 usage
router.use('/v1', v1Router);

module.exports = router;
