import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../context/AuthContext";

vi.mock("../../context/AuthContext");

function renderWithRoute(initialPath: string, requiredRole?: "ADMIN") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole={requiredRole}>
              <div>Dashboard Content</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe("ProtectedRoute", () => {
  it("redirects to login when no user is present", () => {
    (useAuth as any).mockReturnValue({ user: null, loading: false });
    renderWithRoute("/dashboard");
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("renders children when user is authenticated", () => {
    (useAuth as any).mockReturnValue({
      user: { id: "1", name: "Alice", email: "a@b.com", role: "CUSTOMER" },
      loading: false,
    });
    renderWithRoute("/dashboard");
    expect(screen.getByText("Dashboard Content")).toBeInTheDocument();
  });

  it("redirects to dashboard when role does not match requiredRole", () => {
    (useAuth as any).mockReturnValue({
      user: { id: "1", name: "Alice", email: "a@b.com", role: "CUSTOMER" },
      loading: false,
    });
    renderWithRoute("/dashboard", "ADMIN");
    expect(screen.queryByText("Dashboard Content")).not.toBeInTheDocument();
  });

  it("renders children when role matches requiredRole", () => {
    (useAuth as any).mockReturnValue({
      user: { id: "1", name: "Admin", email: "admin@b.com", role: "ADMIN" },
      loading: false,
    });
    renderWithRoute("/dashboard", "ADMIN");
    expect(screen.getByText("Dashboard Content")).toBeInTheDocument();
  });
});