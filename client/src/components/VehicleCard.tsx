import type { Vehicle } from "../types/Vehicle";

interface VehicleCardProps {
  vehicle: Vehicle;
  onPurchase: (id: string) => void;
  isAdmin: boolean;
  onEdit?: (vehicle: Vehicle) => void;
  onDelete?: (id: string) => void;
}

export default function VehicleCard({
  vehicle,
  onPurchase,
  isAdmin,
  onEdit,
  onDelete,
}: VehicleCardProps) {
  const outOfStock = vehicle.quantity === 0;

  return (
    <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-zinc-300 transition-all">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-zinc-100 text-zinc-800 uppercase tracking-wider">
            {vehicle.category}
          </span>
          <span className={`text-xs font-black uppercase tracking-wider ${outOfStock ? "text-rose-600" : "text-emerald-700"}`}>
            {outOfStock ? "Sold Out" : `${vehicle.quantity} Units Left`}
          </span>
        </div>

        <div>
          <h3 className="text-xl font-black text-zinc-950 tracking-tight">
            {vehicle.make} <span className="font-medium text-zinc-600">{vehicle.model}</span>
          </h3>
          <p className="text-2xl font-black text-zinc-950 mt-1">
            ${vehicle.price.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <button
          onClick={() => onPurchase(vehicle.id)}
          disabled={outOfStock}
          className="w-full bg-zinc-950 hover:bg-zinc-900 text-white font-bold text-sm py-2.5 rounded-xl transition-all active:scale-[0.985] disabled:bg-zinc-100 disabled:text-zinc-400 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
        >
          {outOfStock ? "Out of Stock" : "Purchase Asset"}
        </button>

        {isAdmin && (
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => onEdit?.(vehicle)}
              className="flex-1 bg-white border border-zinc-200 text-zinc-800 text-xs font-bold py-2 rounded-xl hover:bg-zinc-50 transition-colors cursor-pointer"
            >
              Modify
            </button>
            <button
              onClick={() => onDelete?.(vehicle.id)}
              className="flex-1 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold py-2 rounded-xl hover:bg-rose-100/60 transition-colors cursor-pointer"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
}