import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from '../App';

describe("App component", () => {
    it("should render the login page on the default route", () => {
        render(<App />);
        expect(screen.getByRole("heading", { name: "Log In" })).toBeInTheDocument();
    });
});