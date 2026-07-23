import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getVehicles,
  searchVehicles,
  addVehicle,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle,
} from "../../api/vehicles";

const { mockGet, mockPost, mockPut, mockDelete, mockCreate } = vi.hoisted(() => {
  const mockGet = vi.fn();
  const mockPost = vi.fn();
  const mockPut = vi.fn();
  const mockDelete = vi.fn();
  const mockInterceptorUse = vi.fn();
  const mockCreate = vi.fn(() => ({
    get: mockGet,
    post: mockPost,
    put: mockPut,
    delete: mockDelete,
    interceptors: {
      request: { use: mockInterceptorUse },
      response: { use: mockInterceptorUse },
    },
  }));
  return { mockGet, mockPost, mockPut, mockDelete, mockCreate, mockInterceptorUse };
});

vi.mock("axios", () => ({
  default: { create: mockCreate },
  create: mockCreate,
}));

const sampleVehicle = {
  id: "v1",
  make: "Toyota",
  model: "Corolla",
  category: "Sedan",
  price: 22000,
  quantity: 5,
};

describe("vehicles api", () => {
  beforeEach(() => vi.clearAllMocks());

  it("fetches paginated vehicles with page and limit params", async () => {
    const paginatedResponse = {
      vehicles: [sampleVehicle],
      pagination: { page: 2, limit: 9, total: 15, totalPages: 2 },
    };
    mockGet.mockResolvedValue({ data: { data: paginatedResponse } });

    const result = await getVehicles(2, 9);
    expect(mockGet).toHaveBeenCalledWith("/api/vehicles", {
      params: { page: 2, limit: 9 },
    });
    expect(result).toEqual(paginatedResponse);
  });

  it("handles fallback array for getVehicles", async () => {
    mockGet.mockResolvedValue({ data: [sampleVehicle] });
    const result = await getVehicles();
    expect(result.vehicles).toEqual([sampleVehicle]);
    expect(result.pagination.total).toBe(1);
  });

  it("searches vehicles with query params", async () => {
    mockGet.mockResolvedValue({ data: [sampleVehicle] });

    const result = await searchVehicles({ make: "Toyota", minPrice: 10000 });
    expect(mockGet).toHaveBeenCalledWith("/api/vehicles/search", {
      params: { make: "Toyota", minPrice: 10000 },
    });
    expect(result).toEqual([sampleVehicle]);
  });

  it("adds a new vehicle", async () => {
    mockPost.mockResolvedValue({ data: sampleVehicle });
    const payload = { make: "Toyota", model: "Corolla", category: "Sedan", price: 22000, quantity: 5 };
    const result = await addVehicle(payload);
    expect(mockPost).toHaveBeenCalledWith("/api/vehicles", payload);
    expect(result).toEqual(sampleVehicle);
  });

  it("updates a vehicle by id", async () => {
    mockPut.mockResolvedValue({ data: { ...sampleVehicle, price: 21000 } });
    const result = await updateVehicle("v1", { price: 21000 });
    expect(mockPut).toHaveBeenCalledWith("/api/vehicles/v1", { price: 21000 });
    expect(result.price).toBe(21000);
  });

  it("deletes a vehicle by id", async () => {
    mockDelete.mockResolvedValue({ data: { success: true } });
    await deleteVehicle("v1");
    expect(mockDelete).toHaveBeenCalledWith("/api/vehicles/v1");
  });

  it("purchases a vehicle by id", async () => {
    mockPost.mockResolvedValue({ data: { ...sampleVehicle, quantity: 4 } });
    const result = await purchaseVehicle("v1", 1);
    expect(mockPost).toHaveBeenCalledWith("/api/vehicles/v1/purchase", { quantity: 1 });
    expect(result.quantity).toBe(4);
  });

  it("restocks a vehicle by id with a quantity", async () => {
    mockPost.mockResolvedValue({ data: { ...sampleVehicle, quantity: 10 } });
    const result = await restockVehicle("v1", 5);
    expect(mockPost).toHaveBeenCalledWith("/api/vehicles/v1/restock", { quantity: 5 });
    expect(result.quantity).toBe(10);
  });
});