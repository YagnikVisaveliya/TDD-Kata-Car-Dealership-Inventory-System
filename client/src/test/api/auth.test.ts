import { describe, it, expect, vi, beforeEach } from "vitest";
import { login, register } from "../../api/auth";

const { mockPost, mockCreate } = vi.hoisted(() => {
  const mockPost = vi.fn();
  const mockInterceptorUse = vi.fn();
  const mockCreate = vi.fn(() => ({
    post: mockPost,
    interceptors: {
      request: {
        use: mockInterceptorUse,
      },
      response: {
        use: mockInterceptorUse,
      },
    },
  }));

  return { mockPost, mockCreate, mockInterceptorUse };
});

vi.mock("axios", () => ({
  default: {
    create: mockCreate,
    post: mockPost,
  },
  create: mockCreate,
  post: mockPost,
}));

describe("auth api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls login endpoint with email and password", async () => {
    const mockResponse = {
      data: { token: "abc123", user: { id: "1", name: "Alice", email: "a@b.com", role: "CUSTOMER" } },
    };
    mockPost.mockResolvedValue(mockResponse);

    const result = await login("a@b.com", "password123");

    expect(mockPost).toHaveBeenCalledWith("/api/auth/login", {
      email: "a@b.com",
      password: "password123",
    });
    expect(result.user.role).toBe("CUSTOMER");
  });

  it("calls register endpoint with name, email, and password", async () => {
    const mockResponse = {
      data: { token: "xyz789", user: { id: "2", name: "Bob", email: "c@d.com", role: "CUSTOMER" } },
    };
    mockPost.mockResolvedValue(mockResponse);

    const result = await register("Bob", "c@d.com", "password123");

    expect(mockPost).toHaveBeenCalledWith("/api/auth/register", {
      name: "Bob",
      email: "c@d.com",
      password: "password123",
    });
    expect(result.token).toBe("xyz789");
  });
});