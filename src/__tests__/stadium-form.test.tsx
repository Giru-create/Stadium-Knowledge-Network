import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

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


    const input = screen.getByLabelText(
      "Stadium Name"
    ) as HTMLInputElement;


    fireEvent.change(input, {
      target: {
        value: "Narendra Modi Stadium"
      }
    });


    expect(input.value)
      .toBe("Narendra Modi Stadium");

  });



  it("calls submit function successfully", async () => {

    const mockSubmit = vi.fn()
      .mockResolvedValue(undefined);


    render(
      <StadiumForm
        onSubmit={mockSubmit}
      />
    );


    // Fill required fields

    fireEvent.change(
      screen.getByLabelText("Stadium Name"),
      {
        target: {
          value: "Test Stadium"
        }
      }
    );


    fireEvent.change(
      screen.getByLabelText("City"),
      {
        target: {
          value: "Ahmedabad"
        }
      }
    );


    fireEvent.change(
      screen.getByLabelText("Country"),
      {
        target: {
          value: "India"
        }
      }
    );


    fireEvent.change(
      screen.getByLabelText("Capacity"),
      {
        target: {
          value: "50000"
        }
      }
    );


    fireEvent.submit(
      screen.getByRole("button")
    );


    await waitFor(() => {

      expect(mockSubmit)
        .toHaveBeenCalledTimes(1);

    });

  });

});