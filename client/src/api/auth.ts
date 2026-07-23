import api from "./axiosInstance";
import type { AuthResponse } from "../types/User";

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await api.post("/api/auth/login", { email, password });
  return res.data.data ?? res.data;
}

export async function register(name: string, email: string, password: string): Promise<AuthResponse> {
  const res = await api.post("/api/auth/register", { name, email, password });
  return res.data.data ?? res.data;
}