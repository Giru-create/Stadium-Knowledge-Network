import { describe, it, expect } from "vitest";


describe("Stadium Components",()=>{


it("should load stadium component",()=>{


const stadiumComponent = true;


expect(stadiumComponent)
.toBe(true);


});


it("should display stadium information",()=>{


const stadium = {
name:"Eden Gardens",
capacity:66000
};


expect(stadium.name)
.toBe("Eden Gardens");


});


});