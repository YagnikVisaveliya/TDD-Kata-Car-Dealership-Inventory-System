import { describe, test, mock } from 'node:test';
import assert from 'node:assert';
import { createVehicleController, getVehiclesController, searchVehiclesController, updateVehicleController, deleteVehicleController, purchaseVehicleController } from '../../src/controllers/vehicle.controller.js';

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


describe('searchVehiclesController', () => {
  test('returns 200 with vehicles filtered by make', async () => {
    const fakePrisma = createFakePrisma({
      findMany: mock.fn(async () => [
        { id: 'v-1', make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 22000, quantity: 5 },
      ]),
    });
    const req: any = { query: { make: 'Toyota' } };
    const { res, status, json } = createMockRes();

    await searchVehiclesController(fakePrisma as any)(req, res);

    assert.strictEqual((status as any).mock.calls[0].arguments[0], 200);
    const body = (json as any).mock.calls[0].arguments[0];
    assert.strictEqual(body.data.length, 1);
    assert.strictEqual(body.data[0].make, 'Toyota');
  });

  test('returns 200 with vehicles filtered by price range', async () => {
    const fakePrisma = createFakePrisma({
      findMany: mock.fn(async () => [
        { id: 'v-1', make: 'Honda', model: 'Civic', category: 'Sedan', price: 21000, quantity: 3 },
      ]),
    });
    const req: any = { query: { minPrice: '20000', maxPrice: '25000' } };
    const { res, status, json } = createMockRes();

    await searchVehiclesController(fakePrisma as any)(req, res);

    assert.strictEqual((status as any).mock.calls[0].arguments[0], 200);
    assert.strictEqual((json as any).mock.calls[0].arguments[0].data.length, 1);
  });

  test('returns 400 when minPrice is not a valid number', async () => {
    const fakePrisma = createFakePrisma();
    const req: any = { query: { minPrice: 'abc' } };
    const { res, status, json } = createMockRes();

    await searchVehiclesController(fakePrisma as any)(req, res);

    assert.strictEqual((status as any).mock.calls[0].arguments[0], 400);
    assert.match((json as any).mock.calls[0].arguments[0].message, /price/i);
  });

  test('returns 200 with empty array when no vehicles match', async () => {
    const fakePrisma = createFakePrisma({ findMany: mock.fn(async () => []) });
    const req: any = { query: { category: 'Truck' } };
    const { res, status, json } = createMockRes();

    await searchVehiclesController(fakePrisma as any)(req, res);

    assert.strictEqual((status as any).mock.calls[0].arguments[0], 200);
    assert.deepStrictEqual((json as any).mock.calls[0].arguments[0].data, []);
  });
});

describe('updateVehicleController', () => {
  test('returns 200 with updated vehicle on success', async () => {
    const fakePrisma = createFakePrisma({
      findUnique: mock.fn(async () => ({
        id: 'v-1', make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 22000, quantity: 5,
      })),
      update: mock.fn(async ({ data }: any) => ({
        id: 'v-1', make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 22000, quantity: 5, ...data,
      })),
    });
    const req: any = { params: { id: 'v-1' }, body: { price: 23000 } };
    const { res, status, json } = createMockRes();

    await updateVehicleController(fakePrisma as any)(req, res);

    assert.strictEqual((status as any).mock.calls[0].arguments[0], 200);
    const body = (json as any).mock.calls[0].arguments[0];
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.price, 23000);
  });

  test('returns 404 when vehicle does not exist', async () => {
    const fakePrisma = createFakePrisma({
      findUnique: mock.fn(async () => null),
    });
    const req: any = { params: { id: 'nonexistent' }, body: { price: 23000 } };
    const { res, status, json } = createMockRes();

    await updateVehicleController(fakePrisma as any)(req, res);

    assert.strictEqual((status as any).mock.calls[0].arguments[0], 404);
    assert.strictEqual((json as any).mock.calls[0].arguments[0].success, false);
  });

  test('returns 400 when price is negative', async () => {
    const fakePrisma = createFakePrisma({
      findUnique: mock.fn(async () => ({
        id: 'v-1', make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 22000, quantity: 5,
      })),
    });
    const req: any = { params: { id: 'v-1' }, body: { price: -500 } };
    const { res, status, json } = createMockRes();

    await updateVehicleController(fakePrisma as any)(req, res);

    assert.strictEqual((status as any).mock.calls[0].arguments[0], 400);
    assert.match((json as any).mock.calls[0].arguments[0].message, /price/i);
  });

  test('returns 400 when quantity is negative', async () => {
    const fakePrisma = createFakePrisma({
      findUnique: mock.fn(async () => ({
        id: 'v-1', make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 22000, quantity: 5,
      })),
    });
    const req: any = { params: { id: 'v-1' }, body: { quantity: -1 } };
    const { res, status, json } = createMockRes();

    await updateVehicleController(fakePrisma as any)(req, res);

    assert.strictEqual((status as any).mock.calls[0].arguments[0], 400);
    assert.match((json as any).mock.calls[0].arguments[0].message, /quantity/i);
  });

  test('allows partial update with only one field', async () => {
    const fakePrisma = createFakePrisma({
      findUnique: mock.fn(async () => ({
        id: 'v-1', make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 22000, quantity: 5,
      })),
      update: mock.fn(async ({ data }: any) => ({
        id: 'v-1', make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 22000, quantity: 5, ...data,
      })),
    });
    const req: any = { params: { id: 'v-1' }, body: { quantity: 10 } };
    const { res, status, json } = createMockRes();

    await updateVehicleController(fakePrisma as any)(req, res);

    assert.strictEqual((status as any).mock.calls[0].arguments[0], 200);
    assert.strictEqual((json as any).mock.calls[0].arguments[0].data.quantity, 10);
  });
});

describe('deleteVehicleController', () => {
  test('returns 200 when vehicle is deleted successfully', async () => {
    const fakePrisma = createFakePrisma({
      findUnique: mock.fn(async () => ({
        id: 'v-1', make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 22000, quantity: 5,
      })),
      delete: mock.fn(async () => ({
        id: 'v-1', make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 22000, quantity: 5,
      })),
    });
    const req: any = { params: { id: 'v-1' } };
    const { res, status, json } = createMockRes();

    await deleteVehicleController(fakePrisma as any)(req, res);

    assert.strictEqual((status as any).mock.calls[0].arguments[0], 200);
    assert.strictEqual(json.mock.calls[0].arguments[0].success, true);
  });

  test('returns 404 when vehicle does not exist', async () => {
    const fakePrisma = createFakePrisma({
      findUnique: mock.fn(async () => null),
    });
    const req: any = { params: { id: 'nonexistent' } };
    const { res, status, json } = createMockRes();

    await deleteVehicleController(fakePrisma as any)(req, res);

    assert.strictEqual((status as any).mock.calls[0].arguments[0], 404);
    assert.strictEqual(json.mock.calls[0].arguments[0].success, false);
  });
});


describe('purchaseVehicleController', () => {
  test('returns 200 and decrements quantity on successful purchase', async () => {
    const fakePrisma = createFakePrisma({
      findUnique: mock.fn(async () => ({
        id: 'v-1', make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 22000, quantity: 5,
      })),
      update: mock.fn(async ({ data }: any) => ({
        id: 'v-1', make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 22000, quantity: 5 + data.quantity.decrement * -1,
      })),
    });
    const req: any = { params: { id: 'v-1' }, body: { quantity: 2 } };
    const { res, status, json } = createMockRes();

    await purchaseVehicleController(fakePrisma as any)(req, res);

    assert.strictEqual((status as any).mock.calls[0].arguments[0], 200);
    const body = json.mock.calls[0].arguments[0];
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.quantity, 3);
  });

  test('returns 404 when vehicle does not exist', async () => {
    const fakePrisma = createFakePrisma({
      findUnique: mock.fn(async () => null),
    });
    const req: any = { params: { id: 'nonexistent' }, body: { quantity: 1 } };
    const { res, status, json } = createMockRes();

    await purchaseVehicleController(fakePrisma as any)(req, res);

    assert.strictEqual((status as any).mock.calls[0].arguments[0], 404);
  });

  test('returns 400 when requested quantity exceeds available stock', async () => {
    const fakePrisma = createFakePrisma({
      findUnique: mock.fn(async () => ({
        id: 'v-1', make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 22000, quantity: 2,
      })),
    });
    const req: any = { params: { id: 'v-1' }, body: { quantity: 5 } };
    const { res, status, json } = createMockRes();

    await purchaseVehicleController(fakePrisma as any)(req, res);

    assert.strictEqual((status as any).mock.calls[0].arguments[0], 400);
    assert.match(json.mock.calls[0].arguments[0].message, /stock/i);
  });

  test('returns 400 when quantity is missing or invalid', async () => {
    const fakePrisma = createFakePrisma({
      findUnique: mock.fn(async () => ({
        id: 'v-1', make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 22000, quantity: 5,
      })),
    });
    const req: any = { params: { id: 'v-1' }, body: {} };
    const { res, status, json } = createMockRes();

    await purchaseVehicleController(fakePrisma as any)(req, res);

    assert.strictEqual((status as any).mock.calls[0].arguments[0], 400);
  });

  test('returns 400 when quantity is zero or negative', async () => {
    const fakePrisma = createFakePrisma({
      findUnique: mock.fn(async () => ({
        id: 'v-1', make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 22000, quantity: 5,
      })),
    });
    const req: any = { params: { id: 'v-1' }, body: { quantity: 0 } };
    const { res, status, json } = createMockRes();

    await purchaseVehicleController(fakePrisma as any)(req, res);

    assert.strictEqual((status as any).mock.calls[0].arguments[0], 400);
  });
});