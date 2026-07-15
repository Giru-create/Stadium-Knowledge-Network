import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { IncidentCard } from "@/components/common/IncidentCard";

const mockIncident = {
  id: "incident-001",
  matchId: "match-001",
  stadiumId: "stadium-001",
  stadiumName: "Estadio Azteca",
  type: "Heavy Rain",
  severity: "High" as const,
  description: "Heavy rainfall causing crowd congestion",
  timestamp: "2026-07-15T10:30:00.000Z",
  status: "Active" as const,
};

describe("IncidentCard Component", () => {

  it("renders full incident card correctly", () => {

    render(
      <IncidentCard
        incident={mockIncident}
        onResolve={vi.fn()}
      />
    );


    expect(
      screen.getByText("Heavy Rain")
    ).toBeInTheDocument();


    expect(
      screen.getByText(
        "Heavy rainfall causing crowd congestion"
      )
    ).toBeInTheDocument();


    expect(
      screen.getByText("Resolve Alert")
    ).toBeInTheDocument();

  });



  it("calls onResolve when Resolve Alert button is clicked", () => {

    const resolveMock = vi.fn();


    render(
      <IncidentCard
        incident={mockIncident}
        onResolve={resolveMock}
      />
    );


    fireEvent.click(
      screen.getByText("Resolve Alert")
    );


    expect(resolveMock)
      .toHaveBeenCalledTimes(1);


    expect(resolveMock)
      .toHaveBeenCalledWith("incident-001");

  });



  it("renders compact mode correctly", () => {

    render(
      <IncidentCard
        incident={mockIncident}
        onResolve={vi.fn()}
        compact
      />
    );


    expect(
      screen.getByText("Heavy Rain")
    ).toBeInTheDocument();


    expect(
      screen.getByText("Resolve")
    ).toBeInTheDocument();

  });



  it("calls onResolve in compact mode", () => {

    const resolveMock = vi.fn();


    render(
      <IncidentCard
        incident={mockIncident}
        onResolve={resolveMock}
        compact={true}
      />
    );


    fireEvent.click(
      screen.getByText("Resolve")
    );


    expect(resolveMock)
      .toHaveBeenCalledWith(
        "incident-001"
      );

  });



  it("renders accessible button label", () => {

    render(
      <IncidentCard
        incident={mockIncident}
        onResolve={vi.fn()}
      />
    );


    expect(
      screen.getByLabelText(
        "Resolve incident: Heavy Rain"
      )
    ).toBeInTheDocument();

  });

});