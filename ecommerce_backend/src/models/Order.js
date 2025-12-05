'use strict';

const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    title: { type: String, required: true },
    variantSku: { type: String },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    items: { type: [OrderItemSchema], default: [] },
    addressSnapshot: {
      type: Object,
    },
    totals: {
      subTotal: { type: Number, required: true },
      discount: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      delivery: { type: Number, default: 0 },
      grandTotal: { type: Number, required: true },
    },
    coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon', default: null },
    payment: {
      method: { type: String, enum: ['COD', 'PREPAID'], required: true },
      provider: { type: String, default: null }, // Stripe/Razorpay placeholder
      status: { type: String, enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'], default: 'PENDING' },
      reference: { type: String }, // payment id / session id
    },
    status: {
      type: String,
      enum: ['PLACED', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURN_REQUESTED', 'RETURNED'],
      default: 'PLACED',
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
