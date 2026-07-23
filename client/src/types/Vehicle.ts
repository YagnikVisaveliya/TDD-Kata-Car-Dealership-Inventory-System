export interface Vehicle {
  id: string;
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
}

export interface VehicleSearchParams {
  make?: string;
  model?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedVehiclesResponse {
  vehicles: Vehicle[];
  pagination: PaginationInfo;
}