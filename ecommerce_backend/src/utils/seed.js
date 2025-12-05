'use strict';

const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const User = require('../models/User');
const { hashPassword } = require('./passwords');

/**
 * Ensure indexes for all registered models. Safe no-op if already in sync.
 */
async function ensureAllIndexes() {
  const modelNames = mongoose.modelNames();
  for (const name of modelNames) {
    try {
      await mongoose.model(name).syncIndexes();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(`Index sync failed for model ${name}:`, e.message);
    }
  }
}

/**
 * PUBLIC_INTERFACE
 * Seed minimal data for development: a couple of categories, one product, one admin user, and a coupon.
 * Idempotent: uses upserts to avoid duplicates on repeated runs.
 */
async function seedMinimal() {
  /** Insert minimal development data to enable end-to-end flows */
  // Categories
  const catRoot = await Category.findOneAndUpdate(
    { slug: 'root' },
    { $set: { name: 'Root', slug: 'root', isActive: true } },
    { upsert: true, new: true }
  );
  const catElectronics = await Category.findOneAndUpdate(
    { slug: 'electronics' },
    { $set: { name: 'Electronics', slug: 'electronics', parent: catRoot._id, isActive: true } },
    { upsert: true, new: true }
  );

  // Product
  const product = await Product.findOneAndUpdate(
    { slug: 'sample-phone' },
    {
      $setOnInsert: {
        title: 'Sample Phone',
        slug: 'sample-phone',
        description: 'A sample smartphone for demo',
        images: [],
        category: catElectronics._id,
        brand: 'DemoBrand',
        tags: ['phone', 'demo'],
        price: 9999,
        mrp: 12999,
        stock: 25,
        variants: [
          { sku: 'SMPH-BLK-64', attributes: { color: 'black', storage: '64GB' }, price: 9999, mrp: 12999, stock: 10 },
          { sku: 'SMPH-BLU-128', attributes: { color: 'blue', storage: '128GB' }, price: 10999, mrp: 13999, stock: 15 },
        ],
        rating: 0,
        ratingCount: 0,
        isActive: true,
      },
    },
    { upsert: true, new: true }
  );

  // Admin user
  const adminEmail = 'admin@example.com';
  const adminPassword = 'admin123'; // dev only
  await User.findOneAndUpdate(
    { email: adminEmail },
    {
      $setOnInsert: {
        name: 'Admin',
        email: adminEmail,
        passwordHash: hashPassword(adminPassword),
        roles: ['admin'],
        isActive: true,
      },
    },
    { upsert: true, new: true }
  );

  // Coupon
  await Coupon.findOneAndUpdate(
    { code: 'WELCOME10' },
    {
      $setOnInsert: {
        code: 'WELCOME10',
        description: '10% off for new users',
        type: 'percent',
        value: 10,
        minOrder: 0,
        maxDiscount: 500,
        usageLimit: 0,
        isActive: true,
      },
    },
    { upsert: true, new: true }
  );

  // Ensure indexes after data existence
  await ensureAllIndexes();

  return {
    ok: true,
    seeded: {
      categories: ['root', 'electronics'],
      product: product.slug,
      admin: adminEmail,
      coupon: 'WELCOME10',
    },
  };
}

module.exports = {
  seedMinimal,
  ensureAllIndexes,
};
