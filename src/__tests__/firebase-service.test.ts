import { describe, it, expect } from "vitest";

import {
  playbookService,
  recommendationService,
  telemetryService
} from "../lib/firebase";


describe("Firebase Playbook Service", () => {


  it("should create a playbook", async () => {

    const playbook = await playbookService.createPlaybook({

      title: "Rain Emergency Protocol",
      eventType: "Heavy Rain",
      stadiumId: "stadium001",
      stadiumName: "Test Stadium",
      problem: "Heavy rain issue",
      rootCause: "Weather",
      operationalRisk: "Crowd congestion",
      recommendedActions: [
        "Open emergency exits"
      ],
      expectedImpact: "Better crowd flow",
      lessonsLearned: "Improve weather monitoring",
      confidenceScore: 90,
      alternativeStrategy: "Use backup routes",
      createdAt: new Date().toISOString()

    });


    expect(playbook).toHaveProperty("id");

    expect(playbook.title)
      .toBe("Rain Emergency Protocol");


  });



it("should search playbooks", async()=>{

    const results =
      await playbookService.searchPlaybooks(
        "stadium"
      );

    expect(Array.isArray(results))
      .toBe(true);

});


});



describe("Recommendation Service",()=>{


it("should create AI recommendation", async()=>{


const recommendation =
await recommendationService.createRecommendation({

matchId:"match001",
stadiumId:"stadium001",
incidentId:"incident001",
eventType:"Heavy Rain",
playbookId:"pb001",
playbookTitle:"Rain Protocol",

title:"Open Emergency Gates",

description:"Reduce crowd pressure",

actions:[
{
action:"Open gates",
status:"Pending"
}
],

explanation:"AI generated recommendation",

createdAt:new Date().toISOString()

});


expect(recommendation)
.toHaveProperty("id");


expect(recommendation.matchId)
.toBe("match001");


});



});



describe("Telemetry Service",()=>{


it("should log telemetry data", async()=>{


await telemetryService.logTelemetry(
"crowd",
{
matchId:"match001",
count:5000
}
);


const data =
await telemetryService.getLatestTelemetry(
"crowd",
"match001",
20
);


expect(Array.isArray(data))
.toBe(true);


});


});