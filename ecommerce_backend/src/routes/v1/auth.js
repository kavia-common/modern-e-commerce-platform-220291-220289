'use strict';

const express = require('express');
const validate = require('../../middleware/validate');
const Joi = require('joi');
const authController = require('../../controllers/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication routes
 */

// Schemas
const registerSchema = {
  body: Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
};
const loginSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
};
const refreshSchema = { body: Joi.object({ refreshToken: Joi.string().required() }) };
const forgotSchema = { body: Joi.object({ email: Joi.string().email().required() }) };
const resetSchema = {
  body: Joi.object({ token: Joi.string().required(), password: Joi.string().min(6).required() }),
};

// Routes
router.post('/register', validate(registerSchema), authController.register.bind(authController));
router.post('/login', validate(loginSchema), authController.login.bind(authController));
router.post('/refresh', validate(refreshSchema), authController.refresh.bind(authController));
router.post('/forgot', validate(forgotSchema), authController.forgot.bind(authController));
router.post('/reset', validate(resetSchema), authController.reset.bind(authController));

module.exports = router;
