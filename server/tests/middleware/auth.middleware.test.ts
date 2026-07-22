import { describe, test, mock } from 'node:test';
import assert from 'node:assert';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../../src/middleware/auth.middleware.js';

function createMockRes() {
  const json = mock.fn();
  const status = mock.fn(() => ({ json }));
  const res: any = { status };
  return { res, status, json };
}

describe('authMiddleware', () => {
  test('calls next() and attaches user to req when token is valid', () => {
    const token = jwt.sign({ id: 'u-1', role: 'CUSTOMER' }, process.env.JWT_SECRET!);
    const req: any = { headers: { authorization: `Bearer ${token}` } };
    const { res } = createMockRes();
    const next = mock.fn();

    authMiddleware(req, res, next);

    assert.strictEqual(next.mock.callCount(), 1);
    assert.strictEqual(req.user.id, 'u-1');
    assert.strictEqual(req.user.role, 'CUSTOMER');
  });

  test('returns 401 when no authorization header is present', () => {
    const req: any = { headers: {} };
    const { res, status, json } = createMockRes();
    const next = mock.fn();

    authMiddleware(req, res, next);

    assert.strictEqual(next.mock.callCount(), 0);
    assert.strictEqual((status as any).mock.calls[0].arguments[0], 401);
    assert.strictEqual(json.mock.calls[0].arguments[0].success, false);
  });

  test('returns 401 when authorization header has no Bearer prefix', () => {
    const req: any = { headers: { authorization: 'sometoken' } };
    const { res, status, json } = createMockRes();
    const next = mock.fn();

    authMiddleware(req, res, next);

    assert.strictEqual(next.mock.callCount(), 0);
    assert.strictEqual((status as any).mock.calls[0].arguments[0], 401);
  });

  test('returns 401 when token is invalid or expired', () => {
    const req: any = { headers: { authorization: 'Bearer invalid.token.here' } };
    const { res, status, json } = createMockRes();
    const next = mock.fn();

    authMiddleware(req, res, next);

    assert.strictEqual(next.mock.callCount(), 0);
    assert.strictEqual((status as any).mock.calls[0].arguments[0], 401);
    assert.strictEqual(json.mock.calls[0].arguments[0].success, false);
  });
});