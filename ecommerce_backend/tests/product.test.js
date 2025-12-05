'use strict';

const request = require('supertest');
const app = require('../src/app');
const Category = require('../src/models/Category');
const Product = require('../src/models/Product');

describe('Product listing', () => {
  beforeAll(async () => {
    // seed one product
    const cat = await Category.create({ name: 'Electronics', slug: `electronics-${Date.now()}` });
    await Product.create({
      title: 'Test Phone',
      slug: `test-phone-${Date.now()}`,
      category: cat._id,
      price: 9999,
      stock: 10,
    });
  });

  it('should list products', async () => {
    const res = await request(app).get('/api/v1/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data.items)).toBe(true);
  });
});
