import type { Scenario } from "./types";

export const scenarios: Scenario[] = [
  {
    id: "payment-investigation",
    eyebrow: "Multi-agent operations",
    title: "Payment exception triage",
    summary: "Investigate a delayed high-value payment, assemble evidence, and recommend the safest next action.",
    businessGoal: "Reduce investigation time while keeping payment release decisions under human control.",
    risk: "high",
    input: {
      caseId: "PAY-2847",
      amountUsd: 485000,
      status: "REPAIR_QUEUE",
      ageMinutes: 47,
    },
    evidence: [
      { id: "ledger-81", source: "Payment ledger", excerpt: "Debit posted; beneficiary credit is pending repair.", relevance: 0.98 },
      { id: "screen-14", source: "Sanctions screening", excerpt: "No party or country match. Screening completed at 09:42 UTC.", relevance: 0.96 },
      { id: "ops-22", source: "Operations runbook", excerpt: "Payments above $250k require maker-checker approval before manual release.", relevance: 0.94 },
    ],
    tools: [
      { name: "read_payment", description: "Read payment state and immutable ledger events.", permission: "read", inputSchema: { caseId: "string" } },
      { name: "screen_parties", description: "Retrieve the latest sanctions-screening result.", permission: "read", inputSchema: { caseId: "string" } },
      { name: "request_release", description: "Create a maker-checker approval request; never releases funds directly.", permission: "write", inputSchema: { caseId: "string", evidenceIds: "string[]" } },
    ],
    expectedDecision: "Request maker-checker review for manual release with ledger and screening evidence attached.",
    requiresApproval: true,
    skills: ["multi-agent orchestration", "tool calling", "human-in-the-loop", "policy-as-code"],
  },
  {
    id: "policy-evidence",
    eyebrow: "RAG + citations",
    title: "Policy evidence assistant",
    summary: "Answer an operations policy question using versioned documents and citation coverage checks.",
    businessGoal: "Give employees fast answers without allowing the model to invent policy.",
    risk: "medium",
    input: {
      question: "Can an analyst close a customer complaint without supervisor review?",
      jurisdiction: "US",
      policyDate: "2026-06-30",
    },
    evidence: [
      { id: "policy-7.2", source: "Complaint Handling Standard v7.2", excerpt: "Closure requires approval by a supervisor who did not author the case response.", relevance: 0.99 },
      { id: "control-119", source: "Control inventory CH-119", excerpt: "Evidence of second-line approval must be retained for seven years.", relevance: 0.91 },
      { id: "faq-31", source: "Operations FAQ", excerpt: "Draft responses may be prepared by analysts; approval remains a supervisory action.", relevance: 0.88 },
    ],
    tools: [
      { name: "search_policy", description: "Hybrid-search approved, versioned policy chunks.", permission: "read", inputSchema: { query: "string", effectiveDate: "date" } },
      { name: "fetch_control", description: "Retrieve control ownership and evidence-retention requirements.", permission: "read", inputSchema: { controlId: "string" } },
    ],
    expectedDecision: "No. An analyst may draft the response, but an independent supervisor must approve closure and the evidence must be retained.",
    requiresApproval: false,
    skills: ["retrieval-augmented generation", "document versioning", "citation verification", "structured output"],
  },
  {
    id: "customer-remediation",
    eyebrow: "Workflow automation",
    title: "Customer remediation planner",
    summary: "Turn a service failure into an auditable plan with ownership, deadlines, and guarded write actions.",
    businessGoal: "Coordinate recovery work across service, operations, and compliance with a clear audit trail.",
    risk: "medium",
    input: {
      caseId: "SR-4401",
      issue: "Duplicate fee after product migration",
      customersAffected: 128,
      slaHoursRemaining: 14,
    },
    evidence: [
      { id: "batch-18", source: "Migration reconciliation", excerpt: "128 accounts received the same duplicate service fee.", relevance: 0.97 },
      { id: "playbook-4", source: "Remediation playbook", excerpt: "Validate cohort, calculate refund, obtain approval, execute, then reconcile.", relevance: 0.95 },
      { id: "sla-2", source: "Customer response SLA", excerpt: "Material fee errors require customer notification within two business days.", relevance: 0.9 },
    ],
    tools: [
      { name: "query_cohort", description: "Read affected account IDs from the approved analytics view.", permission: "read", inputSchema: { caseId: "string" } },
      { name: "draft_work_items", description: "Create draft tasks with owners and deadlines.", permission: "write", inputSchema: { caseId: "string", tasks: "Task[]" } },
      { name: "calculate_refunds", description: "Run deterministic refund calculations with reconciliation totals.", permission: "read", inputSchema: { accountIds: "string[]" } },
    ],
    expectedDecision: "Create a four-step remediation plan, keep refund execution gated, and prioritize notification within the SLA.",
    requiresApproval: false,
    skills: ["workflow design", "idempotency", "structured plans", "audit logging"],
  },
];

export function getScenario(id: string): Scenario | undefined {
  return scenarios.find((scenario) => scenario.id === id);
}
