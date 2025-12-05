'use strict';

const orderService = require('../services/order');

class OrderController {
  // PUBLIC_INTERFACE
  async create(req, res, next) {
    /** Create order */
    try {
      const result = await orderService.create(req.user.id, req.body);
      res.status(201).json({ status: 'success', data: result });
    } catch (e) {
      next(e);
    }
  }

  // PUBLIC_INTERFACE
  async listMine(req, res, next) {
    /** List user's orders */
    try {
      const items = await orderService.list(req.user.id, false);
      res.status(200).json({ status: 'success', data: items });
    } catch (e) {
      next(e);
    }
  }

  // PUBLIC_INTERFACE
  async detail(req, res, next) {
    /** Order detail for user */
    try {
      const order = await orderService.getById(req.user.id, req.params.id, false);
      res.status(200).json({ status: 'success', data: order });
    } catch (e) {
      next(e);
    }
  }

  // PUBLIC_INTERFACE
  async cancel(req, res, next) {
    /** Cancel order */
    try {
      const order = await orderService.cancel(req.user.id, req.params.id);
      res.status(200).json({ status: 'success', data: order });
    } catch (e) {
      next(e);
    }
  }

  // PUBLIC_INTERFACE
  async requestReturn(req, res, next) {
    /** Request return */
    try {
      const order = await orderService.requestReturn(req.user.id, req.params.id);
      res.status(200).json({ status: 'success', data: order });
    } catch (e) {
      next(e);
    }
  }

  // PUBLIC_INTERFACE
  async adminList(req, res, next) {
    /** Admin list orders */
    try {
      const items = await orderService.list(null, true);
      res.status(200).json({ status: 'success', data: items });
    } catch (e) {
      next(e);
    }
  }

  // PUBLIC_INTERFACE
  async adminUpdateStatus(req, res, next) {
    /** Admin update order status */
    try {
      const order = await orderService.updateStatusAdmin(req.params.id, req.body.status);
      res.status(200).json({ status: 'success', data: order });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new OrderController();
