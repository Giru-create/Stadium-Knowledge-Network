import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { IncidentEvent } from "@/types";
import { IncidentCard } from "../components/common/IncidentCard";


describe("IncidentCard Component", () => {

  it("renders incident information", () => {

const incident: IncidentEvent = {
  id: "incident001",
  matchId: "match001",
  stadiumId: "stadium001",
  stadiumName: "Narendra Modi Stadium",
  type: "Heavy Rain",
  severity: "High",
  description: "Heavy rain detected in stadium",
  timestamp: new Date().toISOString(),
  status: "Active"
};

    render(
      <IncidentCard
        incident={incident}
        onResolve={() => {}}
      />
    );

    expect(
      screen.getByText("Heavy Rain")
    ).toBeDefined();

  });

});