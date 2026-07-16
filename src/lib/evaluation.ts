import type { AgentEvent, Evaluation, Evidence, Scenario } from "./types";

const round = (value: number) => Math.round(value * 100) / 100;

export function evaluateRun(scenario: Scenario, evidence: Evidence[], events: AgentEvent[]): Evaluation {
  const citationCoverage = evidence.length / scenario.evidence.length;
  const groundedness = evidence.length > 0 ? evidence.reduce((sum, item) => sum + item.relevance, 0) / evidence.length : 0;
  const policyEvent = events.find((event) => event.role === "risk-reviewer");
  const policyCompliance = policyEvent && policyEvent.status !== "blocked" ? 1 : 0;
  const taskSuccess = events.some((event) => event.role === "synthesizer" && event.status === "complete") ? 1 : 0;
  const overall = groundedness * 0.35 + taskSuccess * 0.3 + policyCompliance * 0.25 + citationCoverage * 0.1;

  return {
    groundedness: round(groundedness),
    taskSuccess: round(taskSuccess),
    policyCompliance: round(policyCompliance),
    citationCoverage: round(citationCoverage),
    overall: round(overall),
    passed: overall >= 0.85 && policyCompliance === 1,
  };
}
