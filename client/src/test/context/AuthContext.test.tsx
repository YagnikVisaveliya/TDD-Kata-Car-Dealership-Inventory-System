import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Cookies from "js-cookie";
import { AuthProvider, useAuth } from "../../context/AuthContext";
import * as authApi from "../../api/auth";

vi.mock("../../api/auth");

function TestConsumer() {
  const { user, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="user">{user ? user.email : "none"}</span>
      <button onClick={() => login("a@b.com", "password123")}>login</button>
      <button onClick={logout}>logout</button>
    </div>
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    Cookies.remove("token");
    Cookies.remove("user");
    vi.clearAllMocks();
  });

  it("sets user and stores token cookie on login", async () => {
    vi.spyOn(authApi, "login").mockResolvedValue({
      token: "abc123",
      user: { id: "1", name: "Alice", email: "a@b.com", role: "CUSTOMER" },
    });

    render(<AuthProvider><TestConsumer /></AuthProvider>);
    await act(async () => {
      await userEvent.click(screen.getByText("login"));
    });

    expect(screen.getByTestId("user").textContent).toBe("a@b.com");
    expect(Cookies.get("token")).toBe("abc123");
  });

  it("clears cookies and user on logout", async () => {
    vi.spyOn(authApi, "login").mockResolvedValue({
      token: "abc123",
      user: { id: "1", name: "Alice", email: "a@b.com", role: "CUSTOMER" },
    });

    render(<AuthProvider><TestConsumer /></AuthProvider>);
    await act(async () => {
      await userEvent.click(screen.getByText("login"));
      await userEvent.click(screen.getByText("logout"));
    });

    expect(screen.getByTestId("user").textContent).toBe("none");
    expect(Cookies.get("token")).toBeUndefined();
  });
});