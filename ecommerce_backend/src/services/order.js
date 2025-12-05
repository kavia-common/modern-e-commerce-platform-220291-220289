'use strict';

const Joi = require('joi');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Coupon = require('../models/Coupon');
const Product = require('../models/Product');
const { createPaymentSession } = require('../utils/payment');

const createSchema = Joi.object({
  method: Joi.string().valid('COD', 'PREPAID').required(),
  addressId: Joi.string().allow('', null),
});

// PUBLIC_INTERFACE
async function create(userId, payload) {
  /** Create order: from cart; supports COD or PREPAID placeholder */
  const { value, error } = createSchema.validate(payload);
  if (error) throw new Error(error.details[0].message);

  const cart = await Cart.findOne({ user: userId }).populate('items.product').populate('coupon');
  if (!cart || cart.items.length === 0) {
    const err = new Error('Cart is empty');
    err.status = 400;
    throw err;
  }

  // Recompute totals just in case
  const items = cart.items.map((it) => ({
    product: it.product._id,
    title: it.product.title,
    variantSku: it.variantSku || null,
    qty: it.qty,
    price: it.priceAtAdd,
    subtotal: it.qty * it.priceAtAdd,
  }));

  const totals = cart.totals;
  const coupon = cart.coupon ? await Coupon.findById(cart.coupon) : null;

  const order = await Order.create({
    user: userId,
    items,
    addressSnapshot: {}, // placeholder; address mgmt not implemented
    totals,
    coupon: coupon ? coupon._id : null,
    payment: {
      method: value.method,
      provider: value.method === 'PREPAID' ? 'mock' : null,
      status: value.method === 'COD' ? 'PENDING' : 'PENDING',
      reference: null,
    },
    status: 'PLACED',
  });

  // Decrement stock (basic rule)
  for (const it of cart.items) {
    await Product.findByIdAndUpdate(it.product._id, { $inc: { stock: -it.qty } });
  }

  // Clear cart
  cart.items = [];
  cart.coupon = null;
  cart.totals = { subTotal: 0, discount: 0, tax: 0, delivery: 0, grandTotal: 0 };
  await cart.save();

  let paymentSession = null;
  if (value.method === 'PREPAID') {
    paymentSession = await createPaymentSession({
      amount: order.totals.grandTotal,
      currency: 'INR',
      provider: 'mock',
      metadata: { orderId: String(order._id) },
    });
    order.payment.provider = paymentSession.provider;
    order.payment.reference = paymentSession.id;
    await order.save();
  }

  return { order, paymentSession };
}

// PUBLIC_INTERFACE
async function list(userId, filterAdmin = false) {
  /** List orders; admin sees all, users see own */
  const filter = filterAdmin ? {} : { user: userId };
  return Order.find(filter).sort({ createdAt: -1 });
}

// PUBLIC_INTERFACE
async function getById(userId, id, admin = false) {
  /** Get order detail */
  const order = await Order.findById(id);
  if (!order) {
    const err = new Error('Order not found');
    err.status = 404;
    throw err;
  }
  if (!admin && String(order.user) !== String(userId)) {
    const err = new Error('Forbidden');
    err.status = 403;
    throw err;
  }
  return order;
}

// PUBLIC_INTERFACE
async function updateStatusAdmin(id, status) {
  /** Admin update order status */
  const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
  if (!order) {
    const err = new Error('Order not found');
    err.status = 404;
    throw err;
  }
  return order;
}

// PUBLIC_INTERFACE
async function cancel(userId, id) {
  /** User cancellation basic rule: allow when not shipped/delivered */
  const order = await Order.findById(id);
  if (!order) {
    const err = new Error('Order not found');
    err.status = 404;
    throw err;
  }
  if (String(order.user) !== String(userId)) {
    const err = new Error('Forbidden');
    err.status = 403;
    throw err;
  }
  if (['SHIPPED', 'DELIVERED'].includes(order.status)) {
    const err = new Error('Cannot cancel at this stage');
    err.status = 400;
    throw err;
  }
  order.status = 'CANCELLED';
  await order.save();
  return order;
}

// PUBLIC_INTERFACE
async function requestReturn(userId, id) {
  /** User return request basic rule: allow when delivered */
  const order = await Order.findById(id);
  if (!order) {
    const err = new Error('Order not found');
    err.status = 404;
    throw err;
  }
  if (String(order.user) !== String(userId)) {
    const err = new Error('Forbidden');
    err.status = 403;
    throw err;
  }
  if (order.status !== 'DELIVERED') {
    const err = new Error('Return allowed only after delivery');
    err.status = 400;
    throw err;
  }
  order.status = 'RETURN_REQUESTED';
  await order.save();
  return order;
}

module.exports = {
  create,
  list,
  getById,
  updateStatusAdmin,
  cancel,
  requestReturn,
};
