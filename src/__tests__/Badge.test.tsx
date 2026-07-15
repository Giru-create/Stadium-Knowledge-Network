import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "../components/ui/Badge";


describe("Badge Component", () => {


  it("renders children correctly", () => {


    render(
      <Badge>
        Active
      </Badge>
    );


    expect(
      screen.getByText("Active")
    )
    .toBeInTheDocument();


  });






  it("uses neutral variant by default", () => {


    render(
      <Badge>
        Neutral
      </Badge>
    );


    const badge =
      screen.getByText("Neutral");


    expect(badge.className)
      .toContain("bg-slate-800");


  });






  it("renders primary variant", () => {


    render(
      <Badge variant="primary">
        Primary
      </Badge>
    );


    expect(
      screen.getByText("Primary").className
    )
    .toContain("bg-indigo-500");


  });






  it("renders success variant", () => {


    render(
      <Badge variant="success">
        Success
      </Badge>
    );


    expect(
      screen.getByText("Success").className
    )
    .toContain("bg-emerald-500");


  });






  it("renders warning variant", () => {


    render(
      <Badge variant="warning">
        Warning
      </Badge>
    );


    expect(
      screen.getByText("Warning").className
    )
    .toContain("bg-amber-500");


  });






  it("renders danger variant", () => {


    render(
      <Badge variant="danger">
        Danger
      </Badge>
    );


    expect(
      screen.getByText("Danger").className
    )
    .toContain("bg-rose-500");


  });






  it("renders info variant", () => {


    render(
      <Badge variant="info">
        Info
      </Badge>
    );


    expect(
      screen.getByText("Info").className
    )
    .toContain("bg-sky-500");


  });







  it("accepts custom className", () => {


    render(
      <Badge className="custom-class">
        Custom
      </Badge>
    );


    expect(
      screen.getByText("Custom").className
    )
    .toContain("custom-class");


  });



});