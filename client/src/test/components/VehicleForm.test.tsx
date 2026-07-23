import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VehicleForm from "../../components/VehicleForm";
import type { Vehicle } from "../../types/Vehicle";

const existingVehicle: Vehicle = {
  id: "v1",
  make: "Toyota",
  model: "Corolla",
  category: "Sedan",
  price: 22000,
  quantity: 5,
};

describe("VehicleForm", () => {
  it("renders empty fields in add mode", () => {
    render(<VehicleForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByLabelText(/make/i)).toHaveValue("");
    expect(screen.getByRole("button", { name: /add vehicle/i })).toBeInTheDocument();
  });

  it("pre-fills fields in edit mode", () => {
    render(<VehicleForm vehicle={existingVehicle} onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByLabelText(/make/i)).toHaveValue("Toyota");
    expect(screen.getByLabelText(/model/i)).toHaveValue("Corolla");
    expect(screen.getByRole("button", { name: /update vehicle/i })).toBeInTheDocument();
  });

  it("calls onSubmit with form values when adding a new vehicle", async () => {
    const onSubmit = vi.fn();
    render(<VehicleForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    await userEvent.type(screen.getByLabelText(/make/i), "Honda");
    await userEvent.type(screen.getByLabelText(/model/i), "Civic");
    await userEvent.type(screen.getByLabelText(/category/i), "Sedan");
    await userEvent.type(screen.getByLabelText(/price/i), "20000");
    await userEvent.type(screen.getByLabelText(/quantity/i), "4");
    await userEvent.click(screen.getByRole("button", { name: /add vehicle/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      make: "Honda",
      model: "Civic",
      category: "Sedan",
      price: 20000,
      quantity: 4,
    });
  });

  it("calls onSubmit with updated values when editing", async () => {
    const onSubmit = vi.fn();
    render(<VehicleForm vehicle={existingVehicle} onSubmit={onSubmit} onCancel={vi.fn()} />);

    const priceInput = screen.getByLabelText(/price/i);
    await userEvent.clear(priceInput);
    await userEvent.type(priceInput, "21000");
    await userEvent.click(screen.getByRole("button", { name: /update vehicle/i }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ price: 21000 })
    );
  });

  it("calls onCancel when cancel button is clicked", async () => {
    const onCancel = vi.fn();
    render(<VehicleForm onSubmit={vi.fn()} onCancel={onCancel} />);
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalled();
  });
});