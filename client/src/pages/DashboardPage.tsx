import { useEffect, useState } from "react";
import { getVehicles, purchaseVehicle,searchVehicles } from "../api/vehicles";
import { useAuth } from "../context/AuthContext";
import VehicleCard from "../components/VehicleCard";
import type { Vehicle, VehicleSearchParams } from "../types/Vehicle";
import toast from "react-hot-toast";
import SearchBar from "../components/SearchBar";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = user?.role === "ADMIN";

  async function loadVehicles() {
    setLoading(true);
    setError(null);
    try {
      const data = await getVehicles();
      setVehicles(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVehicles();
  }, []);

  async function handlePurchase(id: string) {
    try {
      const updated = await purchaseVehicle(id);
      setVehicles((prev) => prev.map((v) => (v.id === id ? updated : v)));
      toast.success("Vehicle purchased!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Purchase failed");
    }
  }

  async function handleSearch(params: VehicleSearchParams) {
  setLoading(true);
  setError(null);
  try {
    const hasFilters = Object.keys(params).length > 0;
    const data = hasFilters ? await searchVehicles(params) : await getVehicles();
    setVehicles(data);
  } catch (err: any) {
    setError(err?.response?.data?.message || "Search failed");
  } finally {
    setLoading(false);
  }
}

  async function handleDelete() {
    // wired once deleteVehicle admin flow is built
  }
  

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      
      {/* Editorial Header Architecture */}
      <header className="bg-white border-b border-zinc-200/80 px-6 py-4 md:px-12 flex justify-between items-center shadow-sm shadow-zinc-100">
        <div className="flex items-center gap-3">
          <div className="h-6 w-2 bg-amber-500 rounded-full"></div>
          <h1 className="text-xl font-black tracking-tight text-zinc-950">
            Fleet Workspace
          </h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex flex-col text-right">
            <span className="text-sm font-bold text-zinc-900">
              {user?.name || 'Operator'}
            </span>
            {isAdmin && (
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 mt-0.5">
                Admin Control
              </span>
            )}
          </div>
          <button 
            onClick={logout} 
            className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/70 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-6 md:p-12 space-y-6">
        
        {/* Dynamic Section Header with Optional Admin Action Overlays */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Inventory Management</h2>
            <p className="text-2xl font-black tracking-tight text-zinc-950 mt-0.5">Active Fleet Registry</p>
          </div>
          
          {/* {isAdmin && (
          
            <button
              onClick={onAddVehicleClick}
              className="inline-flex items-center justify-center bg-zinc-950 hover:bg-zinc-900 text-white font-bold text-xs uppercase tracking-widest px-4 py-3 rounded-xl shadow-lg shadow-zinc-950/10 active:scale-[0.985] transition-all cursor-pointer self-start sm:self-auto"
            >
              + Provision New Asset
            </button>
          )} */}
        </div>

        {/* Aligned Workstation Search Panel */}
        <SearchBar 
          onSearch={handleSearch}
        />

        {/* Global Loading Lifecycle State Indicators */}
        {loading && (
          <div className="flex items-center justify-center py-20 gap-3">
            <svg className="animate-spin h-5 w-5 text-zinc-950" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-sm font-semibold text-zinc-500">Loading catalog matrix...</p>
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-700 text-sm font-semibold p-4 rounded-xl max-w-md mx-auto text-center shadow-sm">
            {error}
          </div>
        )}

        {!loading && !error && vehicles.length === 0 && (
          <div className="text-center py-16 border border-dashed border-zinc-200 bg-white rounded-2xl max-w-md mx-auto shadow-sm">
            <p className="text-sm font-semibold text-zinc-400">No active assets registered in stock.</p>
          </div>
        )}

        {/* Dynamic Card Assembly Grid */}
        {!loading && !error && vehicles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((v) => (
              <VehicleCard
                key={v.id}
                vehicle={v}
                onPurchase={handlePurchase}
                isAdmin={isAdmin}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}