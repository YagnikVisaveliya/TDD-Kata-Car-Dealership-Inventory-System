import { describe, it, expect, vi } from "vitest";
import { onUnauthorized, triggerUnauthorized } from "../../api/authEvents";

describe("authEvents", () => {
  it("calls the registered handler when triggered", () => {
    const handler = vi.fn();
    onUnauthorized(handler);
    triggerUnauthorized();
    expect(handler).toHaveBeenCalled();
  });

  it("calls the latest registered handler, not a stale one", () => {
    const first = vi.fn();
    const second = vi.fn();
    onUnauthorized(first);
    onUnauthorized(second);
    triggerUnauthorized();
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalled();
  });
});