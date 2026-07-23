import { useEffect, useState, useMemo } from "react";
import type { Vehicle, VehicleSearchParams } from "../types/Vehicle";

interface SearchBarProps {
  onSearch: (params: VehicleSearchParams) => void;
  vehicles?: Vehicle[];
}

export default function SearchBar({ onSearch, vehicles = [] }: SearchBarProps) {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Extract unique available Makes from vehicles dataset
  const availableMakes = useMemo(() => {
    const set = new Set<string>();
    vehicles.forEach((v) => {
      if (v.make) set.add(v.make);
    });
    return Array.from(set).sort();
  }, [vehicles]);

  // Extract unique available Models based on currently selected Make
  const availableModels = useMemo(() => {
    const set = new Set<string>();
    const selectedMakeClean = make.trim().toLowerCase();
    
    vehicles.forEach((v) => {
      if (!selectedMakeClean || v.make.toLowerCase() === selectedMakeClean) {
        if (v.model) set.add(v.model);
      }
    });
    return Array.from(set).sort();
  }, [vehicles, make]);

  // Extract unique Categories
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    vehicles.forEach((v) => {
      if (v.category) set.add(v.category);
    });
    return Array.from(set).sort();
  }, [vehicles]);

  // Reset model if current model does not belong to newly selected make
  useEffect(() => {
    if (make && model && availableModels.length > 0) {
      const isModelValid = availableModels.some(
        (m) => m.toLowerCase() === model.trim().toLowerCase()
      );
      if (!isModelValid) {
        setModel("");
      }
    }
  }, [make, availableModels, model]);

  // Debounced search trigger with 1-character search ignore rule
  useEffect(() => {
    const timer = setTimeout(() => {
      const params: VehicleSearchParams = {};

      const cleanMake = make.trim();
      const cleanModel = model.trim();
      const cleanCategory = category.trim();

      // Rule: Ignore single-character searches (must be >= 2 chars)
      if (cleanMake.length >= 2) params.make = cleanMake;
      if (cleanModel.length >= 2) params.model = cleanModel;
      if (cleanCategory.length >= 2) params.category = cleanCategory;

      if (minPrice !== "" && !isNaN(Number(minPrice))) {
        params.minPrice = Number(minPrice);
      }
      if (maxPrice !== "" && !isNaN(Number(maxPrice))) {
        params.maxPrice = Number(maxPrice);
      }

      onSearch(params);
    }, 400);

    return () => clearTimeout(timer);
  }, [make, model, category, minPrice, maxPrice, onSearch]);

  const hasActiveFilters = Boolean(
    make || model || category || minPrice || maxPrice
  );

  const handleReset = () => {
    setMake("");
    setModel("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
  };

  const showMakeHint = make.trim().length === 1;
  const showModelHint = model.trim().length === 1;
  const showCategoryHint = category.trim().length === 1;

  return (
    <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-900">
            Filter Inventory
          </h3>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleReset}
            className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline transition-all cursor-pointer"
          >
            Reset All
          </button>
        )}
      </div>

      {/* Make Filter */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label
            htmlFor="search-make"
            className="block text-xs font-bold text-zinc-700 uppercase tracking-widest"
          >
            Make
          </label>
          {availableMakes.length > 0 && (
            <span className="text-[10px] font-semibold text-zinc-400">
              {availableMakes.length} makes
            </span>
          )}
        </div>
        <div className="relative">
          <input
            id="search-make"
            type="text"
            list="make-options"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder-zinc-400"
            placeholder="e.g., BMW, Porsche..."
          />
          <datalist id="make-options">
            {availableMakes.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
        </div>
        {showMakeHint && (
          <p className="text-[11px] font-medium text-amber-600 flex items-center gap-1 mt-1">
            <span>ℹ️</span> Type at least 2 characters to search make
          </p>
        )}
      </div>

      {/* Model Filter (Dependent on Make) */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label
            htmlFor="search-model"
            className="block text-xs font-bold text-zinc-700 uppercase tracking-widest"
          >
            Model {make.trim().length >= 2 && <span className="text-amber-600 font-bold lowercase">({make})</span>}
          </label>
          {availableModels.length > 0 && (
            <span className="text-[10px] font-semibold text-zinc-400">
              {availableModels.length} models
            </span>
          )}
        </div>
        <div className="relative">
          <input
            id="search-model"
            type="text"
            list="model-options"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder-zinc-400"
            placeholder={
              make.trim()
                ? `Models for ${make}...`
                : "e.g., M4, 911 GT3..."
            }
          />
          <datalist id="model-options">
            {availableModels.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
        </div>
        {showModelHint ? (
          <p className="text-[11px] font-medium text-amber-600 flex items-center gap-1 mt-1">
            <span>ℹ️</span> Type at least 2 characters to search model
          </p>
        ) : make.trim().length >= 2 && availableModels.length > 0 ? (
          <p className="text-[10px] font-medium text-zinc-500">
            Showing models matching make <strong className="text-zinc-800">{make}</strong>
          </p>
        ) : null}
      </div>

      {/* Category Filter */}
      <div className="space-y-1.5">
        <label
          htmlFor="search-category"
          className="block text-xs font-bold text-zinc-700 uppercase tracking-widest"
        >
          Category
        </label>
        <div className="relative">
          <input
            id="search-category"
            type="text"
            list="category-options"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder-zinc-400"
            placeholder="e.g., Coupe, SUV..."
          />
          <datalist id="category-options">
            {availableCategories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
        {showCategoryHint && (
          <p className="text-[11px] font-medium text-amber-600 flex items-center gap-1 mt-1">
            <span>ℹ️</span> Type at least 2 characters to search category
          </p>
        )}
      </div>

      {/* Price Range Filter */}
      <div className="space-y-2 pt-2 border-t border-zinc-100">
        <span className="block text-xs font-bold text-zinc-700 uppercase tracking-widest">
          Price Range ($)
        </span>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="search-min-price"
              className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1"
            >
              Min Price
            </label>
            <input
              id="search-min-price"
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder-zinc-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="0"
            />
          </div>

          <div>
            <label
              htmlFor="search-max-price"
              className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1"
            >
              Max Price
            </label>
            <input
              id="search-max-price"
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder-zinc-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="150000"
            />
          </div>
        </div>
      </div>
    </div>
  );
}