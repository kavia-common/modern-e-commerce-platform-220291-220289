'use strict';

const productService = require('../services/product');

class ProductController {
  // PUBLIC_INTERFACE
  async create(req, res, next) {
    /** Create product */
    try {
      const prod = await productService.create(req.body);
      res.status(201).json({ status: 'success', data: prod });
    } catch (e) {
      next(e);
    }
  }

  // PUBLIC_INTERFACE
  async update(req, res, next) {
    /** Update product */
    try {
      const prod = await productService.update(req.params.id, req.body);
      res.status(200).json({ status: 'success', data: prod });
    } catch (e) {
      next(e);
    }
  }

  // PUBLIC_INTERFACE
  async remove(req, res, next) {
    /** Remove product */
    try {
      const out = await productService.remove(req.params.id);
      res.status(200).json({ status: 'success', data: out });
    } catch (e) {
      next(e);
    }
  }

  // PUBLIC_INTERFACE
  async get(req, res, next) {
    /** Get product detail */
    try {
      const prod = await productService.getById(req.params.id);
      res.status(200).json({ status: 'success', data: prod });
    } catch (e) {
      next(e);
    }
  }

  // PUBLIC_INTERFACE
  async list(req, res, next) {
    /** Public listing with filters */
    try {
      const list = await productService.listPublic(req.query);
      res.status(200).json({ status: 'success', data: list });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ProductController();
