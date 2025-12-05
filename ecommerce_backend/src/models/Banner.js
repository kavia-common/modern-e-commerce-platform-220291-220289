'use strict';

const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema(
  {
    title: { type: String },
    image: { type: String },
    link: { type: String },
    isActive: { type: Boolean, default: true },
    position: { type: String, enum: ['HOME_TOP', 'HOME_MIDDLE', 'HOME_BOTTOM'], default: 'HOME_TOP' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Banner', BannerSchema);
