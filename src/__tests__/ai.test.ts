import { describe, it, expect } from "vitest";


function generateInsight(capacity:number){

if(capacity > 80000){
    return "Large Stadium";
}

return "Small Stadium";

}


describe("AI Stadium Insight",()=>{


it("should identify large stadium",()=>{

const result = generateInsight(100000);

expect(result)
.toBe("Large Stadium");

});


});