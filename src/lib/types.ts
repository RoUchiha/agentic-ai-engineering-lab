export type RiskLevel = "low" | "medium" | "high";
export type AgentRole = "orchestrator" | "retriever" | "specialist" | "risk-reviewer" | "synthesizer";
export type EventStatus = "complete" | "blocked" | "approved";

export interface Evidence {
  id: string;
  source: string;
  excerpt: string;
  relevance: number;
}

export interface ToolDefinition {
  name: string;
  description: string;
  permission: "read" | "write";
  inputSchema: Record<string, string>;
}

export interface AgentEvent {
  id: string;
  atMs: number;
  role: AgentRole;
  action: string;
  detail: string;
  status: EventStatus;
  tool?: string;
}

export interface Scenario {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  businessGoal: string;
  risk: RiskLevel;
  input: Record<string, string | number>;
  evidence: Evidence[];
  tools: ToolDefinition[];
  expectedDecision: string;
  requiresApproval: boolean;
  skills: string[];
}

export interface Evaluation {
  groundedness: number;
  taskSuccess: number;
  policyCompliance: number;
  citationCoverage: number;
  overall: number;
  passed: boolean;
}

export interface AgentRun {
  runId: string;
  scenarioId: string;
  mode: "deterministic" | "openai";
  outcome: "completed" | "approval_required";
  decision: string;
  explanation: string;
  events: AgentEvent[];
  evidence: Evidence[];
  evaluation: Evaluation;
  telemetry: {
    latencyMs: number;
    inputTokens: number;
    outputTokens: number;
    estimatedCostUsd: number;
    toolCalls: number;
    retries: number;
  };
  approval?: {
    reason: string;
    requestedFrom: string;
    safeDefault: string;
  };
}
