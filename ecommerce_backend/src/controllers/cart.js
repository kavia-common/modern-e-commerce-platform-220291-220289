'use strict';

const cartService = require('../services/cart');

class CartController {
  // PUBLIC_INTERFACE
  async get(req, res, next) {
    /** Get cart */
    try {
      const cart = await cartService.getCart(req.user.id);
      res.status(200).json({ status: 'success', data: cart });
    } catch (e) {
      next(e);
    }
  }

  // PUBLIC_INTERFACE
  async add(req, res, next) {
    /** Add item */
    try {
      const cart = await cartService.addItem(req.user.id, req.body);
      res.status(200).json({ status: 'success', data: cart });
    } catch (e) {
      next(e);
    }
  }

  // PUBLIC_INTERFACE
  async update(req, res, next) {
    /** Update item */
    try {
      const cart = await cartService.updateItem(req.user.id, req.body);
      res.status(200).json({ status: 'success', data: cart });
    } catch (e) {
      next(e);
    }
  }

  // PUBLIC_INTERFACE
  async applyCoupon(req, res, next) {
    /** Apply coupon */
    try {
      const cart = await cartService.applyCoupon(req.user.id, req.body.code);
      res.status(200).json({ status: 'success', data: cart });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new CartController();
