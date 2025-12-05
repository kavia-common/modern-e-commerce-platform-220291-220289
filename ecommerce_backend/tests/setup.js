'use strict';

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { connectDB } = require('../src/config/db');
const config = require('../src/config/env');
const { ensureAllIndexes } = require('../src/utils/seed');
const Category = require('../src/models/Category');
const Product = require('../src/models/Product');

let mongoServer;

// Spin up in-memory MongoDB for tests and seed minimal data
beforeAll(async () => {
  // Force test environment for app behavior
  process.env.NODE_ENV = 'test';

  mongoServer = await MongoMemoryServer.create({
    instance: {
      dbName: 'ecommerce_test',
    },
  });
  const uri = mongoServer.getUri();
  // Override env-configured URI for this process
  process.env.MONGODB_URI = uri;
  // connect using app's connectDB which reads config.MONGODB_URI
  await connectDB();

  // Ensure indexes are in place to minimize warnings
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

afterAll(async () => {
  await mongoose.connection.close();
  if (mongoServer) {
    await mongoServer.stop();
  }
});
