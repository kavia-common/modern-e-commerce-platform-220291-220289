'use strict';

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { connectDB } = require('../src/config/db');
const { ensureAllIndexes } = require('../src/utils/seed');
const Category = require('../src/models/Category');
const Product = require('../src/models/Product');

let mongoServer;

// Ensure test env very early, before any app modules use env/config
process.env.NODE_ENV = 'test';

// Spin up in-memory MongoDB for tests and seed minimal data
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({
    instance: {
      dbName: 'ecommerce_test',
    },
  });
  const uri = mongoServer.getUri();
  // Override env-configured URI for this process BEFORE connecting
  process.env.MONGODB_URI = uri;

  await connectDB();

  await ensureAllIndexes();

  // Seed a basic category and product for listing/cart tests
  const cat = await Category.create({
    name: 'TestCat',
    slug: `testcat-${Date.now()}`,
    isActive: true,
  });
  await Product.create({
    title: 'Seeded Test Product',
    slug: `seeded-prod-${Date.now()}`,
    category: cat._id,
    price: 1999,
    stock: 50,
    isActive: true,
  });
}, 120000);

// Clean between test files to mitigate index name collisions
afterEach(async () => {
  // Drop all non-system collections
  const collections = await mongoose.connection.db.collections();
  for (const coll of collections) {
    if (!coll.collectionName.startsWith('system.')) {
      try {
        await coll.deleteMany({});
      } catch (_) {
        // ignore
      }
    }
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  if (mongoServer) {
    await mongoServer.stop();
  }
});
