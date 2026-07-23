import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar from "../../components/SearchBar";
import type { Vehicle } from "../../types/Vehicle";

describe("SearchBar", () => {
  const onSearch = vi.fn();

  const mockVehicles: Vehicle[] = [
    { id: "1", make: "BMW", model: "M4", category: "Coupe", price: 80000, quantity: 5 },
    { id: "2", make: "BMW", model: "M3", category: "Sedan", price: 75000, quantity: 3 },
    { id: "3", make: "Porsche", model: "911 GT3", category: "Sport Car", price: 160000, quantity: 2 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  it("renders inputs for make, model, category, and price range", () => {
    render(<SearchBar onSearch={onSearch} />);
    expect(screen.getByLabelText(/make/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/model/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/min price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/max price/i)).toBeInTheDocument();
  });

  it("calls onSearch with the entered make after debounce", async () => {
    const user = userEvent.setup({ delay: null });
    render(<SearchBar onSearch={onSearch} />);

    await user.type(screen.getByLabelText(/make/i), "Toyota");
    vi.advanceTimersByTime(500);

    expect(onSearch).toHaveBeenCalledWith(
      expect.objectContaining({ make: "Toyota" })
    );
  });

  it("ignores single-character search inputs (1 character rule)", async () => {
    const user = userEvent.setup({ delay: null });
    render(<SearchBar onSearch={onSearch} />);

    // Type 1 char 'B'
    await user.type(screen.getByLabelText(/make/i), "B");
    vi.advanceTimersByTime(500);

    // Expect search was called, but without 'make' param (ignored)
    const lastCallArgs = onSearch.mock.calls[onSearch.mock.calls.length - 1][0];
    expect(lastCallArgs).not.toHaveProperty("make");

    // Expect helper text hint to be shown
    expect(screen.getByText(/type at least 2 characters/i)).toBeInTheDocument();

    // Now type second char 'M' -> "BM"
    await user.type(screen.getByLabelText(/make/i), "M");
    vi.advanceTimersByTime(500);

    const callAfterSecondChar = onSearch.mock.calls[onSearch.mock.calls.length - 1][0];
    expect(callAfterSecondChar).toHaveProperty("make", "BM");
  });

  it("combines multiple filters into one onSearch call", async () => {
    const user = userEvent.setup({ delay: null });
    render(<SearchBar onSearch={onSearch} />);

    await user.type(screen.getByLabelText(/make/i), "Honda");
    await user.type(screen.getByLabelText(/category/i), "SUV");
    vi.advanceTimersByTime(500);

    expect(onSearch).toHaveBeenLastCalledWith(
      expect.objectContaining({ make: "Honda", category: "SUV" })
    );
  });

  it("omits empty fields from the search params", async () => {
    const user = userEvent.setup({ delay: null });
    render(<SearchBar onSearch={onSearch} />);

    await user.type(screen.getByLabelText(/make/i), "Ford");
    vi.advanceTimersByTime(500);

    const lastCallArgs = onSearch.mock.calls[onSearch.mock.calls.length - 1][0];
    expect(lastCallArgs).not.toHaveProperty("model");
    expect(lastCallArgs).not.toHaveProperty("category");
  });

  it("filters model datalist options based on selected make", async () => {
    const user = userEvent.setup({ delay: null });
    render(<SearchBar vehicles={mockVehicles} onSearch={onSearch} />);

    // Type BMW in Make input
    await user.type(screen.getByLabelText(/make/i), "BMW");
    vi.advanceTimersByTime(500);

    // Model options for BMW should be present in datalist
    const modelOptions = document.querySelectorAll("#model-options option");
    const optionValues = Array.from(modelOptions).map((opt) => (opt as HTMLOptionElement).value);

    expect(optionValues).toContain("M4");
    expect(optionValues).toContain("M3");
    expect(optionValues).not.toContain("911 GT3");
  });
});