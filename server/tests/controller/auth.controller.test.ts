import { describe, test, mock } from 'node:test';
import assert from 'node:assert';
import { registerController, loginController } from '../../src/controllers/auth.controller.js';
import bcrypt from 'bcrypt';

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

    assert.strictEqual((status as any).mock.calls[0].arguments[0], 201);
    const body = json.mock.calls[0].arguments[0];
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.email, 'test@example.com');
    assert.strictEqual(body.data.password, undefined);
  });

  test('returns 400 when email already exists', async () => {
    const fakePrisma = createFakePrisma({ id: 'u-1', email: 'test@example.com' });
    const req: any = {
      body: { name: 'Test User', email: 'test@example.com', password: 'plainPassword123' },
    };
    const { res, status, json } = createMockRes();

    await registerController(fakePrisma as any)(req, res);

    assert.strictEqual((status as any).mock.calls[0].arguments[0], 400);
    const body = json.mock.calls[0].arguments[0];
    assert.strictEqual(body.success, false);
    assert.match(body.message, /already exists/i);
  });
  describe('name validation', () => {
    test('returns 400 when name is missing', async () => {
      const fakePrisma = createFakePrisma(null);
      const req: any = { body: { email: 'test@example.com', password: 'plainPassword123' } };
      const { res, status, json } = createMockRes();

      await registerController(fakePrisma as any)(req, res);

      assert.strictEqual((status as any).mock.calls[0].arguments[0], 400);
      assert.match((json as any).mock.calls[0].arguments[0].message, /name/i);
    });

    test('returns 400 when name is an empty string', async () => {
      const fakePrisma = createFakePrisma(null);
      const req: any = {
        body: { name: '  ', email: 'test@example.com', password: 'plainPassword123' },
      };
      const { res, status, json } = createMockRes();

      await registerController(fakePrisma as any)(req, res);

      assert.strictEqual((status as any).mock.calls[0].arguments[0], 400);
      assert.match(json.mock.calls[0].arguments[0].message, /name/i);
    });
  });

  describe('email validation', () => {
    test('returns 400 when email is missing', async () => {
      const fakePrisma = createFakePrisma(null);
      const req: any = { body: { name: 'Test User', password: 'plainPassword123' } };
      const { res, status, json } = createMockRes();

      await registerController(fakePrisma as any)(req, res);

      assert.strictEqual((status as any).mock.calls[0].arguments[0], 400);
      assert.match(json.mock.calls[0].arguments[0].message, /email/i);
    });

    test('returns 400 when email format is invalid', async () => {
      const fakePrisma = createFakePrisma(null);
      const req: any = {
        body: { name: 'Test User', email: 'not-an-email', password: 'plainPassword123' },
      };
      const { res, status, json } = createMockRes();

      await registerController(fakePrisma as any)(req, res);

      assert.strictEqual((status as any).mock.calls[0].arguments[0], 400);
      assert.match(json.mock.calls[0].arguments[0].message, /email/i);
    });
  });

  describe('password validation', () => {
    test('returns 400 when password is missing', async () => {
      const fakePrisma = createFakePrisma(null);
      const req: any = { body: { name: 'Test User', email: 'test@example.com' } };
      const { res, status, json } = createMockRes();

      await registerController(fakePrisma as any)(req, res);

      assert.strictEqual((status as any).mock.calls[0].arguments[0], 400);
      assert.match(json.mock.calls[0].arguments[0].message, /password/i);
    });

    test('returns 400 when password is shorter than 8 characters', async () => {
      const fakePrisma = createFakePrisma(null);
      const req: any = {
        body: { name: 'Test User', email: 'test@example.com', password: 'short1' },
      };
      const { res, status, json } = createMockRes();

      await registerController(fakePrisma as any)(req, res);

      assert.strictEqual((status as any).mock.calls[0].arguments[0], 400);
      assert.match(json.mock.calls[0].arguments[0].message, /password/i);
    });
  });
});

// Login controller tests

describe('loginController', () => {
  test('returns 200 with token when credentials are correct', async () => {
    const hashedPassword = await bcrypt.hash('correctPassword123', 10);
    const fakePrisma = {
      user: {
        findUnique: mock.fn(async () => ({
          id: 'u-1',
          name: 'Test User',
          email: 'test@example.com',
          password: hashedPassword,
          role: 'CUSTOMER',
        })),
      },
    };

    const req: any = {
      body: { email: 'test@example.com', password: 'correctPassword123' },
    };
    const { res, status, json } = createMockRes();

    await loginController(fakePrisma as any)(req, res);

    assert.strictEqual((status as any).mock.calls[0].arguments[0], 200);
    const body = json.mock.calls[0].arguments[0];
    assert.strictEqual(body.success, true);
    assert.ok(body.data.token);
    assert.strictEqual(body.data.user.email, 'test@example.com');
    assert.strictEqual(body.data.user.password, undefined);
  });

  test('returns 400 when email does not exist', async () => {
    const fakePrisma = {
      user: { findUnique: mock.fn(async () => null) },
    };

    const req: any = {
      body: { email: 'missing@example.com', password: 'anyPassword123' },
    };
    const { res, status, json } = createMockRes();

    await loginController(fakePrisma as any)(req, res);

    assert.strictEqual((status as any).mock.calls[0].arguments[0], 400);
    assert.strictEqual(json.mock.calls[0].arguments[0].success, false);
  });

  test('returns 400 when password is incorrect', async () => {
    const hashedPassword = await bcrypt.hash('correctPassword123', 10);
    const fakePrisma = {
      user: {
        findUnique: mock.fn(async () => ({
          id: 'u-1',
          name: 'Test User',
          email: 'test@example.com',
          password: hashedPassword,
          role: 'CUSTOMER',
        })),
      },
    };

    const req: any = {
      body: { email: 'test@example.com', password: 'wrongPassword' },
    };
    const { res, status, json } = createMockRes();

    await loginController(fakePrisma as any)(req, res);

    assert.strictEqual((status as any).mock.calls[0].arguments[0], 400);
    assert.strictEqual(json.mock.calls[0].arguments[0].success, false);
  });

  test('returns 400 when email or password is missing', async () => {
    const fakePrisma = { user: { findUnique: mock.fn(async () => null) } };
    const req: any = { body: { email: 'test@example.com' } };
    const { res, status, json } = createMockRes();

    await loginController(fakePrisma as any)(req, res);

    assert.strictEqual((status as any).mock.calls[0].arguments[0], 400);
    assert.strictEqual(json.mock.calls[0].arguments[0].success, false);
  });
});