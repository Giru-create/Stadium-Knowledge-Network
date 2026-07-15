/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";


// Mock Firebase services
vi.mock("../lib/firebase", () => ({
  playbookService: {
    createPlaybook: vi.fn((data) =>
      Promise.resolve({
        id: "playbook-1",
        ...data,
      })
    ),
  },

  recommendationService: {
    createRecommendation: vi.fn((data) =>
      Promise.resolve({
        id: "recommendation-1",
        ...data,
      })
    ),
  },
}));


describe("AI Engine Service", () => {


  beforeEach(() => {
    vi.clearAllMocks();

    delete process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  });



  it("should generate playbook using local fallback when API key is missing", async () => {


    const { aiEngineService } = await import("../lib/gemini");


    const result =
      await aiEngineService.generatePlaybook(
        "match-101",
        "stadium-1",
        "Wembley Stadium",
        "Heavy Rain",
        "Heavy rainfall during second half"
      );


    expect(result).toBeDefined();

    expect(result.title)
      .toContain("Wembley Stadium");

    expect(result.eventType)
      .toBe("Heavy Rain");

    expect(result.confidenceScore)
      .toBeGreaterThan(0);

  });



  it("should generate playbook from Gemini API successfully", async () => {


    vi.resetModules();

    process.env.NEXT_PUBLIC_GEMINI_API_KEY = "test-key";


    global.fetch = vi.fn(() =>
      Promise.resolve({

        ok: true,

        json: () =>
          Promise.resolve({

            candidates: [
              {
                content: {

                  parts: [
                    {
                      text: JSON.stringify({

                        title: "AI Generated Protocol",

                        eventType: "Medical Emergency",

                        stadiumId: "stadium-1",

                        stadiumName: "Test Stadium",

                        problem: "Medical emergency detected",

                        rootCause: "Heat exhaustion",

                        operationalRisk: "Safety risk",

                        recommendedActions: [
                          "Send medical team",
                          "Clear pathway"
                        ],

                        expectedImpact:
                          "Faster emergency response",

                        lessonsLearned:
                          "Improve monitoring",

                        confidenceScore: 95,

                        alternativeStrategy:
                          "Use backup medical unit"

                      })

                    }
                  ]

                }
              }
            ]

          })

      })
    ) as any;



    const { aiEngineService } =
      await import("../lib/gemini");



    const result =
      await aiEngineService.generatePlaybook(
        "match-1",
        "stadium-1",
        "Test Stadium",
        "Medical Emergency",
        "Fan collapsed"
      );



    expect(result.title)
      .toBe("AI Generated Protocol");


    expect(result.confidenceScore)
      .toBe(95);


  });




  it("should fallback when Gemini API fails", async () => {


    vi.resetModules();

    process.env.NEXT_PUBLIC_GEMINI_API_KEY = "test-key";



    global.fetch = vi.fn(() =>
      Promise.resolve({

        ok:false,

        status:500

      })
    ) as any;



    const { aiEngineService } =
      await import("../lib/gemini");



    const result =
      await aiEngineService.generatePlaybook(
        "match-2",
        "stadium-2",
        "Camp Nou",
        "Power Failure",
        "Lights stopped"
      );



    expect(result)
      .toBeDefined();


    expect(result.eventType)
      .toBe("Power Failure");


  });





  it("should generate AI recommendation", async () => {


    const { aiEngineService } =
      await import("../lib/gemini");



    const playbook:any = {

      id:"pb1",

      title:"Safety Protocol",

      stadiumName:"Old Trafford",

      confidenceScore:90,

      recommendedActions:[

        "Deploy security",

        "Open gates"

      ]

    };



    const result =
      await aiEngineService.generateRecommendation(

        "match1",

        "stadium1",

        "incident1",

        "Large Crowd",

        "Crowd increasing",

        playbook

      );



    expect(result)
      .toBeDefined();



    expect(result.title)
      .toContain("AI Advisory");



    expect(result.actions.length)
      .toBe(2);


  });





  it("should generate match summary", async () => {


    const { aiEngineService } =
      await import("../lib/gemini");


    const result =
      await aiEngineService.generateMatchSummary(
        "match-500"
      );


    expect(result)
      .toContain("match-500");


  });





  it("should generate stadium insights", async () => {


    const { aiEngineService }
      = await import("../lib/gemini");



    const result =
      await aiEngineService.generateInsights(
        "stadium-99"
      );


    expect(result.riskReductionPercentage)
      .toBe(42);



    expect(result.recommendations.length)
      .toBeGreaterThan(0);


  });



});