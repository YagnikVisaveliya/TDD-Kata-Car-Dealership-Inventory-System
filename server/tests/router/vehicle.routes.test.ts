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

    await request(app).post('/api/auth/register').send({
      name: 'Vehicle Router Test',
      email: testEmail,
      password: 'validPassword123',
    });

    const loginRes = await request(app).post('/api/auth/login').send({
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

  test('POST /api/vehicles creates a vehicle when authenticated', async () => {
    const response = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .send({ make: 'RouterTestMake', model: 'Corolla', category: 'Sedan', price: 22000, quantity: 5 });

    assert.strictEqual(response.status, 201);
    assert.strictEqual(response.body.data.make, 'RouterTestMake');
  });

  test('POST /api/vehicles returns 401 when no token is provided', async () => {
    const response = await request(app)
      .post('/api/vehicles')
      .send({ make: 'RouterTestMake', model: 'Corolla', category: 'Sedan', price: 22000, quantity: 5 });

    assert.strictEqual(response.status, 401);
  });

  test('GET /api/vehicles returns list when authenticated', async () => {
    const response = await request(app)
      .get('/api/vehicles')
      .set('Authorization', `Bearer ${token}`);

    assert.strictEqual(response.status, 200);
    assert.ok(Array.isArray(response.body.data));
  });

  test('GET /api/vehicles returns 401 when no token is provided', async () => {
    const response = await request(app).get('/api/vehicles');

    assert.strictEqual(response.status, 401);
  });

  test('GET /api/vehicles/search filters by make', async () => {
    await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${token}`)
        .send({ make: 'RouterTestMake', model: 'SearchModel', category: 'SUV', price: 30000, quantity: 2 });

  const response = await request(app)
    .get('/api/vehicles/search?make=RouterTestMake')
    .set('Authorization', `Bearer ${token}`);

    assert.strictEqual(response.status, 200);
    assert.ok(response.body.data.length >= 1);
    assert.strictEqual(response.body.data[0].make, 'RouterTestMake');
    });

    test('GET /api/vehicles/search returns 401 when no token is provided', async () => {
    const response = await request(app).get('/api/vehicles/search?make=RouterTestMake');

    assert.strictEqual(response.status, 401);
    });

    test('GET /api/vehicles/search returns 400 for invalid price filter', async () => {
    const response = await request(app)
        .get('/api/vehicles/search?minPrice=notanumber')
        .set('Authorization', `Bearer ${token}`);

    assert.strictEqual(response.status, 400);
  });
  describe('PUT and DELETE /api/vehicles/:id', () => {
    let vehicleId: string;
    let adminToken: string;
    const adminEmail = 'vehicle-admin-test@example.com';

    before(async () => {
      const createRes = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${token}`)
        .send({ make: 'RouterTestMake', model: 'OriginalModel', category: 'Sedan', price: 20000, quantity: 5 });

      vehicleId = createRes.body.data.id;

      await prisma.user.deleteMany({ where: { email: adminEmail } });
      await request(app).post('/api/auth/register').send({
        name: 'Admin Test',
        email: adminEmail,
        password: 'validPassword123',
      });
      await prisma.user.update({ where: { email: adminEmail }, data: { role: 'ADMIN' } });

      const adminLoginRes = await request(app).post('/api/auth/login').send({
        email: adminEmail,
        password: 'validPassword123',
      });
      adminToken = adminLoginRes.body.data.token;
    });

    after(async () => {
      await prisma.user.deleteMany({ where: { email: adminEmail } });
    });

    test('PUT /api/vehicles/:id updates a vehicle when authenticated', async () => {
      const response = await request(app)
        .put(`/api/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ make: 'UpdatedMake', model: 'UpdatedModel', category: 'UpdatedCategory', price: 25000, quantity: 10 });

      assert.strictEqual(response.status, 200);
      assert.strictEqual(response.body.data.make, 'UpdatedMake');
    });

    test('PUT /api/vehicles/:id returns 401 when no token is provided', async () => {
      const response = await request(app)
        .put(`/api/vehicles/${vehicleId}`)
        .send({ make: 'UpdatedMake' });

      assert.strictEqual(response.status, 401);
    });

    test('DELETE /api/vehicles/:id returns 403 when user is not admin', async () => {
      const response = await request(app)
        .delete(`/api/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${token}`);

      assert.strictEqual(response.status, 403);
    });

    test('DELETE /api/vehicles/:id deletes a vehicle when authenticated as admin', async () => {
      const response = await request(app)
        .delete(`/api/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      assert.strictEqual(response.status, 200);
    });

    test('DELETE /api/vehicles/:id returns 401 when no token is provided', async () => {
      const response = await request(app).delete(`/api/vehicles/${vehicleId}`);

      assert.strictEqual(response.status, 401);
    });
  });
});