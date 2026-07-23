import api from "./axiosInstance";
import type { Vehicle, VehicleSearchParams, PaginatedVehiclesResponse } from "../types/Vehicle";

function unwrapData<T>(responseData: unknown): T {
  if (typeof responseData === "object" && responseData !== null && "data" in responseData) {
    return (responseData as { data: T }).data;
  }

  return responseData as T;
}

export async function getVehicles(
  page?: number,
  limit?: number
): Promise<PaginatedVehiclesResponse> {
  const params: Record<string, number> = {};
  if (page !== undefined) params.page = page;
  if (limit !== undefined) params.limit = limit;

  const res = await api.get("/api/vehicles", { params });
  const data = unwrapData<any>(res.data);

  if (data && typeof data === "object" && "vehicles" in data && "pagination" in data) {
    return data as PaginatedVehiclesResponse;
  }

  const vehiclesList = Array.isArray(data) ? data : [];
  return {
    vehicles: vehiclesList,
    pagination: {
      page: page || 1,
      limit: limit || vehiclesList.length || 9,
      total: vehiclesList.length,
      totalPages: 1,
    },
  };
}

export async function searchVehicles(
  params: VehicleSearchParams,
  page?: number,
  limit?: number
): Promise<PaginatedVehiclesResponse> {
  const queryParams: Record<string, unknown> = { ...params };
  if (page !== undefined) queryParams.page = page;
  if (limit !== undefined) queryParams.limit = limit;

  const res = await api.get("/api/vehicles/search", { params: queryParams });
  const data = unwrapData<any>(res.data);

  if (data && typeof data === "object" && "vehicles" in data && "pagination" in data) {
    return data as PaginatedVehiclesResponse;
  }

  const vehiclesList = Array.isArray(data) ? data : [];
  return {
    vehicles: vehiclesList,
    pagination: {
      page: page || 1,
      limit: limit || vehiclesList.length || 9,
      total: vehiclesList.length,
      totalPages: 1,
    },
  };
}

export async function addVehicle(
  payload: Omit<Vehicle, "id">
): Promise<Vehicle> {
  const res = await api.post("/api/vehicles", payload);
  return unwrapData<Vehicle>(res.data);
}

export async function updateVehicle(
  id: string,
  payload: Partial<Omit<Vehicle, "id">>
): Promise<Vehicle> {
  const res = await api.put(`/api/vehicles/${id}`, payload);
  return unwrapData<Vehicle>(res.data);
}

export async function deleteVehicle(id: string): Promise<void> {
  await api.delete(`/api/vehicles/${id}`);
}

export async function purchaseVehicle(id: string, quantity = 1): Promise<Vehicle> {
  const res = await api.post(`/api/vehicles/${id}/purchase`, { quantity });
  return unwrapData<Vehicle>(res.data);
}

export async function restockVehicle(id: string, quantity: number): Promise<Vehicle> {
  const res = await api.post(`/api/vehicles/${id}/restock`, { quantity });
  return unwrapData<Vehicle>(res.data);
}