import { describe, expect, it } from "vitest";
import { evaluateActionPolicy } from "@/lib/policy";
import { getScenario } from "@/lib/scenarios";

describe("policy gate", () => {
  const scenario = getScenario("payment-investigation")!;

  it("rejects tools outside the allowlist", () => {
    expect(evaluateActionPolicy(scenario, "release_payment")).toEqual({
      allowed: false,
      requiresApproval: false,
      reason: "Tool is not present in this scenario's allowlist.",
    });
  });

  it("requires human approval for allowlisted high-risk writes", () => {
    const result = evaluateActionPolicy(scenario, "request_release");
    expect(result.allowed).toBe(true);
    expect(result.requiresApproval).toBe(true);
  });
});
