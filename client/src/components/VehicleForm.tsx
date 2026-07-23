import { useState, type FormEvent } from "react";
import type { Vehicle } from "../types/Vehicle";

interface VehicleFormProps {
  vehicle?: Vehicle;
  onSubmit: (payload: Omit<Vehicle, "id">) => void;
  onCancel: () => void;
}

export default function VehicleForm({ vehicle, onSubmit, onCancel }: VehicleFormProps) {
  const isEdit = Boolean(vehicle);

  const [make, setMake] = useState(vehicle?.make ?? "");
  const [model, setModel] = useState(vehicle?.model ?? "");
  const [category, setCategory] = useState(vehicle?.category ?? "");
  const [price, setPrice] = useState(vehicle?.price?.toString() ?? "");
  const [quantity, setQuantity] = useState(vehicle?.quantity?.toString() ?? "");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({
      make,
      model,
      category,
      price: Number(price),
      quantity: Number(quantity),
    });
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-white border border-zinc-200/80 rounded-3xl p-8 shadow-xl shadow-zinc-200/50 space-y-5 max-w-md w-full"
    >
      <div className="space-y-1.5 pb-2">
        <div className="h-1.5 w-10 bg-amber-500 rounded-full mb-2"></div>
        <h2 className="text-2xl font-black tracking-tight text-zinc-950">
          {isEdit ? "Modify Asset Record" : "Provision New Asset"}
        </h2>
        <p className="text-xs text-zinc-500 font-medium">
          Update the global inventory ledger metadata fields below.
        </p>
      </div>

      <div>
        <label htmlFor="form-make" className="block text-xs font-bold text-zinc-700 uppercase tracking-widest mb-1.5">
          Make
        </label>
        <input
          id="form-make"
          type="text"
          value={make}
          onChange={(e) => setMake(e.target.value)}
          required
          className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-950/10 focus:border-zinc-950 transition-all placeholder-zinc-400"
          placeholder="e.g., Porsche"
        />
      </div>

      <div>
        <label htmlFor="form-model" className="block text-xs font-bold text-zinc-700 uppercase tracking-widest mb-1.5">
          Model
        </label>
        <input
          id="form-model"
          type="text"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          required
          className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-950/10 focus:border-zinc-950 transition-all placeholder-zinc-400"
          placeholder="e.g., 911 GT3"
        />
      </div>

      <div>
        <label htmlFor="form-category" className="block text-xs font-bold text-zinc-700 uppercase tracking-widest mb-1.5">
          Category
        </label>
        <input
          id="form-category"
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-950/10 focus:border-zinc-950 transition-all placeholder-zinc-400"
          placeholder="e.g., Sports Car"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="form-price" className="block text-xs font-bold text-zinc-700 uppercase tracking-widest mb-1.5">
            Price ($)
          </label>
          <input
            id="form-price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min={0}
            className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-950/10 focus:border-zinc-950 transition-all placeholder-zinc-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="160000"
          />
        </div>

        <div>
          <label htmlFor="form-quantity" className="block text-xs font-bold text-zinc-700 uppercase tracking-widest mb-1.5">
            Quantity
          </label>
          <input
            id="form-quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            min={0}
            className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-950/10 focus:border-zinc-950 transition-all placeholder-zinc-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="5"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-3">
        <button
          type="submit"
          className="flex-1 bg-zinc-950 hover:bg-zinc-900 text-white font-bold text-xs uppercase tracking-widest py-3 rounded-xl transition-all shadow-lg shadow-zinc-950/10 active:scale-[0.985] cursor-pointer"
        >
          {isEdit ? "Commit Changes" : "Save Asset"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-white border border-zinc-200 text-zinc-800 text-xs font-bold py-3 rounded-xl hover:bg-zinc-50 transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}