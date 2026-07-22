import { test } from 'node:test';
import assert from 'node:assert';
import { AuthService } from '../../src/services/auth.service.js';

test('AuthService.register() hashes the password before saving', async () => {
  let savedData: any = null;

  const fakePrisma = {
    user: {
      findUnique: async () => null,
      create: async ({ data }: any) => {
        savedData = data;
        return { id: 'u-1', ...data };
      },
    },
  };

  const service = new AuthService(fakePrisma as any);

  const result = await service.register('Test User', 'test@example.com', 'plainPassword123');

  assert.strictEqual(result.name, 'Test User');
  assert.strictEqual(result.email, 'test@example.com');
  assert.notStrictEqual(savedData.password, 'plainPassword123');
  assert.strictEqual(result.password, undefined);
});

test('AuthService.register() throws if email already exists', async () => {
  const fakePrisma = {
    user: {
      findUnique: async () => ({ id: 'u-1', name: 'Existing User', email: 'test@example.com' }),
    },
  };

  const service = new AuthService(fakePrisma as any);

  await assert.rejects(
    () => service.register('New User', 'test@example.com', 'plainPassword123'),
    /already exists/i
  );
});