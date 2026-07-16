# Security and governance

## Trust model

The model is an untrusted planner. It may transform information and propose actions, but it cannot expand its tool permissions, alter policy, approve its own high-risk action, or declare its own evaluation passed.

## Threats and controls

| Threat | Control in this repository | Production extension |
|---|---|---|
| Prompt injection in retrieved text | Evidence is data, not an instruction channel; tools remain allowlisted | Content scanning, instruction hierarchy tests, document trust labels |
| Excessive agency | Explicit tools and read/write permissions per workflow | Short-lived scoped credentials and per-user authorization |
| Unauthorized money or customer change | High-risk writes stop for approval | Maker-checker identity, signed approval, dual control |
| Hallucinated policy | Versioned evidence IDs and citation coverage | Claim-level entailment and freshness checks |
| Sensitive-data leakage | Synthetic data; errors do not echo secrets | DLP, tokenization, field-level redaction, private networking |
| Hidden quality regression | Golden cases run in CI | Shadow traffic, canary releases, online feedback labels |
| Retry duplication | Demo exposes retries and keeps write tools guarded | Idempotency keys and exactly-once business semantics |
| Supply-chain risk | Pinned framework versions, lockfile, Dependabot | SBOM, signature verification, vulnerability blocking |

## Permission rules

- Tools are denied unless declared in the scenario.
- Read and write capabilities are distinct.
- High-risk write actions produce an approval request only.
- The safe default is to leave source-system state unchanged.
- Model text never becomes authorization evidence.

## Audit record

A production run should retain:

- trace ID, case ID, actor, workflow version, and policy version;
- model/provider version and prompt template hash;
- tool name, normalized arguments, authorization result, and response hash;
- evidence identifiers and versions, not uncontrolled document copies;
- approval identity, timestamp, decision, and reason;
- evaluation metrics, release decision, latency, token usage, and cost.

Logs should avoid raw secrets, access tokens, full customer text, and model chain-of-thought. Store useful outcomes and decision evidence instead.

## Governance lifecycle

1. Define the business owner, technical owner, permitted users, and prohibited uses.
2. Classify data and impact before granting tools.
3. Establish offline quality, safety, latency, and cost thresholds.
4. Red-team prompt injection, data exfiltration, tool misuse, and bypass attempts.
5. Launch with read-only or draft actions, then increase permissions only with evidence.
6. Monitor failures, drift, overrides, and user feedback.
7. Re-approve material changes to models, prompts, tools, data, or autonomy.

## Important non-claim

The portfolio demonstrates engineering patterns. It is not a certification, a model risk approval, or evidence that any bank would accept these exact controls without its own review.
