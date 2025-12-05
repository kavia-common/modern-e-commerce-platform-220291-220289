'use strict';

const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    icon: { type: String },
    banner: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

CategorySchema.index({ slug: 1 }, { unique: true });

module.exports = mongoose.model('Category', CategorySchema);
