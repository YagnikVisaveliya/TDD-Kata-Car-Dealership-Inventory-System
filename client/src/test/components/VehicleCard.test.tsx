import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VehicleCard from "../../components/VehicleCard";
import type { Vehicle } from "../../types/Vehicle";

const vehicle: Vehicle = {
  id: "v1",
  make: "Toyota",
  model: "Corolla",
  category: "Sedan",
  price: 22000,
  quantity: 3,
};

describe("VehicleCard", () => {
  it("renders vehicle details", () => {
    render(<VehicleCard vehicle={vehicle} onPurchase={vi.fn()} isAdmin={false} />);
    expect(screen.getByRole('heading', { name: /Toyota Corolla/i })).toBeInTheDocument();
    expect(screen.getByText(/22,000|22000/)).toBeInTheDocument();
    expect(screen.getByText(/3 units left/i)).toBeInTheDocument();
  });

  it("enables the Purchase button when quantity > 0", () => {
    render(<VehicleCard vehicle={vehicle} onPurchase={vi.fn()} isAdmin={false} />);
    expect(screen.getByRole("button", { name: /purchase/i })).toBeEnabled();
  });

  it("disables the Purchase button when quantity is 0", () => {
    render(
      <VehicleCard vehicle={{ ...vehicle, quantity: 0 }} onPurchase={vi.fn()} isAdmin={false} />
    );
    expect(screen.getByRole("button", { name: /out of stock/i })).toBeDisabled();
  });

  it("calls onPurchase with the vehicle id when clicked", async () => {
    const onPurchase = vi.fn();
    render(<VehicleCard vehicle={vehicle} onPurchase={onPurchase} isAdmin={false} />);
    await userEvent.click(screen.getByRole("button", { name: /purchase/i }));
    expect(onPurchase).toHaveBeenCalledWith("v1");
  });

  it("shows admin controls only when isAdmin is true", () => {
    const { rerender } = render(
      <VehicleCard vehicle={vehicle} onPurchase={vi.fn()} isAdmin={false} />
    );
    expect(screen.queryByRole("button", { name: /modify/i })).not.toBeInTheDocument();

    rerender(<VehicleCard vehicle={vehicle} onPurchase={vi.fn()} isAdmin={true} />);
    expect(screen.getByRole("button", { name: /modify/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /remove/i })).toBeInTheDocument();
  });
  it("shows a restock button for admins and opens restock input when clicked", async () => {
    render(<VehicleCard vehicle={vehicle} onPurchase={vi.fn()} isAdmin={true} onRestock={vi.fn()} />);
    const restockBtn = screen.getByRole("button", { name: /^restock$/i });
    expect(restockBtn).toBeInTheDocument();

    await userEvent.click(restockBtn);
    expect(screen.getByLabelText(/restock count/i)).toBeInTheDocument();
  });

  it("does not show restock controls for non-admins", () => {
    render(<VehicleCard vehicle={vehicle} onPurchase={vi.fn()} isAdmin={false} onRestock={vi.fn()} />);
    expect(screen.queryByRole("button", { name: /^restock$/i })).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/restock count/i)).not.toBeInTheDocument();
  });

  it("calls onRestock with id and entered quantity", async () => {
    const onRestock = vi.fn();
    render(<VehicleCard vehicle={vehicle} onPurchase={vi.fn()} isAdmin={true} onRestock={onRestock} />);

    await userEvent.click(screen.getByRole("button", { name: /^restock$/i }));
    await userEvent.type(screen.getByLabelText(/restock count/i), "5");
    const submitBtns = screen.getAllByRole("button", { name: /^restock$/i });
    await userEvent.click(submitBtns[submitBtns.length - 1]);

    expect(onRestock).toHaveBeenCalledWith("v1", 5);
  });

  it("does not call onRestock if quantity field is empty", async () => {
    const onRestock = vi.fn();
    render(<VehicleCard vehicle={vehicle} onPurchase={vi.fn()} isAdmin={true} onRestock={onRestock} />);

    await userEvent.click(screen.getByRole("button", { name: /^restock$/i }));
    const submitBtns = screen.getAllByRole("button", { name: /^restock$/i });
    await userEvent.click(submitBtns[submitBtns.length - 1]);

    expect(onRestock).not.toHaveBeenCalled();
  });
});