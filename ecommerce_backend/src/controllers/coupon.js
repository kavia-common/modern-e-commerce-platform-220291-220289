'use strict';

const couponService = require('../services/coupon');

class CouponController {
  // PUBLIC_INTERFACE
  async create(req, res, next) {
    /** Create coupon */
    try {
      const coupon = await couponService.create(req.body);
      res.status(201).json({ status: 'success', data: coupon });
    } catch (e) {
      next(e);
    }
  }

  // PUBLIC_INTERFACE
  async list(req, res, next) {
    /** List coupons */
    try {
      const items = await couponService.list();
      res.status(200).json({ status: 'success', data: items });
    } catch (e) {
      next(e);
    }
  }

  // PUBLIC_INTERFACE
  async remove(req, res, next) {
    /** Remove coupon */
    try {
      const out = await couponService.remove(req.params.id);
      res.status(200).json({ status: 'success', data: out });
    } catch (e) {
      next(e);
    }
  }

  // PUBLIC_INTERFACE
  async validate(req, res, next) {
    /** Validate coupon code */
    try {
      const coupon = await couponService.validateCode(req.body.code);
      res.status(200).json({ status: 'success', data: coupon });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new CouponController();
