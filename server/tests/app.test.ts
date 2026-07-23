import { test } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import { app } from '../src/app.js';

test('GET /health returns 200 with status ok', async () => {
  const response = await request(app).get('/health');

  assert.strictEqual(response.status, 200);
  assert.deepStrictEqual(response.body, { status: 'Good' });
});

test('OPTIONS requests receive CORS headers', async () => {
  const response = await request(app)
    .options('/api/auth/register')
    .set('Origin', 'http://localhost:5173')
    .set('Access-Control-Request-Method', 'POST')
    .set('Access-Control-Request-Headers', 'content-type');

  assert.strictEqual(response.status, 204);
  assert.strictEqual(response.headers['access-control-allow-origin'], '*');
  assert.match(response.headers['access-control-allow-methods'], /POST/);
  assert.match(response.headers['access-control-allow-headers'], /Content-Type/i);
});