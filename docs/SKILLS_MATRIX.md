# Agentic AI engineering skills matrix

This map lets a reviewer move from a job requirement to concrete evidence in the repository.

| Employer requirement | Evidence here | Short interview statement |
|---|---|---|
| Agent orchestration | `src/lib/engine.ts`, live execution trace | “I model workflows as explicit states and roles, then keep the control path observable.” |
| Tool/function calling | Tool schemas in `src/lib/scenarios.ts` | “Tools are typed permissions. Unknown tools are denied, and write tools receive stricter policy.” |
| Human-in-the-loop | Payment workflow approval result | “The agent prepares the evidence package; a person retains authority for the high-impact decision.” |
| RAG | Policy workflow evidence and retrieval role | “I preserve source IDs, versions, and relevance so groundedness is measurable.” |
| Evaluation | `src/lib/evaluation.ts`, `evals/cases.json` | “I ship golden cases and release thresholds with the workflow, not as an afterthought.” |
| Guardrails | `src/lib/policy.ts`, policy unit tests | “Authorization is code outside the model; the model cannot grant itself a tool.” |
| Observability | `apps/agent-api/agent_api/metrics.py`, structured API logs | “I instrument the service boundary with bounded operational, quality, cost, policy, and dependency metrics.” |
| Grafana and Prometheus | `observability`, three dashboards and three alert rules | “I provision dashboards and alerts from source control and use PromQL to connect SLO, cost-quality, and tool reliability signals.” |
| Reliability | Deterministic fixtures, stable run IDs, safe defaults | “I design for retries and failures before adding autonomy.” |
| APIs and contracts | Zod route + FastAPI/Pydantic service | “I validate at service boundaries so invalid agent state does not flow downstream.” |
| Python | `apps/agent-api` | “I use FastAPI and Pydantic for typed, testable AI service contracts.” |
| TypeScript/React | Mission-control application | “I build reviewer-friendly interfaces that make agent decisions inspectable.” |
| Testing and CI | Vitest, Pytest, Ruff, GitHub Actions | “Policy, runtime, and golden evaluations are automated quality gates.” |
| Security | Threat model and least-privilege tool design | “I treat the model as an untrusted planner and keep authorization outside it.” |
| Governance | Audit record and lifecycle documentation | “I connect model behavior to ownership, controls, approvals, and change management.” |
| Cost/performance | Token, latency, retry, and estimated cost telemetry | “I make model quality a multi-objective decision across accuracy, latency, and cost.” |
| Deployment | Next.js build, Docker Compose, Vercel-ready app | “I package the full path from local verification to repeatable deployment.” |
| Communication | Plain-language README and interview guide | “I can explain the control flow to operations, risk, and engineering audiences.” |

## Honest scope

The repository demonstrates these skills with synthetic workflows and deterministic fixtures. It does not claim production scale, access to Citi systems, or measured business outcomes. When discussing it, separate what is implemented from what is a documented production extension.
