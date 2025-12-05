'use strict';

const request = require('supertest');
const app = require('../src/app');
const Category = require('../src/models/Category');
const Product = require('../src/models/Product');

async function createUserAndToken() {
  const email = `buyer${Date.now()}@example.com`;
  const password = 'password123';
  const name = 'Buyer User';
  const reg = await request(app).post('/api/v1/auth/register').send({ email, password, name });
  return reg.body.data.tokens.accessToken;
}

describe('Cart and Order flows', () => {
  let token;
  let product;

  beforeAll(async () => {
    token = await createUserAndToken();
    const cat = await Category.create({ name: 'Books', slug: `books-${Date.now()}` });
    product = await Product.create({
      title: 'Test Book',
      slug: `test-book-${Date.now()}`,
      category: cat._id,
      price: 499,
      stock: 5,
    });
  });

  it('should add to cart', async () => {
    const res = await request(app)
      .post('/api/v1/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: String(product._id), qty: 2 });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.items.length).toBeGreaterThan(0);
  });

  it('should create COD order', async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ method: 'COD' });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.order).toBeDefined();
    expect(res.body.data.order.payment.method).toBe('COD');
  });
});
