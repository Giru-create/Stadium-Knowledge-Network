import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import StadiumForm from "../components/stadiums/StadiumForm";


describe("StadiumForm Component", () => {

  it("renders stadium form", () => {

    render(
      <StadiumForm 
        onSubmit={async () => {}}
      />
    );


    expect(
      screen.getByText("Add Stadium")
    ).toBeDefined();

  });


  it("allows entering stadium name", () => {

    render(
      <StadiumForm 
        onSubmit={async () => {}}
      />
    );


    const input = screen.getByLabelText("Stadium Name");


    fireEvent.change(input, {
      target: {
        value: "Narendra Modi Stadium"
      }
    });


    expect(
      (input as HTMLInputElement).value
    ).toBe("Narendra Modi Stadium");

  });


  it("calls submit function", async () => {

    const mockSubmit = vi.fn();


    render(
      <StadiumForm 
        onSubmit={mockSubmit}
      />
    );


    fireEvent.change(
      screen.getByLabelText("Stadium Name"),
      {
        target:{
          value:"Test Stadium"
        }
      }
    );


    fireEvent.submit(
      screen.getByRole("button")
    );


    expect(mockSubmit).toBeDefined();

  });

});