import { describe, test, before, after } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import { app } from '../../src/app.js';
import { prisma } from '../../src/config/prisma.js';

describe('Vehicle routes', () => {
  let token: string;
  const testEmail = 'vehicle-router-test@example.com';

  before(async () => {
    await prisma.user.deleteMany({ where: { email: testEmail } });
    await prisma.vehicle.deleteMany({ where: { make: 'RouterTestMake' } });

    await request(app).post('/api/v1/auth/register').send({
      name: 'Vehicle Router Test',
      email: testEmail,
      password: 'validPassword123',
    });

    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: testEmail,
      password: 'validPassword123',
    });

    token = loginRes.body.data.token;
  });

  after(async () => {
    await prisma.vehicle.deleteMany({ where: { make: 'RouterTestMake' } });
    await prisma.user.deleteMany({ where: { email: testEmail } });
    await prisma.$disconnect();
  });

  test('POST /api/v1/vehicles creates a vehicle when authenticated', async () => {
    const response = await request(app)
      .post('/api/v1/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .send({ make: 'RouterTestMake', model: 'Corolla', category: 'Sedan', price: 22000, quantity: 5 });

    assert.strictEqual(response.status, 201);
    assert.strictEqual(response.body.data.make, 'RouterTestMake');
  });

  test('POST /api/v1/vehicles returns 401 when no token is provided', async () => {
    const response = await request(app)
      .post('/api/v1/vehicles')
      .send({ make: 'RouterTestMake', model: 'Corolla', category: 'Sedan', price: 22000, quantity: 5 });

    assert.strictEqual(response.status, 401);
  });

  test('GET /api/v1/vehicles returns list when authenticated', async () => {
    const response = await request(app)
      .get('/api/v1/vehicles')
      .set('Authorization', `Bearer ${token}`);

    assert.strictEqual(response.status, 200);
    assert.ok(Array.isArray(response.body.data));
  });

  test('GET /api/v1/vehicles returns 401 when no token is provided', async () => {
    const response = await request(app).get('/api/v1/vehicles');

    assert.strictEqual(response.status, 401);
  });
});