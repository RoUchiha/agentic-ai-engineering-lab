import { describe, expect, it } from "vitest";
import { evaluateRun } from "@/lib/evaluation";
import { runScenario } from "@/lib/engine";
import { getScenario } from "@/lib/scenarios";

describe("evaluation harness", () => {
  it("fails a response with no citations", () => {
    const scenario = getScenario("policy-evidence")!;
    const baseline = runScenario(scenario);
    const result = evaluateRun(scenario, [], baseline.events);
    expect(result.citationCoverage).toBe(0);
    expect(result.passed).toBe(false);
  });
});
