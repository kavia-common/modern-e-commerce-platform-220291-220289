'use strict';

const Joi = require('joi');
const Product = require('../models/Product');

const createSchema = Joi.object({
  title: Joi.string().required(),
  slug: Joi.string().required(),
  description: Joi.string().allow('', null),
  images: Joi.array().items(Joi.string()).default([]),
  category: Joi.string().required(),
  brand: Joi.string().allow('', null),
  tags: Joi.array().items(Joi.string()).default([]),
  price: Joi.number().min(0).required(),
  mrp: Joi.number().min(0).default(0),
  stock: Joi.number().min(0).default(0),
});

// PUBLIC_INTERFACE
async function create(payload) {
  /** Create product (admin) */
  const { value, error } = createSchema.validate(payload);
  if (error) throw new Error(error.details[0].message);
  const prod = await Product.create(value);
  return prod;
}

// PUBLIC_INTERFACE
async function update(id, payload) {
  /** Update product (admin) */
  const updated = await Product.findByIdAndUpdate(id, payload, { new: true });
  if (!updated) {
    const err = new Error('Product not found');
    err.status = 404;
    throw err;
  }
  return updated;
}

// PUBLIC_INTERFACE
async function remove(id) {
  /** Delete product (admin) */
  const del = await Product.findByIdAndDelete(id);
  if (!del) {
    const err = new Error('Product not found');
    err.status = 404;
    throw err;
  }
  return { ok: true };
}

// PUBLIC_INTERFACE
async function getById(id) {
  /** Get product detail */
  const prod = await Product.findById(id).populate('category');
  if (!prod) {
    const err = new Error('Product not found');
    err.status = 404;
    throw err;
  }
  return prod;
}

// PUBLIC_INTERFACE
async function listPublic({ q, category, brand, minPrice, maxPrice, sort = 'new' , page = 1, limit = 20 }) {
  /** Public listing with filters and sorting */
  const filter = { isActive: true };
  if (q) {
    filter.$text = { $search: q };
  }
  if (category) filter.category = category;
  if (brand) filter.brand = brand;
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
    if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
  }
  const sortMap = {
    new: { createdAt: -1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    popularity: { ratingCount: -1 },
  };
  const sortBy = sortMap[sort] || sortMap.new;

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Product.find(filter).sort(sortBy).skip(skip).limit(Number(limit)),
    Product.countDocuments(filter),
  ]);

  return { items, total, page: Number(page), limit: Number(limit) };
}

module.exports = {
  create,
  update,
  remove,
  getById,
  listPublic,
};
