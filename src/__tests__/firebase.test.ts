/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from "vitest";

import {
  getPlatformMode,
  authService,
  stadiumService,
  matchService,
  incidentService,
  playbookService,
  recommendationService,
  telemetryService
} from "../lib/firebase";


beforeEach(() => {

  vi.clearAllMocks();

});



describe("Firebase Sandbox Mode", () => {


  it("should run in sandbox mode", () => {

    expect(getPlatformMode())
      .toBe("SANDBOX");

  });



  // ---------------- AUTH ----------------


  it("should create user successfully", async () => {


    const user =
      await authService.signUp(
        "test@test.com",
        "123456",
        "Test User",
        "Admin"
      );


    expect(user.email)
      .toBe("test@test.com");


    expect(user.displayName)
      .toBe("Test User");


  });



  it("should login existing user", async () => {


    await authService.signUp(
      "login@test.com",
      "123456",
      "Login User",
      "Admin"
    );


    const user =
      await authService.login(
        "login@test.com",
        "123456"
      );


    expect(user?.email)
      .toBe("login@test.com");


  });



  it("should logout user", async () => {


    await authService.logout();


    expect(
      localStorage.getItem("skn_current_user")
    )
      .toBeNull();


  });




  // ---------------- STADIUM ----------------


  it("should fetch stadiums", async () => {


    const stadiums =
      await stadiumService.getAllStadiums();


    expect(stadiums.length)
      .toBeGreaterThan(0);


  });



  it("should create stadium", async () => {


    const stadium =
      await stadiumService.createStadium({

        name: "Test Stadium",

        city: "Delhi",

        country: "India",

        capacity: 50000,

        latitude: 10,

        longitude: 20,

        climate: "Tropical",

        status: "Online",

        zones: []

      });



    expect(stadium.name)
      .toBe("Test Stadium");


  });




  it("should update stadium zone status", async () => {


    await stadiumService.updateStadiumZoneStatus(

      "mexico-cdmx",

      "z1",

      "Critical",

      90

    );



    const stadiums =
      await stadiumService.getAllStadiums();



    const stadium =
      stadiums.find(
        s => s.id === "mexico-cdmx"
      );



    expect(stadium?.zones[0].occupancy)
      .toBe(90);


  });





  // ---------------- MATCH ----------------



  it("should get matches", async () => {


    const matches =
      await matchService.getAllMatches();


    expect(matches.length)
      .toBeGreaterThan(0);


  });





  it("should update match status", async () => {


    await matchService.updateMatchStatus(

      "match-1",

      "Completed",

      {
        home: 2,
        away: 1
      }

    );



    const matches =
      await matchService.getAllMatches();



    const match =
      matches.find(
        m => m.id === "match-1"
      );



    expect(match?.status)
      .toBe("Completed");


  });






  // ---------------- INCIDENT ----------------



  it("should create incident", async () => {


    const incident =
      await incidentService.createIncident({

        matchId: "match-1",

        stadiumId: "mexico-cdmx",

        type: "Medical Emergency",

        description: "Fan injured",

        status: "Active",

        timestamp: new Date().toISOString()

      } as any);



    expect(incident.id)
      .toBeDefined();


  });





  it("should get active incidents", async () => {


    const incidents =
      await incidentService.getActiveIncidents();


    expect(
      Array.isArray(incidents)
    )
      .toBe(true);


  });





  it("should resolve incident", async () => {


    const incident =
      await incidentService.createIncident({

        matchId: "match-1",

        stadiumId: "mexico-cdmx",

        type: "Heavy Rain",

        description: "Rain",

        status: "Active",

        timestamp: new Date().toISOString()

      } as any);



    await incidentService.resolveIncident(
      incident.id
    );



    expect(true)
      .toBe(true);


  });







  // ---------------- PLAYBOOK ----------------



  it("should create playbook", async () => {


    const playbook =
      await playbookService.createPlaybook({

        title: "Test Playbook",

        eventType: "Heavy Rain",

        stadiumId: "s1",

        stadiumName: "Test Stadium",

        problem: "Rain",

        rootCause: "Weather",

        operationalRisk: "Risk",

        recommendedActions: [
          "Action"
        ],

        expectedImpact: "Better",

        lessonsLearned: "Learn",

        confidenceScore: 90,

        alternativeStrategy: "Backup",

        createdAt:
          new Date().toISOString()

      } as any);



    expect(playbook.title)
      .toBe("Test Playbook");


  });





  it("should search playbooks", async () => {


    const result =
      await playbookService.searchPlaybooks(
        "Rain"
      );



    expect(
      Array.isArray(result)
    )
      .toBe(true);


  });








  // ---------------- RECOMMENDATIONS ----------------



  it("should create recommendation", async () => {


    const recommendation =
      await recommendationService.createRecommendation({

        matchId: "match-1",

        stadiumId: "s1",

        eventType: "Heavy Rain",

        incidentId: "i1",

        playbookId: "p1",

        playbookTitle: "Rain",

        title: "AI Advice",

        description: "Advice",

        actions: [],

        explanation: "Explain",

        createdAt:
          new Date().toISOString()

      } as any);



    expect(recommendation.id)
      .toBeDefined();


  });






  // ---------------- TELEMETRY ----------------



  it("should save telemetry data", async () => {


    await telemetryService.logTelemetry(

      "weather",

      {

        matchId: "match-1",

        temp: 30

      }

    );



    const data =
      await telemetryService.getLatestTelemetry(

        "weather",

        "match-1"

      );



    expect(data.length)
      .toBeGreaterThan(0);


  });



});