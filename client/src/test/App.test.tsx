import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from '../App';

describe("App component", () => {
    it("should render the login page on the default route", () => {
        render(<App />);
        //  This passes cleanly with the new Minimalist theme layout
        const heading = screen.getByRole('heading', { name: /Sign in to Fleet\./i });
        expect(heading).toBeInTheDocument();
    });
});