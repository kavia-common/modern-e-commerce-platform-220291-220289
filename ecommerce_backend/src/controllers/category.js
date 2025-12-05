'use strict';

const categoryService = require('../services/category');

class CategoryController {
  // PUBLIC_INTERFACE
  async create(req, res, next) {
    /** Create category */
    try {
      const cat = await categoryService.create(req.body);
      res.status(201).json({ status: 'success', data: cat });
    } catch (e) {
      next(e);
    }
  }

  // PUBLIC_INTERFACE
  async update(req, res, next) {
    /** Update category */
    try {
      const cat = await categoryService.update(req.params.id, req.body);
      res.status(200).json({ status: 'success', data: cat });
    } catch (e) {
      next(e);
    }
  }

  // PUBLIC_INTERFACE
  async remove(req, res, next) {
    /** Remove category */
    try {
      const out = await categoryService.remove(req.params.id);
      res.status(200).json({ status: 'success', data: out });
    } catch (e) {
      next(e);
    }
  }

  // PUBLIC_INTERFACE
  async list(req, res, next) {
    /** List categories */
    try {
      const items = await categoryService.list();
      res.status(200).json({ status: 'success', data: items });
    } catch (e) {
      next(e);
    }
  }

  // PUBLIC_INTERFACE
  async tree(req, res, next) {
    /** Category tree */
    try {
      const t = await categoryService.tree();
      res.status(200).json({ status: 'success', data: t });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new CategoryController();
