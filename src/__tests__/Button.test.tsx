import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "../components/ui/Button";


describe("Button Component", () => {


  it("renders button with children", () => {

    render(
      <Button>
        Click Me
      </Button>
    );


    expect(
      screen.getByRole("button")
    )
    .toBeInTheDocument();


    expect(
      screen.getByText("Click Me")
    )
    .toBeInTheDocument();


  });





  it("uses primary variant by default", () => {


    render(
      <Button>
        Primary
      </Button>
    );


    const button =
      screen.getByRole("button");


    expect(button.className)
      .toContain("bg-gradient-to-r");


  });






  it("renders secondary variant", () => {


    render(
      <Button variant="secondary">
        Secondary
      </Button>
    );


    expect(
      screen.getByRole("button").className
    )
    .toContain("bg-slate-800");


  });






  it("renders emerald variant", () => {


    render(
      <Button variant="emerald">
        Success
      </Button>
    );


    expect(
      screen.getByRole("button").className
    )
    .toContain("bg-emerald-600");


  });






  it("renders rose variant", () => {


    render(
      <Button variant="rose">
        Delete
      </Button>
    );


    expect(
      screen.getByRole("button").className
    )
    .toContain("bg-rose-600");


  });







  it("renders ghost variant", () => {


    render(
      <Button variant="ghost">
        Ghost
      </Button>
    );


    expect(
      screen.getByRole("button").className
    )
    .toContain("text-slate-400");


  });







  it("supports different sizes", () => {


    const { rerender } =
      render(
        <Button size="sm">
          Small
        </Button>
      );


    expect(
      screen.getByRole("button").className
    )
    .toContain("px-3");



    rerender(
      <Button size="lg">
        Large
      </Button>
    );


    expect(
      screen.getByRole("button").className
    )
    .toContain("px-6");


  });







  it("shows loading spinner when loading", () => {


    render(
      <Button loading>
        Loading
      </Button>
    );


    const button =
      screen.getByRole("button");


    expect(button)
      .toBeDisabled();


    expect(button)
      .toHaveAttribute(
        "aria-disabled",
        "true"
      );


    expect(
      button.querySelector("span")
    )
    .toBeTruthy();


  });







  it("disables button when disabled prop is true", () => {


    render(
      <Button disabled>
        Disabled
      </Button>
    );


    expect(
      screen.getByRole("button")
    )
    .toBeDisabled();


  });






  it("passes extra props correctly", () => {


    render(
      <Button
        aria-label="test-button"
        type="submit"
      >
        Submit
      </Button>
    );



    const button =
      screen.getByLabelText(
        "test-button"
      );


    expect(button)
      .toHaveAttribute(
        "type",
        "submit"
      );


  });



});