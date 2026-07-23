import { useEffect, useState } from "react";
import type { VehicleSearchParams } from "../types/Vehicle";

interface SearchBarProps {
  onSearch: (params: VehicleSearchParams) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      const params: VehicleSearchParams = {};
      if (make) params.make = make;
      if (model) params.model = model;
      if (category) params.category = category;
      if (minPrice) params.minPrice = Number(minPrice);
      if (maxPrice) params.maxPrice = Number(maxPrice);
      onSearch(params);
    }, 500);

    return () => clearTimeout(timer);
  }, [make, model, category, minPrice, maxPrice, onSearch]);

  return (
    <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8 shadow-sm">
      
      <div>
        <label htmlFor="search-make" className="block text-xs font-bold text-zinc-700 uppercase tracking-widest mb-1.5">
          Make
        </label>
        <input
          id="search-make"
          type="text"
          value={make}
          onChange={(e) => setMake(e.target.value)}
          className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-950/10 focus:border-zinc-950 transition-all placeholder-zinc-400"
          placeholder="e.g., BMW"
        />
      </div>

      <div>
        <label htmlFor="search-model" className="block text-xs font-bold text-zinc-700 uppercase tracking-widest mb-1.5">
          Model
        </label>
        <input
          id="search-model"
          type="text"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-950/10 focus:border-zinc-950 transition-all placeholder-zinc-400"
          placeholder="e.g., M4"
        />
      </div>

      <div>
        <label htmlFor="search-category" className="block text-xs font-bold text-zinc-700 uppercase tracking-widest mb-1.5">
          Category
        </label>
        <input
          id="search-category"
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-950/10 focus:border-zinc-950 transition-all placeholder-zinc-400"
          placeholder="e.g., Coupe"
        />
      </div>

      <div>
        <label htmlFor="search-min-price" className="block text-xs font-bold text-zinc-700 uppercase tracking-widest mb-1.5">
          Min Price
        </label>
        <input
          id="search-min-price"
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-950/10 focus:border-zinc-950 transition-all placeholder-zinc-400[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          placeholder="0"
        />
      </div>

      <div>
        <label htmlFor="search-max-price" className="block text-xs font-bold text-zinc-700 uppercase tracking-widest mb-1.5">
          Max Price
        </label>
        <input
          id="search-max-price"
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-950/10 focus:border-zinc-950 transition-all placeholder-zinc-400[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          placeholder="150000"
        />
      </div>

    </div>
  );
}