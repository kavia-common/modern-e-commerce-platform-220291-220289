'use strict';

const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variantSku: { type: String },
    qty: { type: Number, required: true, min: 1 },
    priceAtAdd: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const CartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, index: true },
    items: { type: [CartItemSchema], default: [] },
    coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon', default: null },
    totals: {
      subTotal: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      delivery: { type: Number, default: 0 },
      grandTotal: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cart', CartSchema);
