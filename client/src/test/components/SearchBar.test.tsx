import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar from "../../components/SearchBar";

describe("SearchBar", () => {
  const onSearch = vi.fn();

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
});