import { describe, it, expect } from "vitest";


const stadium = {
    name: "Narendra Modi Stadium",
    location: "Ahmedabad",
    capacity: 132000
};


describe("Stadium Information",()=>{


it("should have stadium name",()=>{

expect(stadium.name)
.toBe("Narendra Modi Stadium");

});


it("should have valid capacity",()=>{

expect(stadium.capacity)
.toBeGreaterThan(0);

});


});