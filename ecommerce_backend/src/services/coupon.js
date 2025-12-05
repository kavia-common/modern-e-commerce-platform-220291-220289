'use strict';

const Joi = require('joi');
const Coupon = require('../models/Coupon');

const createSchema = Joi.object({
  code: Joi.string().required(),
  description: Joi.string().allow('', null),
  type: Joi.string().valid('percent', 'amount').required(),
  value: Joi.number().min(0).required(),
  minOrder: Joi.number().min(0).default(0),
  maxDiscount: Joi.number().min(0).default(0),
  usageLimit: Joi.number().min(0).default(0),
  startsAt: Joi.date().allow(null),
  endsAt: Joi.date().allow(null),
  isActive: Joi.boolean().default(true),
});

// PUBLIC_INTERFACE
async function create(payload) {
  /** Create coupon (admin) */
  const { value, error } = createSchema.validate(payload);
  if (error) throw new Error(error.details[0].message);
  const coupon = await Coupon.create(value);
  return coupon;
}

// PUBLIC_INTERFACE
async function list() {
  /** List coupons (admin) */
  return Coupon.find();
}

// PUBLIC_INTERFACE
async function remove(id) {
  /** Remove coupon (admin) */
  const del = await Coupon.findByIdAndDelete(id);
  if (!del) {
    const err = new Error('Coupon not found');
    err.status = 404;
    throw err;
  }
  return { ok: true };
}

// PUBLIC_INTERFACE
async function validateCode(code) {
  /** Validate coupon for public usage */
  const coupon = await Coupon.findOne({ code: String(code || '').toUpperCase(), isActive: true });
  if (!coupon) {
    const err = new Error('Invalid coupon');
    err.status = 400;
    throw err;
  }
  return coupon;
}

module.exports = { create, list, remove, validateCode };
