import { useCallback, useEffect, useState } from "react";
import {
  getVehicles,
  purchaseVehicle,
  searchVehicles,
  addVehicle,
  updateVehicle,
  deleteVehicle,
  restockVehicle,
} from "../api/vehicles";
import { useAuth } from "../context/AuthContext";
import VehicleCard from "../components/VehicleCard";
import type { Vehicle, VehicleSearchParams, PaginationInfo } from "../types/Vehicle";
import toast from "react-hot-toast";
import SearchBar from "../components/SearchBar";
import VehicleForm from "../components/VehicleForm";
import Pagination from "../components/Pagination";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | undefined>(undefined);
  const [purchasingVehicleId, setPurchasingVehicleId] = useState<string | null>(null);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo | null>(null);
  const [currentSearchParams, setCurrentSearchParams] = useState<VehicleSearchParams | null>(null);

  const isAdmin = user?.role === "ADMIN";

  const fetchAllVehiclesForSearch = useCallback(async () => {
    try {
      const fullList = await searchVehicles({});
      setAllVehicles(fullList);
    } catch {
      // Ignore background fetch failure
    }
  }, []);

  const loadVehicles = useCallback(
    async (page = currentPage, limit = pageSize, filters = currentSearchParams) => {
      setLoading(true);
      setError(null);
      try {
        const hasFilters = filters && Object.keys(filters).length > 0;
        if (hasFilters) {
          const searchResults = await searchVehicles(filters);
          setVehicles(searchResults);
          setPaginationInfo(null);
        } else {
          const res = await getVehicles(page, limit);
          setVehicles(res.vehicles);
          setPaginationInfo(res.pagination);
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load vehicles");
      } finally {
        setLoading(false);
      }
    },
    [currentPage, pageSize, currentSearchParams]
  );

  useEffect(() => {
    fetchAllVehiclesForSearch();
  }, [fetchAllVehiclesForSearch]);

  useEffect(() => {
    loadVehicles(currentPage, pageSize, currentSearchParams);
  }, [currentPage, pageSize, currentSearchParams]);

  async function handlePurchase(id: string) {
    setPurchasingVehicleId(id);
    try {
      await purchaseVehicle(id, 1);
      await loadVehicles(currentPage, pageSize, currentSearchParams);
      toast.success("Vehicle purchased!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Purchase failed");
    } finally {
      setPurchasingVehicleId(null);
    }
  }

  const handleSearch = useCallback((params: VehicleSearchParams) => {
    const filterKeys = Object.keys(params);
    setActiveFiltersCount(filterKeys.length);
    setCurrentSearchParams(filterKeys.length > 0 ? params : null);
    setCurrentPage(1);
  }, []);

  async function handleFormSubmit(payload: Omit<Vehicle, "id">) {
    try {
      if (editingVehicle) {
        await updateVehicle(editingVehicle.id, payload);
        toast.success("Vehicle updated");
      } else {
        await addVehicle(payload);
        toast.success("Vehicle added");
      }
      setShowForm(false);
      setEditingVehicle(undefined);
      await Promise.all([
        loadVehicles(currentPage, pageSize, currentSearchParams),
        fetchAllVehiclesForSearch(),
      ]);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Save failed");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteVehicle(id);
      toast.success("Vehicle deleted");
      await Promise.all([
        loadVehicles(currentPage, pageSize, currentSearchParams),
        fetchAllVehiclesForSearch(),
      ]);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  }

  function handleEdit(vehicle: Vehicle) {
    setEditingVehicle(vehicle);
    setShowForm(true);
  }

  async function handleRestock(id: string, quantity: number) {
    try {
      await restockVehicle(id, quantity);
      toast.success("Vehicle restocked");
      await Promise.all([
        loadVehicles(currentPage, pageSize, currentSearchParams),
        fetchAllVehiclesForSearch(),
      ]);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Restock failed");
    }
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 relative">
      {/* Top Header */}
      <header className="bg-white border-b border-zinc-200/80 px-6 py-4 md:px-12 flex justify-between items-center shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="h-6 w-2 bg-amber-500 rounded-full"></div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-zinc-950">
              Fleet Workspace
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col text-right">
            <span className="text-sm font-bold text-zinc-900">
              {user?.name || "Operator"}
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

      {/* Main Content Area: 2-Column Split Layout */}
      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        {/* Page Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-zinc-200/60">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              Inventory Management
            </h2>
            <p className="text-2xl font-black tracking-tight text-zinc-950 mt-0.5">
              Active Fleet Registry
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => {
                setEditingVehicle(undefined);
                setShowForm(true);
              }}
              className="bg-zinc-950 hover:bg-zinc-900 text-white font-bold text-xs uppercase tracking-widest px-4 py-3 rounded-xl shadow-lg shadow-zinc-950/10 active:scale-[0.985] transition-all cursor-pointer self-start sm:self-auto"
            >
              + Provision New Asset
            </button>
          )}
        </div>

        {/* Responsive Grid: Left Sidebar (Filters) + Right Content (Cars Matrix) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Left Sidebar: Search & Filter Panel */}
          <aside className="lg:col-span-1 lg:sticky lg:top-24 self-start space-y-4">
            <SearchBar vehicles={allVehicles} onSearch={handleSearch} />
          </aside>

          {/* Right Section: Inventory Catalog Grid */}
          <section className="lg:col-span-3 space-y-6">
            {/* Catalog Control & Summary Bar */}
            <div className="bg-white border border-zinc-200/80 rounded-2xl px-5 py-3.5 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Showing: <strong className="text-zinc-950">{vehicles.length}</strong> Vehicle{vehicles.length !== 1 ? "s" : ""}
                  {paginationInfo && paginationInfo.total > 0 && (
                    <span className="normal-case text-zinc-400 font-medium ml-1">
                      (Total {paginationInfo.total})
                    </span>
                  )}
                </span>
                {activeFiltersCount > 0 && (
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {activeFiltersCount} Filter{activeFiltersCount !== 1 ? "s" : ""} Active
                  </span>
                )}
              </div>
            </div>

            {/* Loading Indicator */}
            {loading && (
              <div className="flex items-center justify-center py-20 gap-3">
                <svg className="animate-spin h-5 w-5 text-zinc-950" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-sm font-semibold text-zinc-500">Loading catalog matrix...</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-700 text-sm font-semibold p-4 rounded-xl max-w-md mx-auto text-center shadow-sm">
                {error}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && vehicles.length === 0 && (
              <div className="text-center py-16 border border-dashed border-zinc-200 bg-white rounded-2xl max-w-md mx-auto shadow-sm p-6">
                <p className="text-base font-bold text-zinc-700">No matching assets found.</p>
                <p className="text-xs font-semibold text-zinc-400 mt-1">
                  Try adjusting your make, model, or price filters in the left panel.
                </p>
              </div>
            )}

            {/* Vehicle Grid */}
            {!loading && !error && vehicles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {vehicles.map((v) => (
                  <VehicleCard
                    key={v.id}
                    vehicle={v}
                    onPurchase={handlePurchase}
                    isPurchasing={purchasingVehicleId === v.id}
                    isAdmin={isAdmin}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onRestock={handleRestock}
                  />
                ))}
              </div>
            )}

            {/* Pagination Component */}
            {!loading && !error && paginationInfo && paginationInfo.totalPages > 1 && (
              <Pagination
                currentPage={paginationInfo.page}
                totalPages={paginationInfo.totalPages}
                totalItems={paginationInfo.total}
                pageSize={paginationInfo.limit}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                disabled={loading}
              />
            )}
          </section>
        </div>
      </main>

      {/* Modal Form for Asset Creation / Editing */}
      {showForm && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="w-full max-w-md transform transition-all scale-100">
            <VehicleForm
              vehicle={editingVehicle}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingVehicle(undefined);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}