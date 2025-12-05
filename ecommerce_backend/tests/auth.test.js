'use strict';

const request = require('supertest');
const app = require('../src/app');

describe('Auth endpoints', () => {
  it('should register and login a user', async () => {
    const email = `user${Date.now()}@example.com`;
    const password = 'password123';
    const name = 'Test User';

    const reg = await request(app).post('/api/v1/auth/register').send({ email, password, name });
    expect(reg.statusCode).toBe(201);
    expect(reg.body.data.user.email).toBe(email);
    expect(reg.body.data.tokens.accessToken).toBeDefined();

    const login = await request(app).post('/api/v1/auth/login').send({ email, password });
    expect(login.statusCode).toBe(200);
    expect(login.body.data.tokens.accessToken).toBeDefined();
  });
});
