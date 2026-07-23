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
    expect(screen.getByText("Toyota Corolla")).toBeInTheDocument();
    expect(screen.getByText(/22,000|22000/)).toBeInTheDocument();
    expect(screen.getByText(/3 in stock/i)).toBeInTheDocument();
  });

  it("enables the Purchase button when quantity > 0", () => {
    render(<VehicleCard vehicle={vehicle} onPurchase={vi.fn()} isAdmin={false} />);
    expect(screen.getByRole("button", { name: /purchase/i })).toBeEnabled();
  });

  it("disables the Purchase button when quantity is 0", () => {
    render(
      <VehicleCard vehicle={{ ...vehicle, quantity: 0 }} onPurchase={vi.fn()} isAdmin={false} />
    );
    expect(screen.getByRole("button", { name: /purchase/i })).toBeDisabled();
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
    expect(screen.queryByRole("button", { name: /edit/i })).not.toBeInTheDocument();

    rerender(<VehicleCard vehicle={vehicle} onPurchase={vi.fn()} isAdmin={true} />);
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });
});