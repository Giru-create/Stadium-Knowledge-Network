import { describe, it, expect } from "vitest";

const stadium = {
    name: "Narendra Modi Stadium",
    city: "Ahmedabad",
    capacity: 132000
};


describe("Stadium Data Test",()=>{

    it("should contain stadium name",()=>{

        expect(stadium.name)
        .toBe("Narendra Modi Stadium");

    });


    it("should have valid capacity",()=>{

        expect(stadium.capacity)
        .toBeGreaterThan(10000);

    });

});