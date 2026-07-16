import type { Scenario } from "./types";

export interface PolicyDecision {
  allowed: boolean;
  requiresApproval: boolean;
  reason: string;
}

export function evaluateActionPolicy(scenario: Scenario, toolName: string): PolicyDecision {
  const tool = scenario.tools.find((candidate) => candidate.name === toolName);
  if (!tool) {
    return { allowed: false, requiresApproval: false, reason: "Tool is not present in this scenario's allowlist." };
  }

  if (tool.permission === "write" && scenario.risk === "high") {
    return {
      allowed: true,
      requiresApproval: true,
      reason: "High-risk write actions require maker-checker approval.",
    };
  }

  return { allowed: true, requiresApproval: false, reason: "Action is allowlisted within the scenario policy." };
}
