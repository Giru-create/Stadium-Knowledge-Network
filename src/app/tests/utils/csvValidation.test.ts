import { describe, it, expect } from "vitest";

interface CSVRow {
  name: string;
  city: string;
  capacity: number;
}

function validateCSV(row: CSVRow) {
  return (
    row.name &&
    row.city &&
    row.capacity
  );
}

describe("CSV Validation", () => {

  it("should accept valid stadium row", () => {

    const row: CSVRow = {
      name: "Eden Gardens",
      city: "Kolkata",
      capacity: 66000
    };

    expect(validateCSV(row))
      .toBeTruthy();

  });

});