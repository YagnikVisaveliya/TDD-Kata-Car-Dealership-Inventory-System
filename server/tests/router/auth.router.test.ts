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
});