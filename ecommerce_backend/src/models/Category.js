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

// Rely on the 'unique: true' in schema path for slug to create the index via syncIndexes()

module.exports = mongoose.model('Category', CategorySchema);
