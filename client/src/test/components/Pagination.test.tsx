import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Pagination from "../../components/Pagination";

describe("Pagination component", () => {
  it("renders page info and navigation buttons correctly", () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        totalItems={45}
        pageSize={9}
        onPageChange={() => {}}
      />
    );

    expect(screen.getByText(/Showing/i)).toHaveTextContent("Showing 10 - 18 of 45 assets");
    expect(screen.getByRole("button", { name: /Previous/i })).not.toBeDisabled();
    expect(screen.getByRole("button", { name: /Next/i })).not.toBeDisabled();
    expect(screen.getByRole("button", { name: "Page 2" })).toHaveAttribute("aria-current", "page");
  });

  it("disables Previous button on first page and Next button on last page", () => {
    const { rerender } = render(
      <Pagination
        currentPage={1}
        totalPages={3}
        totalItems={27}
        pageSize={9}
        onPageChange={() => {}}
      />
    );

    expect(screen.getByRole("button", { name: /Previous/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Next/i })).not.toBeDisabled();

    rerender(
      <Pagination
        currentPage={3}
        totalPages={3}
        totalItems={27}
        pageSize={9}
        onPageChange={() => {}}
      />
    );

    expect(screen.getByRole("button", { name: /Previous/i })).not.toBeDisabled();
    expect(screen.getByRole("button", { name: /Next/i })).toBeDisabled();
  });

  it("calls onPageChange when Next or specific page button is clicked", async () => {
    const user = userEvent.setup();
    const handlePageChange = vi.fn();

    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        totalItems={45}
        pageSize={9}
        onPageChange={handlePageChange}
      />
    );

    await user.click(screen.getByRole("button", { name: /Next/i }));
    expect(handlePageChange).toHaveBeenCalledWith(2);

    await user.click(screen.getByRole("button", { name: "Page 3" }));
    expect(handlePageChange).toHaveBeenCalledWith(3);
  });

  it("calls onPageSizeChange when per page select option is changed", async () => {
    const user = userEvent.setup();
    const handlePageSizeChange = vi.fn();

    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        totalItems={45}
        pageSize={9}
        onPageChange={() => {}}
        onPageSizeChange={handlePageSizeChange}
      />
    );

    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "18");
    expect(handlePageSizeChange).toHaveBeenCalledWith(18);
  });

  it("returns null when totalItems is 0", () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={0}
        totalItems={0}
        pageSize={9}
        onPageChange={() => {}}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});
