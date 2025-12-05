'use strict';

const Joi = require('joi');
const Category = require('../models/Category');

const createSchema = Joi.object({
  name: Joi.string().required(),
  slug: Joi.string().required(),
  parent: Joi.string().allow(null),
  icon: Joi.string().allow('', null),
  banner: Joi.string().allow('', null),
  isActive: Joi.boolean().default(true),
});

const updateSchema = Joi.object({
  name: Joi.string(),
  slug: Joi.string(),
  parent: Joi.string().allow(null),
  icon: Joi.string().allow('', null),
  banner: Joi.string().allow('', null),
  isActive: Joi.boolean(),
});

// PUBLIC_INTERFACE
async function create(payload) {
  /** Create category (admin) */
  const { value, error } = createSchema.validate(payload);
  if (error) throw new Error(error.details[0].message);
  const cat = await Category.create(value);
  return cat;
}

// PUBLIC_INTERFACE
async function update(id, payload) {
  /** Update category (admin) */
  const { value, error } = updateSchema.validate(payload);
  if (error) throw new Error(error.details[0].message);
  const updated = await Category.findByIdAndUpdate(id, value, { new: true });
  if (!updated) {
    const err = new Error('Category not found');
    err.status = 404;
    throw err;
  }
  return updated;
}

// PUBLIC_INTERFACE
async function remove(id) {
  /** Delete category (admin) */
  const del = await Category.findByIdAndDelete(id);
  if (!del) {
    const err = new Error('Category not found');
    err.status = 404;
    throw err;
  }
  return { ok: true };
}

// PUBLIC_INTERFACE
async function list() {
  /** List all active categories */
  return Category.find({ isActive: true });
}

// PUBLIC_INTERFACE
async function tree() {
  /** Build hierarchical category tree */
  const cats = await Category.find({ isActive: true }).lean();
  const byId = new Map(cats.map((c) => [String(c._id), { ...c, children: [] }]));
  const roots = [];
  for (const c of byId.values()) {
    if (c.parent) {
      const parent = byId.get(String(c.parent));
      if (parent) parent.children.push(c);
      else roots.push(c);
    } else {
      roots.push(c);
    }
  }
  return roots;
}

module.exports = {
  create,
  update,
  remove,
  list,
  tree,
};
