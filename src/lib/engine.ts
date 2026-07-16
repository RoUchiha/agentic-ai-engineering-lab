import { createHash } from "node:crypto";
import { evaluateRun } from "./evaluation";
import { evaluateActionPolicy } from "./policy";
import type { AgentEvent, AgentRun, Scenario } from "./types";

function stableRunId(scenario: Scenario): string {
  const digest = createHash("sha256").update(`${scenario.id}:${JSON.stringify(scenario.input)}`).digest("hex");
  return `run_${digest.slice(0, 10)}`;
}

function event(index: number, partial: Omit<AgentEvent, "id" | "atMs">): AgentEvent {
  return { id: `evt_${String(index + 1).padStart(2, "0")}`, atMs: 120 + index * 180, ...partial };
}

export function runScenario(scenario: Scenario): AgentRun {
  const writeTool = scenario.tools.find((tool) => tool.permission === "write");
  const selectedTool = writeTool ?? scenario.tools[0];
  const policy = evaluateActionPolicy(scenario, selectedTool.name);
  const events: AgentEvent[] = [
    event(0, { role: "orchestrator", action: "Classify and route", detail: `Risk classified as ${scenario.risk}; selected a bounded workflow.`, status: "complete" }),
    event(1, { role: "retriever", action: "Retrieve evidence", detail: `${scenario.evidence.length} approved sources returned with version and relevance metadata.`, status: "complete", tool: scenario.tools[0].name }),
    event(2, { role: "specialist", action: "Construct recommendation", detail: "Mapped evidence to the business goal and produced a structured decision candidate.", status: "complete" }),
    event(3, { role: "risk-reviewer", action: "Enforce action policy", detail: policy.reason, status: policy.allowed ? (policy.requiresApproval ? "approved" : "complete") : "blocked", tool: selectedTool.name }),
    event(4, { role: "synthesizer", action: "Finalize with citations", detail: "Returned a concise decision, supporting evidence, confidence, and the next safe action.", status: "complete" }),
  ];

  const evaluation = evaluateRun(scenario, scenario.evidence, events);
  const inputTokens = 820 + scenario.evidence.length * 145;
  const outputTokens = 210 + scenario.skills.length * 18;

  return {
    runId: stableRunId(scenario),
    scenarioId: scenario.id,
    mode: "deterministic",
    outcome: policy.requiresApproval ? "approval_required" : "completed",
    decision: scenario.expectedDecision,
    explanation: `The result is grounded in ${scenario.evidence.length} approved sources and checked against the ${scenario.risk}-risk action policy.`,
    events,
    evidence: scenario.evidence,
    evaluation,
    telemetry: {
      latencyMs: 1020 + scenario.evidence.length * 80,
      inputTokens,
      outputTokens,
      estimatedCostUsd: Math.round((inputTokens * 0.000001 + outputTokens * 0.000004) * 10000) / 10000,
      toolCalls: Math.min(3, scenario.tools.length),
      retries: 0,
    },
    approval: policy.requiresApproval
      ? {
          reason: policy.reason,
          requestedFrom: "Operations maker-checker queue",
          safeDefault: "Hold the payment in its current state until a reviewer approves or rejects the request.",
        }
      : undefined,
  };
}
