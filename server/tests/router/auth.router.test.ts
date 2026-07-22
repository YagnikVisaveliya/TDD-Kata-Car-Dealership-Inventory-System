import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import request from 'supertest'
import { app } from '../../src/app.js'
import { prisma } from '../../src/config/prisma.js';

describe('POST /api/auth/register', () => {
    const testEmail = 'router-test@example.com';

    before(async () => {
        // Clean up the test user if it exists before running tests
        await prisma.user.deleteMany({ where: { email: testEmail } });
    });

    after(async () => {
        // Clean up the test user after tests
        await prisma.user.deleteMany({ where: { email: testEmail } });
        await prisma.$disconnect();
    });

    test('should register a new user successfully', async () => {
        const response = await request(app)
            .post('/api/v1/auth/register')
            .send({
                name: 'Router Test User',
                email: testEmail,
                password: 'plainPassword123'
        });
            
        assert.strictEqual(response.status, 201);
        assert.strictEqual(response.body.success, true);
        assert.strictEqual(response.body.data.email, testEmail);
        assert.strictEqual(response.body.data.password, undefined); // Ensure password is not returned

    });

    test('return 400 when email already exists', async () => {

        await request(app).post('/api/v1/auth/register').send({
            name: 'Router Test',
            email: testEmail,
            password: 'validPassword123',
        });

        const response = await request(app)
            .post('/api/v1/auth/register')
            .send({
                name: 'Router Test User',
                email: testEmail,
                password: 'plainPassword123'
            });

        assert.strictEqual(response.status, 400);
        assert.strictEqual(response.body.success, false);
    });

    test('returns 400 when password is too short', async () => {
    const response = await request(app).post('/api/v1/auth/register').send({
      name: 'Router Test',
      email: 'short-pass@example.com',
      password: 'short1',
    });

    assert.strictEqual(response.status, 400);
    assert.strictEqual(response.body.success, false);
  });
});

describe('POST /api/auth/login', () => {
  const testEmail = 'login-router-test@example.com';
  const testPassword = 'validPassword123';

  before(async () => {
    await prisma.user.deleteMany({ where: { email: testEmail } });

    await request(app).post('/api/v1/auth/register').send({
      name: 'Login Router Test',
      email: testEmail,
      password: testPassword,
    });
  });

  after(async () => {
    await prisma.user.deleteMany({ where: { email: testEmail } });
    await prisma.$disconnect();
  });

  test('returns 200 with token when credentials are correct', async () => {
    const response = await request(app).post('/api/v1/auth/login').send({
      email: testEmail,
      password: testPassword,
    });

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.success, true);
    assert.ok(response.body.data.token);
    assert.strictEqual(response.body.data.user.email, testEmail);
  });

  test('returns 400 when password is incorrect', async () => {
    const response = await request(app).post('/api/v1/auth/login').send({
      email: testEmail,
      password: 'wrongPassword',
    });

    assert.strictEqual(response.status, 400);
    assert.strictEqual(response.body.success, false);
  });

  test('returns 400 when email does not exist', async () => {
    const response = await request(app).post('/api/v1/auth/login').send({
      email: 'nonexistent@example.com',
      password: 'anyPassword123',
    });

    assert.strictEqual(response.status, 400);
    assert.strictEqual(response.body.success, false);
  });
});
