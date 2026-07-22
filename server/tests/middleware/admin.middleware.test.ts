import { describe, test, mock } from 'node:test';
import assert from 'node:assert';
import { adminMiddleware } from '../../src/middleware/admin.middleware.js';

function createMockRes() {
  const json = mock.fn();
  const status = mock.fn(() => ({ json }));
  const res: any = { status };
  return { res, status, json };
}

describe('adminMiddleware', () => {
  test('calls next() when req.user.role is ADMIN', () => {
    const req: any = { user: { id: 'u-1', role: 'ADMIN' } };
    const { res } = createMockRes();
    const next = mock.fn();

    adminMiddleware(req, res, next);

    assert.strictEqual(next.mock.callCount(), 1);
  });

  test('returns 403 when req.user.role is CUSTOMER', () => {
    const req: any = { user: { id: 'u-1', role: 'CUSTOMER' } };
    const { res, status, json } = createMockRes();
    const next = mock.fn();

    adminMiddleware(req, res, next);

    assert.strictEqual(next.mock.callCount(), 0);
    assert.strictEqual((status as any).mock.calls[0].arguments[0], 403);
    assert.strictEqual(json.mock.calls[0].arguments[0].success, false);
  });

  test('returns 401 when req.user is missing (authMiddleware did not run first)', () => {
    const req: any = {};
    const { res, status, json } = createMockRes();
    const next = mock.fn();

    adminMiddleware(req, res, next);

    assert.strictEqual(next.mock.callCount(), 0);
    assert.strictEqual((status as any).mock.calls[0].arguments[0], 401);
  });
});