import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../../context/AuthContext";
import NotFoundPage from "../../pages/NotFoundPage";

describe("NotFoundPage component", () => {
  it("renders 404 badge, header message and return link", () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <NotFoundPage />
        </MemoryRouter>
      </AuthProvider>
    );

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Route Off Grid/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Return to Sign In/i })).toBeInTheDocument();
  });
});
