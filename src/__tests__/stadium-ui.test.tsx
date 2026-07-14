import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import StadiumCard from "../components/stadiums/StadiumCard";


describe("StadiumCard Component", () => {

  it("renders stadium information", () => {

    const stadium = {
      id: "stadium001",
      name: "Narendra Modi Stadium",
      city: "Ahmedabad",
      country: "India",
      capacity: 132000,
      latitude: 23.09,
      longitude: 72.59,
      climate: "Hot",
      zones: [],
      status: "Online" as const
    };

    render(
      <StadiumCard stadium={stadium} />
    );

    expect(
      screen.getByText("Narendra Modi Stadium")
    ).toBeDefined();

  });

});