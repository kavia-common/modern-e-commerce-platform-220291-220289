'use strict';

const authService = require('../services/auth');

class AuthController {
  // PUBLIC_INTERFACE
  async register(req, res, next) {
    /** Register user */
    try {
      const result = await authService.register(req.body);
      res.status(201).json({ status: 'success', data: result });
    } catch (e) {
      next(e);
    }
  }

  // PUBLIC_INTERFACE
  async login(req, res, next) {
    /** Login user */
    try {
      const result = await authService.login(req.body);
      res.status(200).json({ status: 'success', data: result });
    } catch (e) {
      next(e);
    }
  }

  // PUBLIC_INTERFACE
  async refresh(req, res, next) {
    /** Refresh tokens */
    try {
      const { refreshToken } = req.body;
      const tokens = await authService.refresh(refreshToken);
      res.status(200).json({ status: 'success', data: tokens });
    } catch (e) {
      next(e);
    }
  }

  // PUBLIC_INTERFACE
  async forgot(req, res, next) {
    /** Forgot password */
    try {
      const { email } = req.body;
      const out = await authService.forgotPassword(email);
      res.status(200).json({ status: 'success', data: out });
    } catch (e) {
      next(e);
    }
  }

  // PUBLIC_INTERFACE
  async reset(req, res, next) {
    /** Reset password */
    try {
      const { token, password } = req.body;
      const out = await authService.resetPassword({ token, password });
      res.status(200).json({ status: 'success', data: out });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new AuthController();
