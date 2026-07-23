import { useState, useEffect } from "react";
import type { Vehicle } from "../types/Vehicle";

interface SearchBarProps {
  onSearch: (filters: {
    make?: string;
    model?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => void;
  vehicles?: Vehicle[];
}

export default function SearchBar({ onSearch, vehicles = [] }: SearchBarProps) {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const availableMakes = Array.from(
    new Set(vehicles.map((v) => v.make).filter(Boolean))
  ).sort();

  const filteredVehiclesByMake = make.trim()
    ? vehicles.filter((v) => v.make.toLowerCase() === make.trim().toLowerCase())
    : vehicles;

  const availableModels = Array.from(
    new Set(filteredVehiclesByMake.map((v) => v.model).filter(Boolean))
  ).sort();

  const availableCategories = Array.from(
    new Set(vehicles.map((v) => v.category).filter(Boolean))
  ).sort();

  useEffect(() => {
    if (
      model.trim() &&
      availableModels.length > 0 &&
      !availableModels.some((m) => m.toLowerCase() === model.trim().toLowerCase())
    ) {
      setModel("");
    }
  }, [make, availableModels, model]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const activeMake = make.trim().length >= 2 ? make.trim() : undefined;
      const activeModel = model.trim().length >= 2 ? model.trim() : undefined;
      const activeCategory = category.trim().length >= 2 ? category.trim() : undefined;

      onSearch({
        make: activeMake,
        model: activeModel,
        category: activeCategory,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [make, model, category, minPrice, maxPrice, onSearch]);

  const hasActiveFilters = Boolean(
    make.trim() || model.trim() || category.trim() || minPrice || maxPrice
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
    <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-sm space-y-4">
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
            className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline transition-all cursor-pointer"
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
            <span className="text-xs font-semibold text-zinc-400">
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
          <p className="text-xs font-medium text-amber-600 flex items-center gap-1 mt-1">
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
            <span className="text-xs font-semibold text-zinc-400">
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
          <p className="text-xs font-medium text-amber-600 flex items-center gap-1 mt-1">
            <span>ℹ️</span> Type at least 2 characters to search model
          </p>
        ) : make.trim().length >= 2 && availableModels.length > 0 ? (
          <p className="text-xs font-medium text-zinc-500">
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
          <p className="text-xs font-medium text-amber-600 flex items-center gap-1 mt-1">
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
              className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1"
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
              className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1"
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