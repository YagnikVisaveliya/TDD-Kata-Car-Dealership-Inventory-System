import api from "./axiosInstance";
import type { Vehicle, VehicleSearchParams } from "../types/Vehicle";

function unwrapData<T>(responseData: unknown): T {
  if (typeof responseData === "object" && responseData !== null && "data" in responseData) {
    return (responseData as { data: T }).data;
  }

  return responseData as T;
}

export async function getVehicles(): Promise<Vehicle[]> {
  const res = await api.get("/api/vehicles");
  return unwrapData<Vehicle[]>(res.data);
}

export async function searchVehicles(params: VehicleSearchParams): Promise<Vehicle[]> {
  const res = await api.get("/api/vehicles/search", { params });
  return unwrapData<Vehicle[]>(res.data);
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