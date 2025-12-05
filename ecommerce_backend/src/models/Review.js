'use strict';

const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', index: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', ReviewSchema);
