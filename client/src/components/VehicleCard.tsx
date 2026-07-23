import { useState } from "react";
import type { Vehicle } from "../types/Vehicle";

interface VehicleCardProps {
  vehicle: Vehicle;
  onPurchase: (id: string) => void;
  isAdmin: boolean;
  isPurchasing?: boolean;
  onEdit?: (vehicle: Vehicle) => void;
  onDelete?: (id: string) => void;
  onRestock?: (id: string, quantity: number) => Promise<void> | void;
}

function getBrandLogo(make: string): string | null {
  const m = make.toLowerCase();
  if (m.includes("toyota")) return "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/toyota.svg";
  if (m.includes("honda")) return "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/honda.svg";
  if (m.includes("ford")) return "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/ford.svg";
  if (m.includes("bmw")) return "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/bmw.svg";
  if (m.includes("mercedes")) return "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/mercedes.svg";
  if (m.includes("audi")) return "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/audi.svg";
  if (m.includes("tesla")) return "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/tesla.svg";
  if (m.includes("hyundai")) return "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/hyundai.svg";
  if (m.includes("kia")) return "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/kia.svg";
  if (m.includes("nissan")) return "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/nissan.svg";
  if (m.includes("mazda")) return "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/mazda.svg";
  if (m.includes("jeep")) return "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/jeep.svg";
  if (m.includes("porsche")) return "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/porsche.svg";
  if (m.includes("chevrolet")) return "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/chevrolet.svg";
  if (m.includes("renault")) return "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/renault.svg";
  if (m.includes("mahindra")) return "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/mahindra.svg";
  if (m.includes("citroen")) return "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/citroen.svg";
  if (m.includes("suzuki") || m.includes("maruti")) return "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/suzuki.svg";
  if (m.includes("tata")) return "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/tata.svg";
  if (m.includes("bentley")) return "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/bentley.svg";
  if (m.includes("rolls")) return "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/rollsroyce.svg";
  if (m.includes("land rover")) return "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/landrover.svg";
  return null;
}

function getCategoryBadge(category: string) {
  const cat = category.toLowerCase();
  if (cat.includes("suv")) return "bg-indigo-100 text-indigo-800 border-indigo-200/80";
  if (cat.includes("sedan")) return "bg-emerald-100 text-emerald-800 border-emerald-200/80";
  if (cat.includes("coupe") || cat.includes("sport")) return "bg-amber-100 text-amber-900 border-amber-200/80";
  if (cat.includes("hatchback")) return "bg-sky-100 text-sky-800 border-sky-200/80";
  if (cat.includes("truck")) return "bg-orange-100 text-orange-900 border-orange-200/80";
  if (cat.includes("electric") || cat.includes("ev")) return "bg-teal-100 text-teal-900 border-teal-200/80";
  if (cat.includes("convertible")) return "bg-rose-100 text-rose-900 border-rose-200/80";
  if (cat.includes("mpv") || cat.includes("minivan")) return "bg-purple-100 text-purple-900 border-purple-200/80";
  return "bg-zinc-100 text-zinc-800 border-zinc-200";
}

function getCategoryContainerBg(category: string) {
  const cat = category.toLowerCase();
  if (cat.includes("suv")) return "bg-indigo-50/60 border-indigo-100/80";
  if (cat.includes("sedan")) return "bg-emerald-50/60 border-emerald-100/80";
  if (cat.includes("coupe") || cat.includes("sport")) return "bg-amber-50/60 border-amber-100/80";
  if (cat.includes("hatchback")) return "bg-sky-50/60 border-sky-100/80";
  if (cat.includes("truck")) return "bg-orange-50/60 border-orange-100/80";
  if (cat.includes("electric") || cat.includes("ev")) return "bg-teal-50/60 border-teal-100/80";
  if (cat.includes("convertible")) return "bg-rose-50/60 border-rose-100/80";
  if (cat.includes("mpv") || cat.includes("minivan")) return "bg-purple-50/60 border-purple-100/80";
  return "bg-zinc-100/60 border-zinc-200";
}

export default function VehicleCard({
  vehicle,
  onPurchase,
  isAdmin,
  isPurchasing = false,
  onEdit,
  onDelete,
  onRestock,
}: VehicleCardProps) {
  const outOfStock = vehicle.quantity === 0;
  const [restockQty, setRestockQty] = useState("");
  const [showRestockForm, setShowRestockForm] = useState(false);
  const [isRestocking, setIsRestocking] = useState(false);

  const logoUrl = getBrandLogo(vehicle.make);
  const badgeClass = getCategoryBadge(vehicle.category);
  const containerBg = getCategoryContainerBg(vehicle.category);

  async function handleRestock() {
    const qty = Number(restockQty);
    if (!restockQty || qty <= 0) return;
    setIsRestocking(true);
    try {
      await onRestock?.(vehicle.id, qty);
      setRestockQty("");
      setShowRestockForm(false);
    } finally {
      setIsRestocking(false);
    }
  }

  return (
    <div className="bg-white border border-zinc-200/80 rounded-xl p-4 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-zinc-300 transition-all group">
      <div className="space-y-3">
        {/* Top Header Row: Category Badge + Stock Status */}
        <div className="flex justify-between items-center">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold border uppercase tracking-wider ${badgeClass}`}>
            {vehicle.category}
          </span>
          <span className={`text-[11px] font-black uppercase tracking-wider ${outOfStock ? "text-rose-600" : "text-emerald-700"}`}>
            {outOfStock ? "Sold Out" : `${vehicle.quantity} Units Left`}
          </span>
        </div>

        {/* Compact Brand Logo Box */}
        <div className={`h-22 w-full rounded-lg border flex flex-col items-center justify-center p-2.5 transition-transform group-hover:scale-[1.01] ${containerBg}`}>
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`${vehicle.make} logo`}
              className="h-10 w-10 object-contain opacity-85 group-hover:opacity-100 transition-opacity"
            />
          ) : (
            <svg className="w-8 h-8 text-zinc-500/70" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M10 42h44M16 42a4 4 0 100 8 4 4 0 000-8zm32 0a4 4 0 100 8 4 4 0 000-8zM6 34l8-14h24l10 14h10a2 2 0 012 2v2H4v-2a2 2 0 012-2z" />
            </svg>
          )}
          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mt-1">
            {vehicle.make}
          </span>
        </div>

        {/* Vehicle Title & Price Block */}
        <div>
          <h3 className="text-lg font-black text-zinc-950 tracking-tight leading-tight">
            <span className="font-semibold text-zinc-500">{vehicle.make}</span> {vehicle.model}
          </h3>
          <div className="flex items-baseline justify-between mt-1.5 pt-1.5 border-t border-zinc-100">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              List Price
            </span>
            <p className="text-xl font-black text-zinc-950">
              ${vehicle.price.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons Section */}
      <div className="mt-4 space-y-2">
        <button
          onClick={() => onPurchase(vehicle.id)}
          disabled={outOfStock || isPurchasing}
          className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-widest py-2.5 rounded-lg transition-all active:scale-[0.985] shadow-xs disabled:bg-zinc-100 disabled:text-zinc-400 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
        >
          {isPurchasing ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Purchasing...</span>
            </>
          ) : outOfStock ? (
            "Out of Stock"
          ) : (
            "Purchase Asset"
          )}
        </button>

        {isAdmin && (
          <div className="border-t border-zinc-100 pt-2">
            {!showRestockForm ? (
              <div className="flex gap-1.5">
                <button
                  onClick={() => onEdit?.(vehicle)}
                  className="flex-1 bg-white border border-zinc-200 text-zinc-800 text-[11px] font-bold py-1.5 rounded-lg hover:bg-zinc-50 transition-colors cursor-pointer"
                >
                  Modify
                </button>
                <button
                  onClick={() => onDelete?.(vehicle.id)}
                  className="flex-1 bg-rose-50 border border-rose-100 text-rose-700 text-[11px] font-bold py-1.5 rounded-lg hover:bg-rose-100/60 transition-colors cursor-pointer"
                >
                  Remove
                </button>
                {onRestock && (
                  <button
                    onClick={() => setShowRestockForm(true)}
                    className="flex-1 bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-bold py-1.5 rounded-lg hover:bg-amber-100/70 transition-colors cursor-pointer"
                  >
                    Restock
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 animate-fadeIn">
                <div className="flex-1 relative">
                  <label htmlFor={`restock-${vehicle.id}`} className="sr-only">
                    Restock Count
                  </label>
                  <input
                    id={`restock-${vehicle.id}`}
                    type="number"
                    min={1}
                    value={restockQty}
                    onChange={(e) => setRestockQty(e.target.value)}
                    placeholder="Qty..."
                    autoFocus
                    disabled={isRestocking}
                    className="w-full bg-zinc-50 border border-amber-300 text-zinc-900 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:opacity-60"
                  />
                </div>
                <button
                  onClick={handleRestock}
                  disabled={isRestocking}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-xs disabled:opacity-75 flex items-center gap-1"
                >
                  {isRestocking ? (
                    <>
                      <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>...</span>
                    </>
                  ) : (
                    <span>Restock</span>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowRestockForm(false);
                    setRestockQty("");
                  }}
                  disabled={isRestocking}
                  className="bg-zinc-100 hover:bg-zinc-200 text-zinc-600 font-bold text-xs px-2 py-1.5 rounded-lg transition-all cursor-pointer disabled:opacity-60"
                  title="Cancel"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}