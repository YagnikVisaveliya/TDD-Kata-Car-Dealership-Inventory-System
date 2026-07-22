import { describe, test, mock } from 'node:test';
import assert from 'node:assert';
import { createVehicleController, getVehiclesController } from '../../src/controllers/vehicle.controller.js';

function createMockRes() {
  const json = mock.fn();
  const status = mock.fn(() => ({ json }));
  const res: any = { status };
  return { res, status, json };
}

function createFakePrisma(overrides: any = {}) {
  return {
    vehicle: {
      create: mock.fn(async ({ data }: any) => ({ id: 'v-1', ...data })),
      findMany: mock.fn(async () => []),
      ...overrides,
    },
  };
}

describe('createVehicleController', () => {
  test('returns 201 with created vehicle on success', async () => {
    const fakePrisma = createFakePrisma();
    const req: any = {
      body: { make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 22000, quantity: 5 },
    };
    const { res, status, json } = createMockRes();

    await createVehicleController(fakePrisma as any)(req, res);

    assert.strictEqual((status as any).mock.calls[0].arguments[0], 201);
    const body = json.mock.calls[0].arguments[0];
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.make, 'Toyota');
  });

  test('returns 400 when make is missing', async () => {
    const fakePrisma = createFakePrisma();
    const req: any = {
      body: { model: 'Corolla', category: 'Sedan', price: 22000, quantity: 5 },
    };
    const { res, status, json } = createMockRes();

    await createVehicleController(fakePrisma as any)(req, res);

    assert.strictEqual((status as any).mock.calls[0].arguments[0], 400);
    assert.match((json as any).mock.calls[0].arguments[0].message, /make/i);
  });

  test('returns 400 when price is negative', async () => {
    const fakePrisma = createFakePrisma();
    const req: any = {
      body: { make: 'Toyota', model: 'Corolla', category: 'Sedan', price: -100, quantity: 5 },
    };
    const { res, status, json } = createMockRes();

    await createVehicleController(fakePrisma as any)(req, res);

    assert.strictEqual((status as any).mock.calls[0].arguments[0], 400);
    assert.match((json as any).mock.calls[0].arguments[0].message, /price/i);
  });

  test('returns 400 when quantity is negative', async () => {
    const fakePrisma = createFakePrisma();
    const req: any = {
      body: { make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 22000, quantity: -1 },
    };
    const { res, status, json } = createMockRes();

    await createVehicleController(fakePrisma as any)(req, res);

    assert.strictEqual((status as any).mock.calls[0].arguments[0], 400);
    assert.match((json as any).mock.calls[0].arguments[0].message, /quantity/i);
  });
});

describe('getVehiclesController', () => {
  test('returns 200 with list of vehicles', async () => {
    const fakePrisma = createFakePrisma({
      findMany: mock.fn(async () => [
        { id: 'v-1', make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 22000, quantity: 5 },
        { id: 'v-2', make: 'Honda', model: 'Civic', category: 'Sedan', price: 21000, quantity: 3 },
      ]),
    });
    const req: any = {};
    const { res, status, json } = createMockRes();

    await getVehiclesController(fakePrisma as any)(req, res);

    assert.strictEqual((status as any).mock.calls[0].arguments[0], 200);
    const body = (json as any).mock.calls[0].arguments[0];
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.length, 2);
  });

  test('returns 200 with empty array when no vehicles exist', async () => {
    const fakePrisma = createFakePrisma({ findMany: mock.fn(async () => []) });
    const req: any = {};
    const { res, status, json } = createMockRes();

    await getVehiclesController(fakePrisma as any)(req, res);

    assert.strictEqual((status as any).mock.calls[0].arguments[0], 200);
    assert.deepStrictEqual((json as any).mock.calls[0].arguments[0].data, []);
  });
});