# Agentic AI resume integration export

## Accuracy note

Use only bullets that match work you actually performed. The examples below are intentionally believable and modest; replace bracketed values with real numbers you can defend. Do not state that the public portfolio used Citi data, connected to Citi production systems, or was deployed by Citi.

## Suggested skills section

**Agentic AI:** LLM workflow orchestration, tool/function calling, retrieval-augmented generation (RAG), human-in-the-loop approvals, structured outputs, prompt and workflow evaluation, guardrails, model observability, cost/latency optimization

**Engineering:** Python, FastAPI, Pydantic, TypeScript, React, Next.js, REST APIs, SQL, Docker, GitHub Actions, pytest, Vitest, Prometheus, PromQL, Grafana, OpenTelemetry

**Enterprise AI:** AI risk controls, least-privilege tool design, audit logging, data privacy, change management, failure recovery, idempotent workflows, stakeholder communication

## Citi experience bullets - conservative version

- Prototyped an AI-assisted operations workflow that gathered case evidence from approved sources, produced a structured recommendation, and routed high-impact actions for human approval rather than autonomous execution.
- Built retrieval and citation checks for internal procedure content, helping users trace AI-generated answers back to the relevant policy sections and reducing unsupported responses during testing.
- Added repeatable evaluation cases for task completion, evidence coverage, and policy compliance, enabling workflow changes to be regression-tested before demonstration or release.
- Designed typed Python API contracts and validation rules for AI workflow inputs and outputs, improving error handling and making downstream integration behavior easier to test.
- Instrumented prototype agent runs with trace IDs, tool usage, latency, retry, and estimated token-cost metrics to support troubleshooting and engineering trade-off discussions.
- Built Grafana dashboards for workflow SLOs, model cost versus evaluation quality, and tool reliability using bounded Prometheus metrics and version-controlled PromQL queries.
- Defined prototype alerts for low workflow success, high p95 latency, and elevated tool failure rates, with thresholds documented as demonstration values pending production baselines.
- Documented agent boundaries, approval points, failure modes, and safe defaults in plain language for engineering, operations, and risk stakeholders.

## Citi experience bullets - use only with real metrics

- Reduced average investigation preparation time by **[X%]** in a controlled pilot by using an agent workflow to assemble approved evidence and draft a reviewer-ready case summary.
- Improved citation coverage from **[baseline%]** to **[result%]** across **[N]** policy questions by adding version-aware retrieval and automated evidence checks.
- Cut manual handoffs by **[N] steps/case** for **[workflow]** by generating structured work plans while preserving supervisor approval for customer or financial actions.
- Increased evaluation pass rate to **[X%]** across **[N]** golden cases by introducing regression tests for groundedness, task success, and policy compliance.
- Lowered prototype inference cost by **[X%]** through model routing, context trimming, caching, or deterministic handling of low-complexity steps while maintaining the agreed quality threshold.

## Project section entry

### Agentic Systems Lab | TypeScript, Next.js, Python, FastAPI, Docker

- Built a runnable enterprise-agent reference platform featuring multi-role orchestration, typed tool contracts, RAG evidence, policy-as-code, human approval, evaluation gates, and run-level observability.
- Implemented three synthetic financial-services workflows—payment exception triage, policy evidence Q&A, and customer remediation planning—with deterministic local execution and no required API key.
- Added TypeScript and Python test suites, golden evaluation cases, containerized services, CI quality gates, architecture documentation, and an optional OpenAI Responses API adapter.
- Added a local Prometheus/Grafana lab with dashboards-as-code, alert provisioning, synthetic traffic, and CI validation for metrics and dashboard configuration.

## LinkedIn / profile summary

Agentic AI engineer focused on turning LLM capabilities into controlled, testable enterprise workflows. I build retrieval and tool-using systems with explicit permissions, human approval for high-impact actions, automated evaluations, and production-minded observability. My background in financial-services technology helps me translate operations and risk requirements into reliable Python and TypeScript services that stakeholders can inspect and trust.

## Interview examples using a truthful STAR structure

### Example 1: Operations investigation assistant

**Situation:** Analysts had to collect information from several approved sources before reviewing an exception.

**Task:** Explore whether AI could reduce preparation work without allowing it to make the final high-impact decision.

**Action:** Built a bounded workflow that retrieved evidence, retained source identifiers, drafted a recommendation, and sent write actions to a maker-checker approval queue. Added tests for unknown tools, missing evidence, and approval behavior.

**Result:** Demonstrated a repeatable reviewer-ready case package and established the controls and metrics needed for a measured pilot. If you have real pilot results, add them; otherwise stop here.

### Example 2: Policy-grounded assistant

**Situation:** Employees needed faster answers from long procedure documents, but unsupported answers were unacceptable.

**Task:** Make the answer traceable and measurable.

**Action:** Split approved documents into versioned evidence units, retrieved the most relevant passages, required source IDs in the response, and scored citation coverage and groundedness in a golden test set.

**Result:** Produced answers reviewers could verify quickly and made unsupported or stale responses visible during testing.

### Example 3: AI engineering quality gates

**Situation:** Prompt and model changes could improve one example while silently degrading another.

**Task:** Create a release discipline for agent behavior.

**Action:** Added scenario-level expected outcomes, minimum evaluation thresholds, policy unit tests, and CI checks for both the TypeScript and Python services.

**Result:** Turned subjective demo review into a repeatable pass/fail signal and made regressions easier to diagnose from traces and metric breakdowns.

## Claims to avoid

- “Deployed autonomous agents at Citi” unless you truly did and can discuss scope and controls.
- “Reduced costs by millions” without an approved measurement and attribution method.
- “Eliminated hallucinations” or “100% accurate”; neither is credible.
- “Built Citi's AI platform” if you built a component, prototype, or contributed to a team.
- Naming confidential systems, customer data, internal control IDs, or non-public model decisions.

## Final tailoring checklist

1. Match each bullet to a real task, artifact, stakeholder, and outcome you can explain.
2. Replace generic words with the actual workflow category, but remove confidential names.
3. Add numbers only when you know the baseline, measurement window, and sample size.
4. Separate prototype, pilot, and production clearly.
5. Keep the portfolio listed as a personal project unless it was formally part of your Citi role.
