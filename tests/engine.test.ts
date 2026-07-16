import { describe, expect, it } from "vitest";
import { runScenario } from "@/lib/engine";
import { getScenario } from "@/lib/scenarios";

describe("agent runtime", () => {
  it("produces a deterministic, fully grounded run", () => {
    const scenario = getScenario("policy-evidence");
    expect(scenario).toBeDefined();
    const first = runScenario(scenario!);
    const second = runScenario(scenario!);

    expect(first.runId).toBe(second.runId);
    expect(first.evaluation.passed).toBe(true);
    expect(first.evaluation.citationCoverage).toBe(1);
    expect(first.events).toHaveLength(5);
  });

  it("halts a high-risk write at the approval boundary", () => {
    const scenario = getScenario("payment-investigation");
    const run = runScenario(scenario!);

    expect(run.outcome).toBe("approval_required");
    expect(run.approval?.safeDefault).toContain("Hold the payment");
    expect(run.evaluation.policyCompliance).toBe(1);
  });
});
