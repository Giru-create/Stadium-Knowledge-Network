import { describe, it, expect, vi } from "vitest";


// Mock Firebase functions
vi.mock("../lib/firebase", () => ({
  playbookService: {
    createPlaybook: vi.fn(async (data) => ({
      id: "test-playbook-id",
      ...data
    }))
  },

  recommendationService: {
    createRecommendation: vi.fn(async (data) => ({
      id: "test-recommendation-id",
      ...data
    }))
  }
}));


import { aiEngineService } from "../lib/gemini";


describe("Gemini AI Engine Service", () => {


  it("should generate a playbook using fallback AI logic", async () => {


    const result = await aiEngineService.generatePlaybook(
      "match001",
      "stadium001",
      "Narendra Modi Stadium",
      "Heavy Rain",
      "Heavy rain during second half"
    );


    expect(result).toBeDefined();

    expect(result.title)
      .toContain("Narendra Modi Stadium");


    expect(result.confidenceScore)
      .toBeGreaterThan(0);


    expect(result.recommendedActions.length)
      .toBeGreaterThan(0);


  });



  it("should generate match summary", async()=>{


    const summary =
      await aiEngineService.generateMatchSummary(
        "match001"
      );


    expect(summary)
      .toContain("match001");


  });



  it("should generate stadium insights", async()=>{


    const insights =
      await aiEngineService.generateInsights(
        "stadium001"
      );


    expect(insights)
      .toHaveProperty("incidentHeatmap");


    expect(insights.riskReductionPercentage)
      .toBeGreaterThan(0);


    expect(insights.recommendations.length)
      .toBeGreaterThan(0);


  });



});