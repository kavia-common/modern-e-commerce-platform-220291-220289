'use strict';

const mongoose = require('mongoose');

const VariantSchema = new mongoose.Schema(
  {
    sku: { type: String, trim: true },
    attributes: { type: Map, of: String }, // size, color, etc.
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, min: 0 },
    stock: { type: Number, default: 0 },
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, index: 'text' },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String },
    specs: { type: Map, of: String },
    images: { type: [String], default: [] },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', index: true },
    brand: { type: String, index: true },
    tags: { type: [String], index: true },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, min: 0 },
    stock: { type: Number, default: 0 },
    variants: { type: [VariantSchema], default: [] },
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ProductSchema.index({ title: 'text', brand: 'text', tags: 'text' });

module.exports = mongoose.model('Product', ProductSchema);
