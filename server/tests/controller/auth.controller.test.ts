import { describe, test, mock } from 'node:test';
import assert from 'node:assert';
import { registerController } from '../../src/controllers/auth.controller.js';

function createMockRes() {
  const json = mock.fn();
  const status = mock.fn(() => ({ json }));
  const res: any = { status };
  return { res, status, json };
}

function createFakePrisma(existingUser: any = null) {
  return {
    user: {
      findUnique: mock.fn(async () => existingUser),
      create: mock.fn(async ({ data }: any) => ({ id: 'u-1', ...data })),
    },
  };
}

describe('registerController', () => {
  test('returns 201 with success response when registration succeeds', async () => {
    const fakePrisma = createFakePrisma(null);
    const req: any = {
      body: { name: 'Test User', email: 'test@example.com', password: 'plainPassword123' },
    };
    const { res, status, json } = createMockRes();

    await registerController(fakePrisma as any)(req, res);

    assert.strictEqual(status.mock.calls[0].arguments[0], 201);
    const body = json.mock.calls[0].arguments[0];
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.email, 'test@example.com');
    assert.strictEqual(body.data.password, undefined);
  });
});