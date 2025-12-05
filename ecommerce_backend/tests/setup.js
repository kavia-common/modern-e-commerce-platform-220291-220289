'use strict';

const mongoose = require('mongoose');
const { connectDB } = require('../src/config/db');

// Ensure DB connection once for tests
beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.close();
});
