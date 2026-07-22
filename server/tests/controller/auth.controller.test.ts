import { test, describe, mock } from 'node:test';
import assert from 'node:assert';
import { AuthService } from '../../src/services/auth.service';

function createMockRes() {
  const json = mock.fn();
  const status = mock.fn(() => ({ json }));
  const res: any = { status };
  return { res, status, json };
}

describe('Authcontroller', () => {
    test('returns 201 with success response when registration succeeds', async () => {
        const fakePrisma = {
            user: {
                findUnique: mock.fn(() => null),
                create: mock.fn(async ({ data }: any) => ({ id: 'u-1', ...data })),
            },
        };

        const authService = new AuthService(fakePrisma as any);

        const req: any = {
            body: {
                name: 'Test User',
                email: 'test@example.com',
                password: 'plainPassword123',
            },
        };
        const { res, status, json } = createMockRes();

        await registerController(authService)(req, res);

        assert.strictEqual(status.mock.calls[0].arguments[0], 201);

        const responseBody = json.mock.calls[0].arguments[0];
        assert.strictEqual(responseBody.success, true);
        assert.strictEqual(responseBody.message, 'User registered successfully');
        assert.strictEqual(responseBody.data.email, 'test@example.com');
        assert.strictEqual(responseBody.data.password, undefined);
    });
})