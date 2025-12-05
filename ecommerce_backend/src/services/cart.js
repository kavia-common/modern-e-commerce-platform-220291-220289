'use strict';

const Joi = require('joi');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const { computeTotals } = require('../utils/totals');

const addSchema = Joi.object({
  productId: Joi.string().required(),
  qty: Joi.number().integer().min(1).required(),
});

const updateSchema = Joi.object({
  productId: Joi.string().required(),
  qty: Joi.number().integer().min(0).required(),
});

// PUBLIC_INTERFACE
async function getCart(userId) {
  /** Get or create cart for user */
  let cart = await Cart.findOne({ user: userId }).populate('items.product').populate('coupon');
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
}

// PUBLIC_INTERFACE
async function addItem(userId, payload) {
  /** Add item to cart */
  const { value, error } = addSchema.validate(payload);
  if (error) throw new Error(error.details[0].message);

  const product = await Product.findById(value.productId);
  if (!product || !product.isActive) {
    const err = new Error('Product not available');
    err.status = 404;
    throw err;
  }
  let cart = await getCart(userId);
  const existing = cart.items.find((it) => String(it.product) === String(product._id));
  if (existing) {
    existing.qty += value.qty;
  } else {
    cart.items.push({
      product: product._id,
      qty: value.qty,
      priceAtAdd: product.price,
    });
  }

  const totals = computeTotals({
    items: cart.items.map((i) => ({ price: i.priceAtAdd, qty: i.qty })),
    coupon: cart.coupon,
  });
  cart.totals = totals;

  await cart.save();
  return cart;
}

// PUBLIC_INTERFACE
async function updateItem(userId, payload) {
  /** Update item qty or remove when qty=0 */
  const { value, error } = updateSchema.validate(payload);
  if (error) throw new Error(error.details[0].message);

  const cart = await getCart(userId);
  const idx = cart.items.findIndex((it) => String(it.product) === String(value.productId));
  if (idx === -1) {
    const err = new Error('Item not in cart');
    err.status = 404;
    throw err;
  }
  if (value.qty === 0) {
    cart.items.splice(idx, 1);
  } else {
    cart.items[idx].qty = value.qty;
  }

  const totals = computeTotals({
    items: cart.items.map((i) => ({ price: i.priceAtAdd, qty: i.qty })),
    coupon: cart.coupon,
  });
  cart.totals = totals;
  await cart.save();
  return cart;
}

// PUBLIC_INTERFACE
async function applyCoupon(userId, code) {
  /** Apply coupon code to cart */
  const cart = await getCart(userId);
  const coupon = await Coupon.findOne({ code: String(code || '').toUpperCase(), isActive: true });
  if (!coupon) {
    const err = new Error('Invalid coupon');
    err.status = 400;
    throw err;
  }
  // usage/time windows basic checks
  if (coupon.startsAt && coupon.startsAt > new Date()) {
    const err = new Error('Coupon not started');
    err.status = 400;
    throw err;
  }
  if (coupon.endsAt && coupon.endsAt < new Date()) {
    const err = new Error('Coupon expired');
    err.status = 400;
    throw err;
  }
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    const err = new Error('Coupon usage limit reached');
    err.status = 400;
    throw err;
  }

  cart.coupon = coupon._id;
  const totals = computeTotals({
    items: cart.items.map((i) => ({ price: i.priceAtAdd, qty: i.qty })),
    coupon,
  });
  cart.totals = totals;
  await cart.save();
  return cart;
}

module.exports = {
  getCart,
  addItem,
  updateItem,
  applyCoupon,
};
